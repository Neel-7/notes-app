import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { resetPassword } from "../store/authSlice";

export default function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(resetPassword(email));
    if (resetPassword.fulfilled.match(result)) setSent(true);
  };

  if (sent)
    return (
      <p>
        Check your email for a reset link.{" "}
        <Link to="/login">Back to login</Link>
      </p>
    );

  return (
    <div>
      <h1>Reset password</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send reset email"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Link to="/login">Back to login</Link>
    </div>
  );
}
