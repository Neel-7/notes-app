import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";

export interface Note {
  id: string;
  title: string;
  content: unknown[];
  tags: string[];
  uid: string;
  createdAt: number;
  updatedAt: number;
}

interface NotesState {
  items: Note[];
  activeNoteId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NotesState = {
  items: [],
  activeNoteId: null,
  status: "idle",
  error: null,
};

export const createNote = createAsyncThunk(
  "notes/create",
  async (uid: string, { rejectWithValue }) => {
    try {
      const ref = await addDoc(collection(db, "notes"), {
        title: "Untitled",
        content: [],
        tags: [],
        uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return ref.id;
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue("Failed to create note");
    }
  },
);

export const updateNote = createAsyncThunk(
  "notes/update",
  async (
    {
      id,
      data,
    }: { id: string; data: Partial<Omit<Note, "id" | "uid" | "createdAt">> },
    { rejectWithValue },
  ) => {
    try {
      await updateDoc(doc(db, "notes", id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue("Failed to update note");
    }
  },
);

export const deleteNote = createAsyncThunk(
  "notes/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "notes", id));
      return id;
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue("Failed to delete note");
    }
  },
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes(state, action: PayloadAction<Note[]>) {
      state.items = action.payload;
      state.status = "succeeded";
    },
    setActiveNote(state, action: PayloadAction<string | null>) {
      state.activeNoteId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNote.fulfilled, (state, action) => {
        state.activeNoteId = action.payload as string;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        if (state.activeNoteId === action.payload) state.activeNoteId = null;
      });
  },
});

export const { setNotes, setActiveNote } = notesSlice.actions;
export default notesSlice.reducer;

// Firestore real-time listener — call once after login
export const subscribeToNotes = (
  uid: string,
  dispatch: (action: unknown) => void,
) => {
  const q = query(
    collection(db, "notes"),
    where("uid", "==", uid),
    orderBy("updatedAt", "desc"),
  );
  return onSnapshot(q, (snap) => {
    const notes: Note[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Note, "id">),
      createdAt: d.data().createdAt?.toMillis?.() ?? Date.now(),
      updatedAt: d.data().updatedAt?.toMillis?.() ?? Date.now(),
    }));
    dispatch(setNotes(notes));
  });
};
