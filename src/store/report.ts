import {  createAsyncThunk, createReducer, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {jwtUtil} from "@utils/JwtHelper"

const recentReportInitialState = {
  recentReport:[],
};
const recentReportInfoInitialState = {
  recentReportInfo:[],
}
const recentCommentInitialState = {
  recentComment:[],
};
const reportMacroCategoryInitialState = {
  reportMacroCategory:[],
};
const reportMacroContentsInitialState = {
  reportMacroContents:[],
};
const reportMacroCodeInitialState = {
  reportMacroCode:[],
};

export const reportActions = {
  fetchRecentReport: createAsyncThunk('GET/REPORT', async (payload: any, { rejectWithValue,fulfillWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/report/ppw/studyKey/${payload.params.study_key}`,
      headers: payload.headers
    })
      .then((res) => res.data)
      .catch(async (error) => {
        const jwt = await jwtUtil(error);
        if (jwt.message ==='Retry success') {
          return fulfillWithValue(jwt.response.data);
        }
      });
  }),
  fetchRecentReportInfo: createAsyncThunk('GET/REPORTINFO', async (payload: any, { rejectWithValue,fulfillWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/report/ppw/info/studyKey/${payload.params.study_key}`,
      headers: payload.headers
    })
      .then((res) => res.data)
      .catch(async (error) => {
        const jwt = await jwtUtil(error);
        if (jwt.message ==='Retry success') {
          return fulfillWithValue(jwt.response.data);
        }
      });
  }),
  fetchRecentComment: createAsyncThunk('GET/COMMENT', async (payload: any, { rejectWithValue,fulfillWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/report/ppw/comments/studyKey/${payload.params.study_key}`,
      headers: payload.headers
    })
      .then((res) => res.data)
      .catch(async (error) => {
        const jwt = await jwtUtil(error);
        if (jwt.message ==='Retry success') {
          return fulfillWithValue(jwt.response.data);
        }
      });
  }),
  fetchReportMacroCategory: createAsyncThunk('GET/MACROCATEGORY', async (payload: any, { rejectWithValue,fulfillWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/report/category?userID=${payload.params.userID}`,
      headers: payload.headers
    })
      .then((res) => res.data)
      .catch(async (error) => {
        const jwt = await jwtUtil(error);
        if (jwt.message ==='Retry success') {
          return fulfillWithValue(jwt.response.data);
        }
      });
  }),
  fetchReportMacroContents: createAsyncThunk('GET/COMMENT', async (payload: any, { rejectWithValue,fulfillWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/report/code?userID=${payload.params.userID}&CategoryID=${payload.params.categoryID}`,
      headers: payload.headers
    })
      .then((res) => res.data)
      .catch(async (error) => {
        const jwt = await jwtUtil(error);
        if (jwt.message ==='Retry success') {
          return fulfillWithValue(jwt.response.data);
        }
      });
  }),
  fetchReportMacroCode: createAsyncThunk('GET/COMMENT', async (payload: any, { rejectWithValue,fulfillWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/report/code/contents?userID=${payload.params.userID}&CategoryID=${payload.params.categoryID}&ReadingCode=${payload.params.redingCode}`,
      headers: payload.headers
    })
      .then((res) => res.data)
      .catch(async (error) => {
        const jwt = await jwtUtil(error);
        if (jwt.message ==='Retry success') {
          return fulfillWithValue(jwt.response.data);
        }
      });
  }),
}

export const reducer = {
  fetchRecentReport: (state: any, action: any) => {    
    state.recentReport = action.payload;
  },
  fetchRecentReportInfo: (state: any, action: any) => {    
    state.recentReportInfo = action.payload;
  },
  fetchRecentComment: (state: any, action: any) => {    
    state.recentComment = action.payload;
  },
  fetchReportMacroCategory: (state: any, action: any) => {    
    state.reportMacroCategory = action.payload;
  },
  fetchReportMacroContents: (state: any, action: any) => {    
    state.reportMacroContents = action.payload;
  },
  fetchReportMacroCode: (state: any, action: any) => {    
    state.reportMacroCode = action.payload;
  },
};

const fetchRecentReportReducer = createReducer(recentReportInitialState, (builder) => {
  builder.addCase(reportActions.fetchRecentReport.fulfilled, reducer.fetchRecentReport);
});
const fetchRecentReportInfoReducer = createReducer(recentReportInfoInitialState, (builder) => {
  builder.addCase(reportActions.fetchRecentReportInfo.fulfilled, reducer.fetchRecentReportInfo);
});
const fetchRecentCommentReducer = createReducer(recentCommentInitialState, (builder) => {
  builder.addCase(reportActions.fetchRecentComment.fulfilled, reducer.fetchRecentComment);
});
const fetchReportMacroCategoryReducer = createReducer(reportMacroCategoryInitialState, (builder) => {
  builder.addCase(reportActions.fetchReportMacroCategory.fulfilled, reducer.fetchReportMacroCategory);
});
const fetchReportMacroContentsReducer = createReducer(reportMacroContentsInitialState, (builder) => {
  builder.addCase(reportActions.fetchReportMacroContents.fulfilled, reducer.fetchReportMacroContents);
});
const fetchReportMacroCodeReducer = createReducer(reportMacroCodeInitialState, (builder) => {
  builder.addCase(reportActions.fetchReportMacroCode.fulfilled, reducer.fetchReportMacroCode);
});



export { fetchRecentReportReducer,fetchRecentCommentReducer,fetchRecentReportInfoReducer,fetchReportMacroCategoryReducer,fetchReportMacroContentsReducer,fetchReportMacroCodeReducer};