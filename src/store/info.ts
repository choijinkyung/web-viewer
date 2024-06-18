import { createAsyncThunk, createReducer, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {jwtUtil} from '@utils/JwtHelper'

const infoActions = {
  fetchAccountInfo: createAsyncThunk('GET/INFO', async (headers: any, { rejectWithValue,fulfillWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/info/`,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        servicetype: headers.servicetype,
        key: headers.key,
      },
    })
      .then((res) => res.data)
      .catch(async (error) =>{
        const jwt = await jwtUtil(error);
        if (jwt.message ==='Retry success') {
          return fulfillWithValue(jwt.response.data);
        }    
        });
  }),
};

const infoSlice = createSlice({
  name: 'infoSlice',
  initialState: {
    info: {},
    status: 'Welcome',
  },
  reducers: {
    
  },
  //비동기는 extraReducers를 사용해야함
  extraReducers: (builder) => {
    builder.addCase(infoActions.fetchAccountInfo.pending, (state, action) => {
      state.status = 'Loading';
    });
    builder.addCase(infoActions.fetchAccountInfo.fulfilled, (state, action) => {
      state.info = action.payload;
      state.status = 'complete';
    });
    builder.addCase(infoActions.fetchAccountInfo.rejected, (state, action) => {
      state.status = 'faile';
    });
  },
});

export default infoSlice;
export const { fetchAccountInfo } = infoActions;
