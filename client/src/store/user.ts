import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserI } from "./auth";
import api from "../helper/api";

export const fetchUserData = createAsyncThunk("user/data", async () => {
  const data = (await api.get(`/user`)).data as UserI;
  return data as UserI;
});

/** Obtains the stages an user finished */
export const fetchHistory = createAsyncThunk(
  "user/history",
  async (): Promise<{ stage: string }[]> => {
    const res = (await api.get(`/user/history`)).data;
    return (res as Array<any>).map((el) => ({ stage: el.stage }));
  }
);

export default createSlice({
  name: "user",
  initialState: {
    info: {} as UserI,
    loaded: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.info = action.payload;
      state.loaded = true;
    });
  },
});
