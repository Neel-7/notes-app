import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signUp } from "../store/authSlice";

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(signUp({ email, password }));
    if (signUp.fulfilled.match(result)) navigate("/");
  };

  return (
    <div>
      <h1>Create account</h1>
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
          {status === "loading" ? "Creating..." : "Sign up"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Link to="/login">Already have an account?</Link>
    </div>
  );
}
