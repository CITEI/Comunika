import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { setToken } from "../helper/api";
import store, { useAppDispatch } from "./store";
import { saveToken } from "../helper/settings";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";

const ERROR_MESSAGES = {
  [StatusCodes.NOT_FOUND]: "User not found",
};

const GENERIC_MESSAGE = "Invalid credentials";

export interface UserI {
  name: string,
  email: string,
  password: string,
  disabilities: string[],
  user: string
}

export interface ParentI extends UserI {
  relationship: string,
  region: string,
  birth: Date
}

export interface EducatorI extends UserI {
  school: string,
  numberOfDisabledStudents: number
}

export const login = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (user, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth", user);
    const token = res.data;
    setToken(token);
    await saveToken(token);
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(GENERIC_MESSAGE);
  }
});

export const registerParent = createAsyncThunk(
  "auth/register/parent",
  async (user: ParentI) => {
    await api.post("/auth/register/parent", user);
    store.dispatch(login({ email: user.email, password: user.password }));
  }
);

export const registerEducator = createAsyncThunk(
  "auth/register/educator",
  async (user: EducatorI) => {
    await api.post("/auth/register/educator", user);
    store.dispatch(login({ email: user.email, password: user.password }));
  }
);


interface Disability {
  _id: string;
  name: string;
}

export const fetchDisabilities = createAsyncThunk(
  "auth/disabilities",
  async (): Promise<Disability[]> => {
    return (await api.get("/auth/disabilities")).data as Disability[];
  }
);

export const resetpass = createAsyncThunk(
  "auth/reset-password/",
  async ({
    email,
    token,
    password,
  }: {
    email: string;
    token: string;
    password: string;
  }, { rejectWithValue }) => {
    try {
      const data = await api.post("/auth/reset-password/", { email, token, password });
      return data.status;
    } catch (err) {
      return rejectWithValue(GENERIC_MESSAGE);
    }
  }
);

export const sendcode = createAsyncThunk(
  "/auth/passreset/sendcode",
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await api.post("/auth/reset-password/send", { email });
      return data.status;
    } catch (err) {
      return rejectWithValue(GENERIC_MESSAGE);
    }
  }
);

export const codeverify = createAsyncThunk(
  "auth/reset-password/validate",
  async (
    { email, token }: { email: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await api.post("/auth/reset-password/validate", {
        email,
        token,
      });
      return data.status;
    } catch (err) {
      return rejectWithValue(GENERIC_MESSAGE);
    }
  }
);


interface InitialState {
  authentication: {
    status: boolean;
    message: string;
  };
  disabilities: Disability[];
}

export default createSlice({
  name: "auth",
  initialState: {
    authentication: { status: false, message: "" },
    disabilities: [],
  } as InitialState,
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state) => {
      state.authentication = { ...state.authentication, status: true };
    });
    builder.addCase(login.rejected, (state, action) => {
      state.authentication = {
        ...state.authentication,
        status: false,
        message: action.payload as string,
      };
    });
    builder.addCase(registerParent.rejected, (state) => {
      state.authentication = { ...state.authentication, status: false };
    });
    builder.addCase(registerEducator.rejected, (state) => {
      state.authentication = { ...state.authentication, status: false };
    });
    builder.addCase(fetchDisabilities.fulfilled, (state, action) => {
      state.disabilities = action.payload;
    });
  },
  reducers: {},
});
