import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>;
}

const initialState: UIState = {
  sidebarOpen: true,
  activeModal: null,
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<UIState["notifications"][0], "id">>
    ) => {
      state.notifications.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const {
  toggleSidebar,
  setSidebar,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
} = uiSlice.actions;
export default uiSlice.reducer;
