import { useEffect, useRef } from "react";
import { useAppDispatch } from "../store/hooks";
import { updateNote } from "../store/notesSlice";
import type { Block } from "@blocknote/core";

export default function useAutoSave(
  noteId: string | null,
  title: string,
  content: Block[],
) {
  const dispatch = useAppDispatch();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!noteId) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      dispatch(updateNote({ id: noteId, data: { title, content } }));
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [noteId, title, content, dispatch]);
}
