import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { toUri } from "../helper/api";

interface UserInfo {
  email?: string;
  birth?: string;
  comorbidity: string[];
  guardian?: string;
  region?: string;
  relationship?: string;
}

interface UserProgress {
  module?: string;
  stage?: string;
  box?: Activity[];
  evaluation: EvaluateStatus;
}

export const fetchUserData = createAsyncThunk("user/data", async () => {
  const data = (await api.get(`/user`)).data;
  return {
    info: {
      email: data.email,
      birth: data.birth,
      comorbidity: data.comorbidity,
      guardian: data.guardian,
      region: data.region,
      relationship: data.relationship,
    } as UserInfo,
    progress: {
      module: data.progress.module,
      stage: data.progress.stage,
    } as UserProgress,
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
  audio?: string;
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
  preview: boolean;
}

/** Type for nodes all kinds of nodes */
export type Node = TextNode | CarrouselNode;

/** Node displayed after gameplay in order to test knowledge */
export interface QuestionNode extends GameNode {
  question: string;
  notes?: string;
}

/** Stage challenge definition */
export interface Activity {
  name: string;
  nodes: Node[];
  questionNodes: QuestionNode[];
}

/** Obtains the current user stage */
export const fetchBox = createAsyncThunk(
  "user/box",
  async (): Promise<{
    activities?: Activity[];
    module: string;
    stage: string;
  }> => {
    const res = await api.get(`/user/box`);
    const data = res.data;
    if ("activities" in res.data)
      return {
        stage: data.stage,
        module: data.module,
        activities: (data.activities as Activity[]).map((el) => ({
          name: el.name,
          nodes: el.nodes.map((node) => {
            if (node.type == "text") {
              const newNode = {
                ...node,
                image: toUri(node.image),
              };
              if (node.audio) newNode.audio = toUri(node.audio);
              return newNode;
            } else {
              return {
                ...node,
                images: node.images.map((img) => {
                  if ("audio" in img) img.audio = toUri(img.audio);
                  if ("image" in img) img.image = toUri(img.image);
                  return img;
                }),
              };
            }
          }),
          questionNodes: el.questionNodes,
        })),
      };
    else
      return {
        activities: undefined,
        module: data.module,
        stage: data.stage,
      };
  }
);

/** Grade status of a stage evaluation */
export enum EvaluateStatus {
  Approved = "approved",
  Reproved = "reproved",
}

/** Submits user answers to evaluation */
export const evaluate = createAsyncThunk(
  "user/evaluate",
  async (answers: boolean[][]) => {
    const res = (await api.post(`/user/box`, { answers })).data;
    if (res.status == "approved") return EvaluateStatus.Approved;
    else return EvaluateStatus.Reproved;
  }
);

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
    info: {
      comorbidity: [],
    } as UserInfo,
    progress: {
      module: undefined as string | undefined,
      stage: undefined as string | undefined,
      box: [] as Activity[] | undefined,
      evaluation: EvaluateStatus.Approved,
    } as UserProgress & { box?: Activity[] },
    history: [] as { stage: string }[],
    flags: {
      box: false,
      history: false,
      info: false,
      no_content: false,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.info = action.payload.info;
      state.progress = Object.assign(
        {},
        state.progress,
        action.payload.progress
      );
      state.flags.info = true;
    });
    builder.addCase(fetchBox.fulfilled, (state, action) => {
      state.progress.stage = action.payload.stage;
      state.progress.module = action.payload.module;
      if (action.payload.activities)
        state.progress.box = action.payload.activities;
      else {
        state.flags.no_content = true;
        state.progress.box = undefined;
      }
      state.flags.box = true;
    });
    builder.addCase(evaluate.fulfilled, (state, action) => {
      state.flags.box = false;
      state.flags.history = false;
      state.progress.evaluation = action.payload;
    });
    builder.addCase(fetchHistory.fulfilled, (state, action) => {
      state.history = action.payload;
      state.flags.history = true;
    });
  },
});
