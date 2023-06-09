import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toUri } from "../helper/api";
import api from "../helper/api";

export interface Module {
  id: string,
  name: string,
  imageAlt: string,
  image: string,
  available: boolean,
  done: boolean,
  previous: string | null
}

export const fetchModules = createAsyncThunk("modules/data", async () => {
  const response = await api.get('user/modules');
  const data: Module[] = response.data;
  return data.map(e => ({ ...e, image: toUri(e.image) }));
});

export default createSlice({
  name: "modules",
  reducers: {},
  initialState: {
    data: new Array<Module>(),
    loaded: false
  },
  extraReducers: (builder) => {
    builder.addCase(fetchModules.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loaded = true;
    });
  }
});