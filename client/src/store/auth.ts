import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { setToken } from "../helper/api";
import store from "./store";
import { saveToken } from "../helper/settings";
import { AxiosError } from "axios";
import { ErrorNames } from "../helper/error";

export interface UserI {
  name: string;
  email: string;
  password: string;
  disabilities: string[];
  user: string;
}

export interface ParentI extends UserI {
  relationship: string;
  region: string;
  birth: Date;
}

export interface EducatorI extends UserI {
  school: string;
  numberOfDisabledStudents: number;
}

export const login = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: ErrorNames }
>("auth/login", async (user, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth", user);
    const token = res.data;
    setToken(token);
    await saveToken(token);
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue("InvalidCredentials");
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

interface ResetPassInput {
  email: string;
  token: string;
  password?: string;
}

export const resetpass = createAsyncThunk<
  number,
  ResetPassInput,
  { rejectValue: ErrorNames }
>(
  "auth/reset-password/",
  async ({ email, token, password }, { rejectWithValue }) => {
    try {
      const data = await api.post("/auth/reset-password/", {
        email,
        token,
        password,
      });
      return data.status;
    } catch (err) {
      return rejectWithValue("InvalidCredentials");
    }
  }
);

export const sendcode = createAsyncThunk<
  number,
  string,
  { rejectValue: ErrorNames }
>("/auth/passreset/sendcode", async (email, { rejectWithValue }) => {
  try {
    const data = await api.post("/auth/reset-password/send", { email });
    return data.status;
  } catch (err) {
    return rejectWithValue("EmailNotFound");
  }
});

export const codeverify = createAsyncThunk<
  number,
  ResetPassInput,
  { rejectValue: ErrorNames }
>(
  "auth/reset-password/validate",
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const data = await api.post("/auth/reset-password/validate", {
        email,
        token,
      });
      return data.status;
    } catch (err) {
      return rejectWithValue("InvalidToken");
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
        message: action.payload!,
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
