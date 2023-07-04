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

const modulesSlice = createSlice({
  name: "modules",
  reducers: {
    markModulesAsLoading: (state) => {
      state.loading = false;
    },
  },
  initialState: {
    data: new Array<Module>(),
    loading: false
  },
  extraReducers: (builder) => {
    builder.addCase(fetchModules.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
  }
});

export default modulesSlice;
export const { markModulesAsLoading } = modulesSlice.actions;