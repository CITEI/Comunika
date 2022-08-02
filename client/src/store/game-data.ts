import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { toUri } from "../helper/api";
import { sortLinkedList } from "./utils";

/** Stage information */
export interface StageItem {
  _id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  next: string | null;
}

/** Obtains all game stages */
export const fetchStages = createAsyncThunk(
  "gameData/stage",
  async (): Promise<StageItem[]> => {
    const stages = (await api.get("stage")).data as StageItem[];
    return stages.map((el) => ({ ...el, image: toUri(el.image) }));
  }
);

/** Box information */
export interface BoxItem {
  _id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  next: string | null;
}

/** Obtains all game boxes */
export const fetchBoxes = createAsyncThunk(
  "gameData/box",
  async (
    stage: string
  ): Promise<{ stage: string; boxes: BoxItem[] }> => {
    const res = {
      stage,
      boxes: (await api.get(`stage/${stage}/box`))
        .data as BoxItem[],
    };

    res.boxes = res.boxes.map((el) => ({
      ...el,
      image: toUri(el.image),
    }));

    return res;
  }
);

export default createSlice({
  name: "gameData",
  initialState: {
    stages: {
      data: new Array<StageItem>(),
      loaded: false,
    },
    boxes: {} as { [key: string]: BoxItem[] },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStages.fulfilled, (state, action) => {
      state.stages.data = sortLinkedList(action.payload);
      state.stages.loaded = true;
    });
    builder.addCase(fetchBoxes.fulfilled, (state, action) => {
      let boxes = {} as { [key: string]: BoxItem[] };
      boxes[action.payload.stage] = sortLinkedList(
        action.payload.boxes
      );
      state.boxes = { ...state.boxes, ...boxes };
    });
  },
});
