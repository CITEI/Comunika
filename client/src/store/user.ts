import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import api from "../helper/api";
import { getToken } from "../helper/token";

interface UserToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

// Waiting for authentication to remove this
const userId = async () =>
  jwtDecode<UserToken>(
    (await getToken({ removeBearer: true })) as unknown as string
  ).id;

export const fetchUserData = createAsyncThunk("user/data", async () => {
  const data = (await api.get(`/user`)).data;
  return {
    info: {
      email: data.email,
      name: data.name,
    },
    progress: {
      level: data.progress.level,
      category: data.progress.category,
    },
  };
});

interface CoreNode {
  _id: string;
  title: string;
}

interface Node extends CoreNode {
  type: string;
  [key: string]: any;
}

interface QuestionNode extends CoreNode {
  question: string;
}

interface Task {
  name: string;
  description: string;
  nodes: Node[];
  questionNodes: QuestionNode[];
}

export const fetchBox = createAsyncThunk(
  "user/box",
  async (): Promise<Task[]> => {
    const data = (await api.get(`/user/box`)).data;
    return (data.tasks as Array<any>).map((el) => ({
      name: el.task.name,
      description: el.task.description,
      nodes: el.task.nodes,
      questionNodes: el.task.questionNodes,
    }));
  }
);

export enum EvaluateStatus {
  Approved,
  Reproved,
  NoContent,
}

export const evaluate = createAsyncThunk(
  "user/evaluate",
  async (answers: boolean[][]) => {
    const res = (await api.post(`/user/box`, { answers })).data;
    switch (res.status) {
      case "approved":
        return EvaluateStatus.Approved;
      case "reproved":
        return EvaluateStatus.Reproved;
      default:
        return EvaluateStatus.NoContent;
    }
  }
);

export const fetchHistory = createAsyncThunk(
  "user/history",
  async (): Promise<{category: string}[]> => {
    const res = (await api.get(`/user/history`)).data;
    return (res as Array<any>).map((el) => ({category: el.category}));
  }
);

export default createSlice({
  name: "user",
  initialState: {
    info: {
      name: null,
      email: null,
    },
    progress: {
      level: null,
      category: null,
    },
    box: [] as Task[],
    boxLoaded: false,
    history: [] as {category: string}[],
    historyLoaded: false,
    loaded: false,
    result: EvaluateStatus.NoContent,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.info = action.payload.info;
      state.progress = action.payload.progress;
      state.loaded = true;
    });
    builder.addCase(fetchBox.fulfilled, (state, action) => {
      state.box = action.payload;
      state.boxLoaded = true;
    });
    builder.addCase(evaluate.fulfilled, (state, action) => {
      state.boxLoaded = false;
      state.historyLoaded = false;
      state.loaded = false;
      state.result = action.payload;
    });
    builder.addCase(fetchHistory.fulfilled, (state, action) => {
      state.history = action.payload;
      state.historyLoaded = true;
    });
  },
});
