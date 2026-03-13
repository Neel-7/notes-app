import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const user = useAppSelector((s) => s.auth.user);

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
