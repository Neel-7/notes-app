import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signIn } from "../store/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(signIn({ email, password }));
    if (signIn.fulfilled.match(result)) navigate("/");
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Link to="/signup">Create account</Link> ·{" "}
      <Link to="/reset-password">Forgot password?</Link>
    </div>
  );
}
