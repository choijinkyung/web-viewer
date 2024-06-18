import { createAsyncThunk, createReducer, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtUtil } from '@utils/JwtHelper';
/**
 * 관리자 모드에서 (ms) 유저의 상태를 활성화/비활성화 시켜주는것과 관련된 store
 * 
 */

interface Payload {
  data: {
    active_yn?: string
  }
}

const userAction = {
  //서비스 유저 리스트를 불러옴
  getUserList: createAsyncThunk('GET/USER', async (params, { rejectWithValue, fulfillWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/account`,
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
  }),
  //계정승인 toggle 클릭 시 호출되며 계정의 active_yn을 (Y)로 업데이트함 -> ppwebviewer 5버전
  modifyUser: createAsyncThunk('PUT/USER', async (payload: Payload, { rejectWithValue, fulfillWithValue }) => {
    return axios({
      method: 'put',
      url: '/api/v1/user/active',
      data: {
        active_yn: payload.data.active_yn,
      },
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
  }),
  //유저의 privilege(권한 목록)을 가져오는 thunk함수
  getUserPrivileges: createAsyncThunk(
    'GET/USER/PRIVILEGES',
    async (params: string, { rejectWithValue, fulfillWithValue }) => {
      return axios({
        method: 'get',
        url: `/api/v1/account/user-privilege/${params}`,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
      })
        .then((res) => res.data)
        .catch(async (error) => {
          const jwt = await jwtUtil(error);
          if (jwt.message === 'Retry success') {
            return fulfillWithValue(jwt.response.data);
          }else {
            // localStorage.clear();
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            alert("Please Log in Again!")
            const link = "#" + "/login";
            window.location.replace('/');
          }
        });
    },
  ),
};


const initialState = {
  userList: [],
  modifyUser: {},
  userPrivileges:[]
};

export const reducer = {
  modifyUser: (state: any, action: any) => {
    state.value = action.payload
  },

  getUserList: (state: any, action: any) => {
    state.userList = action.payload;
  },
  getUserPrivileges: (state: any, action: any) => {
    const privilege = action.payload.map((v:any)=> {
      return v.PrivilegeID
    })
    // state.userPrivileges = action.payload
    state.userPrivileges = privilege;
  }
};

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(userAction.getUserList.fulfilled, reducer.getUserList);
  builder.addCase(userAction.modifyUser.fulfilled, reducer.modifyUser);
  builder.addCase(userAction.getUserPrivileges.fulfilled, reducer.getUserPrivileges);
});


export { userAction, userReducer };