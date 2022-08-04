import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { toUri } from "../helper/api";
import { sortLinkedList } from "./utils";

/** Module information */
export interface ModuleItem {
  _id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  next: string | null;
}

/** Obtains all game modules */
export const fetchModules = createAsyncThunk(
  "gameData/module",
  async (): Promise<ModuleItem[]> => {
    const modules = (await api.get("module")).data as ModuleItem[];
    return modules.map((el) => ({ ...el, image: toUri(el.image) }));
  }
);

/** Stage information */
export interface StageItem {
  _id: string;
  name: string;
  description: string;
  next: string | null;
}

/** Obtains all game stages */
export const fetchStages = createAsyncThunk(
  "gameData/stage",
  async (
    module: string
  ): Promise<{ module: string; stages: StageItem[] }> => {
    const res = {
      module,
      stages: (await api.get(`module/${module}/stage`))
        .data as StageItem[],
    };

    return res;
  }
);

export default createSlice({
  name: "gameData",
  initialState: {
    modules: {
      data: new Array<ModuleItem>(),
      loaded: false,
    },
    stages: {} as { [key: string]: StageItem[] },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchModules.fulfilled, (state, action) => {
      state.modules.data = sortLinkedList(action.payload);
      state.modules.loaded = true;
    });
    builder.addCase(fetchStages.fulfilled, (state, action) => {
      let stages = {} as { [key: string]: StageItem[] };
      stages[action.payload.module] = sortLinkedList(
        action.payload.stages
      );
      state.stages = { ...state.stages, ...stages };
    });
  },
});
