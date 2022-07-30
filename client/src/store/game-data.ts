import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../helper/api";
import { sortLinkedList } from "./utils";

export interface LevelItem {
  _id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  next: string | null;
}

export const fetchLevels = createAsyncThunk(
  "gameData/level",
  async (): Promise<LevelItem[]> => {
    return (await api.get("level")).data as LevelItem[];
  }
);

export interface CategoryItem {
  _id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  next: string | null;
}

export const fetchCategories = createAsyncThunk(
  "gameData/category",
  async (
    level: string
  ): Promise<{ level: string; categories: CategoryItem[] }> => {
    const res = {
      level,
      categories: (await api.get(`level/${level}/category`))
        .data as CategoryItem[],
    };
    return res;
  }
);

export default createSlice({
  name: "gameData",
  initialState: {
    levels: {
      data: new Array<LevelItem>(),
      loaded: false,
    },
    categories: {} as { [key: string]: CategoryItem[] },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLevels.fulfilled, (state, action) => {
      state.levels.data = sortLinkedList(action.payload);
      state.levels.loaded = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      let categories = {} as { [key: string]: CategoryItem[] };
      categories[action.payload.level] = sortLinkedList(
        action.payload.categories
      );
      state.categories = { ...state.categories, ...categories };
    });
  },
});
