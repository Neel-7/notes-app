import { useEffect, useRef } from "react";
import { subscribeToNotes } from "../store/notesSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function NotesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const uid = useAppSelector((s) => s.auth.user?.uid);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (uid) {
      unsubRef.current = subscribeToNotes(uid, dispatch);
    }
    return () => {
      unsubRef.current?.();
    };
  }, [uid, dispatch]);

  return <>{children}</>;
}
