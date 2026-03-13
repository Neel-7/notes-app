import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYHfEUUBpc3lIxe5xAcZTGP8SI0NnCKeI",
  authDomain: "notes-app-39dbb.firebaseapp.com",
  projectId: "notes-app-39dbb",
  storageBucket: "notes-app-39dbb.firebasestorage.app",
  messagingSenderId: "155361687206",
  appId: "1:155361687206:web:3f8857b283776daa746667",
  measurementId: "G-6C0YXG1XWQ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
