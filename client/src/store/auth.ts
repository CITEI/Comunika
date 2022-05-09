import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/api";
import store from "./store";
import { saveToken } from "../helper/token";


export const login = createAsyncThunk(
  "auth/login",
  async (user: { email: string; password: string }) => {
    const token = (await api.post("/auth", user)).data;
    api.defaults.headers.common["Authorization"] = token;
    await saveToken(token);
    return token;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (user: { email: string; password: string; name: string }) => {
    await api.post("/auth/register", user);
    store.dispatch(login({ email: user.email, password: user.password }));
  }
);

export default createSlice({
  name: "auth",
  initialState: {
    status: {
      isAuthenticated: false,
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state) => {
      state.status = { ...state.status, isAuthenticated: true };
    }),
      builder.addCase(login.rejected, (state) => {
        state.status = { ...state.status, isAuthenticated: false };
      });
    builder.addCase(register.rejected, (state) => {
      state.status = { ...state.status, isAuthenticated: false };
    });
  },
  reducers: {},
});
