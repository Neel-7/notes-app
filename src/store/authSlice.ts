import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";

import { auth } from "../firebase/config";

// ── Types ───────────────────────────────────────────────────

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  initialized: boolean;
}

// ── Helper ──────────────────────────────────────────────────

const serializeUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

// ── Async Thunks ────────────────────────────────────────────

export const signUp = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/signUp", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return serializeUser(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signup failed";
    return rejectWithValue(message);
  }
});

export const signIn = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/signIn", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return serializeUser(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signin failed";
    return rejectWithValue(message);
  }
});

export const logOut = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logOut",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Logout failed";
      return rejectWithValue(message);
    }
  },
);

export const resetPassword = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("auth/resetPassword", async (email, { rejectWithValue }) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Password reset failed";
    return rejectWithValue(message);
  }
});

// ── Initial State ───────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  initialized: false,
};

// ── Slice ───────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.initialized = true;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ── SignUp ──
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Signup failed";
      })

      // ── SignIn ──
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Signin failed";
      })

      // ── Logout ──
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      })
      .addCase(logOut.rejected, (state, action) => {
        state.error = action.payload ?? "Logout failed";
      })

      // ── Reset Password ──
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Password reset failed";
      });
  },
});

// ── Exports ─────────────────────────────────────────────────

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
