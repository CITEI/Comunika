import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import api, { toUri } from "../helper/api";
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
      stage: data.progress.stage,
      box: data.progress.box,
    },
  };
});

/** Base component for game screens definition */
interface GameNode {
  _id: string;
}

/** Base component for gameplay screens */
export interface BaseNode extends GameNode {
  type: string;
  text: string;
}

/** Node that shows a text along with an image */
export interface TextNode extends BaseNode {
  type: "text";
  image: string;
  imageAlt: string;
}

/** Node that shows a text along with an image/audio carrousel */
export interface CarrouselNode extends BaseNode {
  type: "carrousel";
  images: Array<
    | {
        image: string;
        imageAlt: string;
        audio: string;
      }
    | {
        image: string;
        imageAlt: string;
      }
    | {
        audio: string;
      }
  >;
}

/** Node that shows a text along with a mosaic of images with audio */
export interface AudibleMosaicNode extends BaseNode {
  type: "audible_mosaic";
  images: {
    image: string;
    imageAlt: string;
    audio: string;
  }[];
}

/** Type for nodes all kinds of nodes */
export type Node = TextNode | CarrouselNode | AudibleMosaicNode;

/** Node displayed after gameplay in order to test knowledge */
export interface QuestionNode extends GameNode {
  question: string;
  notes?: string;
}

/** Box challenge definition */
export interface Activity {
  name: string;
  description: string;
  nodes: Node[];
  questionNodes: QuestionNode[];
}

/** Obtains the current user box */
export const fetchBox = createAsyncThunk(
  "user/userbox",
  async (): Promise<Activity[]> => {
    const data = (await api.get(`/user/userbox`)).data;
    return (data.activities as Array<any>).map((el) => ({
      name: el.activity.name,
      description: el.activity.description,
      nodes: el.activity.nodes.map((node) => {
        if (node.type == "text") {
          return {
            ...node,
            image: toUri(node.image),
          };
        } else if (node.type == "carrousel") {
          return {
            ...node,
            images: node.images.map((img) => {
              if (img.audio) img.audio = toUri(img.audio);
              if (img.image) img.image = toUri(img.image);
              return img;
            }),
          };
        } else if (node.type == "audible_mosaic") {
          return {
            ...node,
            images: node.images.map((el) => ({
              ...el,
              image: toUri(el.image),
              audio: toUri(el.image),
            })),
          };
        }
      }),
      questionNodes: el.activity.questionNodes,
    }));
  }
);

/** Grade status of a box evaluation */
export enum EvaluateStatus {
  Approved,
  Reproved,
  NoContent,
}

/** Submits user answers to evaluation */
export const evaluate = createAsyncThunk(
  "user/evaluate",
  async (answers: boolean[][]) => {
    const res = (await api.post(`/user/userbox`, { answers })).data;
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

/** Obtains the boxes an user finished */
export const fetchHistory = createAsyncThunk(
  "user/history",
  async (): Promise<{ box: string }[]> => {
    const res = (await api.get(`/user/history`)).data;
    return (res as Array<any>).map((el) => ({ box: el.box }));
  }
);

export default createSlice({
  name: "user",
  initialState: {
    info: {
      name: null as string | null,
      email: null as string | null,
    },
    progress: {
      stage: null as string | null,
      box: null as string | null,
    },
    userbox: [] as Activity[],
    userboxLoaded: false,
    history: [] as { box: string }[],
    historyLoaded: false,
    loaded: false,
    result: {
      status: EvaluateStatus.NoContent
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.info = action.payload.info;
      state.progress = action.payload.progress;
      state.loaded = true;
    });
    builder.addCase(fetchBox.fulfilled, (state, action) => {
      state.userbox = action.payload;
      state.userboxLoaded = true;
    });
    builder.addCase(evaluate.fulfilled, (state, action) => {
      state.userboxLoaded = false;
      state.historyLoaded = false;
      state.loaded = false;
      state.result = {status: action.payload};
    });
    builder.addCase(fetchHistory.fulfilled, (state, action) => {
      state.history = action.payload;
      state.historyLoaded = true;
    });
  },
});
