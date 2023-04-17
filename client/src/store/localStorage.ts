import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { StorageBox, readBox } from "./local/GameStorage";

export const readStorage = createAsyncThunk("localStorage/box", async () => {
  const box = await readBox();
  return box;
});

export default createSlice({
  name: "localStorage",
  reducers: {},
  initialState: {
    box: {} as StorageBox,
    loaded: false,
  },
  extraReducers: (builder) => {
    builder.addCase(readStorage.fulfilled, (state, action) => {
      state.box = action.payload;
      state.loaded = true;
    });
  }
});