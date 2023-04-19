import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteBox } from "./local/GameStorage";
import api from "../helper/api";

interface UserInfo {
  _id?: string;
  email?: string;
  birth?: string;
  disabilities?: string[];
  guardian?: string;
  region?: string;
  relationship?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const fetchUserData = createAsyncThunk("user/data", async () => {
  const data = (await api.get(`/user`)).data;
  return data as UserInfo;
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
    info: {} as UserInfo,
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
