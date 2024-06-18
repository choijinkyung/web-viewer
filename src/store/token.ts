import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const name = 'token';
type stateType = {
  accessToken: string;
  refreshToken: string;
};

const initialState: stateType = {
  accessToken: localStorage.getItem('accessToken') ?? '',
  refreshToken: localStorage.getItem('refreshToken') ?? '',
};

const tokenSlice = createSlice({
  name,
  initialState,
  reducers: {
    setAccessToken: (state: stateType, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
    },
    setRefreshToken: (state: stateType, action: PayloadAction<{ refreshToken: string }>) => {
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: {},
});
export const { setAccessToken, setRefreshToken } = tokenSlice.actions;
export default tokenSlice;
