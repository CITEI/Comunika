import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { setToken } from "../helper/api";
import store from "./store";
import { saveToken } from "../helper/settings";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";

const ERROR_MESSAGES = {
  [StatusCodes.NOT_FOUND]: "User not found",
};
const GENERIC_MESSAGE = "Invalid credentials";

export const login = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (user, { rejectWithValue }) => {
  try{
    const res = await api.post("/auth", user);
    const token = res.data;
    setToken(token);
    await saveToken(token);
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(ERROR_MESSAGES[err.response!.status] || GENERIC_MESSAGE);
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (user: {
    email: string;
    password: string;
    guardian: string;
    relationship: string;
    birth: string;
    region: string;
    comorbidity: string[];
  }) => {
    await api.post("/auth/register", user);
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
    }),
      builder.addCase(login.rejected, (state, action) => {
        state.authentication = {
          ...state.authentication,
          status: false,
          message: action.payload as string,
        };
      });
    builder.addCase(register.rejected, (state) => {
      state.authentication = { ...state.authentication, status: false };
    });
    builder.addCase(fetchDisabilities.fulfilled, (state, action) => {
      state.disabilities = action.payload;
    });
  },
  reducers: {},
});
