import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { setUser } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import NotesProvider from "./NotesProvider";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((s) => s.auth.initialized);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(
        setUser(
          user
            ? {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              }
            : null,
        ),
      );
    });
    return unsubscribe;
  }, [dispatch]);

  if (!initialized)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );

  return <NotesProvider>{children}</NotesProvider>;
}
