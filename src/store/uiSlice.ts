import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarOpen: boolean;
  searchQuery: string;
}

const initialState: UIState = {
  sidebarOpen: true,
  searchQuery: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const { toggleSidebar, setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
