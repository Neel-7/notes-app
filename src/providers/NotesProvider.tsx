import { useEffect, useRef } from "react";
import { subscribeToNotes } from "../store/notesSlice";
import { subscribeToTags } from "../store/tagsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function NotesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const uid = useAppSelector((s) => s.auth.user?.uid);
  const unsubNotes = useRef<(() => void) | null>(null);
  const unsubTags = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (uid) {
      unsubNotes.current = subscribeToNotes(uid, dispatch);
      unsubTags.current = subscribeToTags(uid, dispatch);
    }
    return () => {
      unsubNotes.current?.();
      unsubTags.current?.();
    };
  }, [uid, dispatch]);

  return <>{children}</>;
}
