import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtUtil } from '@utils/JwtHelper';

interface Params {
  user_id?: string;
}
export const hangingActions = {
  getHangingProtocolList: createAsyncThunk(
    'GET/HANGING/LIST',
    async (user_id: Params, { fulfillWithValue, rejectWithValue }) => {
      return axios({
        method: 'get',
        url: `/api/v1/hanging/${user_id}`,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
      })
        .then((res) => res.data)
        .catch(async (error) => {
          const jwt = await jwtUtil(error);
          if (jwt.message === 'Retry success') {
            return fulfillWithValue(jwt.response.data);
          }
        });
    },
  )
};

const InitialState = {
  hangingProtocolList: [],
};

export const reducer = {
  getHangingProtocolList: (state: any, action: any) => {
    state.hangingProtocolList = action.payload;
  },
};

const hangingReducer = createReducer(InitialState, (builder) => {
  builder.addCase(hangingActions.getHangingProtocolList.fulfilled, reducer.getHangingProtocolList);
});

export { hangingReducer };
