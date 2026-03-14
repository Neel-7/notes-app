import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  increment,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export interface Tag {
  id: string;
  name: string;
  noteCount: number;
  uid: string;
}

interface TagsState {
  items: Tag[];
  activeTagId: string | null;
}

const initialState: TagsState = {
  items: [],
  activeTagId: null,
};

export const addTagToNote = createAsyncThunk(
  "tags/addToNote",
  async (
    { tagName, noteId, uid }: { tagName: string; noteId: string; uid: string },
    { rejectWithValue },
  ) => {
    try {
      const tagId = tagName.toLowerCase().trim().replace(/\s+/g, "-");
      const tagRef = doc(db, "tags", `${uid}_${tagId}`);
      const tagSnap = await getDoc(tagRef);

      if (tagSnap.exists()) {
        await updateDoc(tagRef, { count: increment(1) });
      } else {
        await setDoc(tagRef, { name: tagName.trim(), count: 1, uid });
      }

      const noteRef = doc(db, "notes", noteId);
      const noteSnap = await getDoc(noteRef);
      const existing: string[] = noteSnap.data()?.tags ?? [];
      if (!existing.includes(tagName.trim())) {
        await updateDoc(noteRef, { tags: [...existing, tagName.trim()] });
      }
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue("Failed to add tag to note");
    }
  },
);

export const removeTagFromNote = createAsyncThunk(
  "tags/removeFromNote",
  async (
    { tagName, noteId, uid }: { tagName: string; noteId: string; uid: string },
    { rejectWithValue },
  ) => {
    try {
      const tagId = tagName.toLowerCase().trim().replace(/\s+/g, "-");
      const tagRef = doc(db, "tags", `${uid}_${tagId}`);
      const tagSnap = await getDoc(tagRef);

      if (tagSnap.exists()) {
        const current = tagSnap.data().count;
        if (current <= 1) {
          await deleteDoc(tagRef);
        } else {
          await updateDoc(tagRef, { count: increment(-1) });
        }
      }

      const noteRef = doc(db, "notes", noteId);
      const noteSnap = await getDoc(noteRef);
      const existing: string[] = noteSnap.data()?.tags ?? [];
      await updateDoc(noteRef, { tags: existing.filter((t) => t !== tagName) });
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue("Failed to remove tag from note");
    }
  },
);

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    setTags(state, action: PayloadAction<Tag[]>) {
      state.items = action.payload;
    },
    setActiveTag(state, action: PayloadAction<string | null>) {
      state.activeTagId = action.payload;
    },
  },
});

export const { setTags, setActiveTag } = tagsSlice.actions;
export default tagsSlice.reducer;

export const subscribeToTags = (
  uid: string,
  dispatch: (action: unknown) => void,
) => {
  const q = query(collection(db, "tags"), where("uid", "==", uid));
  return onSnapshot(q, (snap) => {
    const tags: Tag[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Tag, "id">),
    }));
    dispatch(setTags(tags));
  });
};
