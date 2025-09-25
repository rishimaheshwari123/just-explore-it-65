import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for the state
interface AuthState {
  loading: boolean;
  token: string | null;
  user: Record<string, any> | null;
  signupData: Record<string, any> | null;
}

// Initial state with type
const initialState: AuthState = {
  loading: false,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token") as string)
    : null,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,
  signupData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ setSignupData
    setSignupData(state, action: PayloadAction<Record<string, any> | null>) {
      state.signupData = action.payload;
    },
    // ✅ Type for setLoading
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // ✅ Type for setToken
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      localStorage.setItem("token", JSON.stringify(action.payload));
    },
    // ✅ Type for setUser
    setUser(state, action: PayloadAction<Record<string, any> | null>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    // ✅ Logout action
    logout(state) {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.signupData = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

// Export actions
export const { setSignupData, setLoading, setToken, setUser, logout } =
  authSlice.actions;

// Export reducer
export default authSlice.reducer;
