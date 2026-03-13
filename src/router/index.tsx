import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import AppShell from "../components/layout/AppShell";
import NotesPage from "../pages/NotesPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [{ index: true, element: <NotesPage /> }],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
]);
