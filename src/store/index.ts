import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import notesReducer from "./notesSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
