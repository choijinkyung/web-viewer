import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const name = 'login';
type stateType = {
  user: { userID: string; loginBoolean: boolean };
};

const initialState: stateType = {
  user: { userID: '', loginBoolean: false },
};


const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    setLogin: (state: stateType, action: PayloadAction<{ userID: string; loginBoolean: boolean }>) => {
      state.user.userID = action.payload.userID;
      state.user.loginBoolean = action.payload.loginBoolean;
    },
  },
  extraReducers: {},
});
export const { setLogin } = authSlice.actions;
export default authSlice;