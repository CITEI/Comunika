import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBox, insertBox, readBox, StorageBox, deleteBox } from './local/GameStorage';
import { toUri } from "../helper/api";
import api from "../helper/api";
import moment from 'moment';

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

export interface Activity {
  _id: string;
  name: string;
  nodes: Node[];
  questionNodes: QuestionNode[];
}

interface Box {
  createdAt: Date;
  module: string;
  attempt: number;
}

interface ResponseBox extends Box {
  activities: {
    activity: Activity;
    answers: string[];
  }[];
}

export interface AppBox extends Box {
  activities: Activity[];
  answers: (string | boolean)[][];
  activitiesNumber?: number;
  activitiesProgress?: number;
}

export interface BoxMap {
  [key: string]: AppBox
}

export const fetchBox = createAsyncThunk("user/box", async (id: string) => {
  const response = await api.get(`user/box/${id}`);
  const local = await getBox(id);
  const data = response.data as ResponseBox;

  const box = {
    createdAt: data.createdAt,
    module: data.module,
    answers: local?.answers ?? [],
    attempt: data.attempt,
    activities: data.activities.map(el => {
      const activity = el.activity;
      return {
        _id: activity._id,
        name: activity.name,
        nodes: activity.nodes.map(node => {
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
        questionNodes: activity.questionNodes
      }
    })
  } as AppBox;

  await insertBox(box);
  return box;
});

export const readAnswers = createAsyncThunk("user/storage/answers", async () => {
  const box = await readBox();
  return box;
});

export const evaluate = createAsyncThunk(
  "user/evaluate",
  async ({ module, answers }: { module: string, answers: (string | boolean)[][] }) => {
    const res = (await api.post(`/user/box/${module}`, { answers })).data;
    await deleteBox(module);
    return {grade: res, module: module};
  }
);

export default createSlice({
  name: "progress",
  reducers: {},
  initialState: {
    box: undefined as (AppBox | undefined),
    answers: {} as StorageBox, 
    history: undefined,
    grade: undefined as (number | undefined),
    flags: {
      box: false,
      answers: false,
      history: false
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBox.fulfilled, (state, action) => {
      state.box = action.payload;
      state.flags.box = true;
    });
    builder.addCase(readAnswers.fulfilled, (state, action) => {
      state.answers = action.payload;
      state.flags.answers = true;
    });
    builder.addCase(evaluate.fulfilled, (state, action) => {
      state.grade = action.payload.grade;
      state.box = undefined;
      state.flags.box = false;
      state.flags.answers = false;
    });
  }
});