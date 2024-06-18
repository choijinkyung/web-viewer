//사용중X

import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import axios from 'axios';
import {jwtUtil} from "@utils/JwtHelper"

interface Params {
  study_key?: string;
  series_key?: string;
  instance_key?: string;
}
const dicomAction = {
  getStudyList: createAsyncThunk('GET/DICOM/STUDY', async (param: Params, { fulfillWithValue, rejectWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/dicom`,
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
  getSeriesList: createAsyncThunk('GET/DICOM/SERIES', async (params: Params, { rejectWithValue, fulfillWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/dicom/study/${params.study_key}`,
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
  getInstanceList: createAsyncThunk(
    'GET/DICOM/INSTANCE',
    async (params: Params, { rejectWithValue, fulfillWithValue }) => {
      return axios({
        method: 'get',
        url: `/api/v1/dicom/study/${params.study_key}/series/${params.series_key}}`,
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
  ),
  getDICOMObject: createAsyncThunk(
    'GET/DICOM/OBJECT',
    async (params: Params, { rejectWithValue, fulfillWithValue }) => {
      return axios({
        method: 'get',
        url: '/api/v1/dicom/object/',
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
  ),
};

const studyInitialState = {
  studyList: [],
};

const seriesInitialState = {
  seriesList: [],
};

const instanceInitialState = {
  instanceList: [],
};
const dicomObjectInitialState = {
  dicomObj: [],
};
export const reducer = {
  getStudyList: (state: any, action: any) => {
    state.studyList = action.payload;
  },
  getSeriesList: (state: any, action: any) => {
    state.seriesList = action.payload;
  },
  getInstanceList: (state: any, action: any) => {
    state.instanceList = action.payload;
  },
  getDICOMObject: (state: any, action: any) => {
    state.dicomObj = action.payload
  }
};

const studyReducer = createReducer(studyInitialState, (builder) => {
  builder.addCase(dicomAction.getStudyList.fulfilled, reducer.getStudyList);
});
const seriesReducer = createReducer(seriesInitialState, (builder) => {
  builder.addCase(dicomAction.getSeriesList.fulfilled, reducer.getSeriesList);
});
const instanceReducer = createReducer(instanceInitialState, (builder) => {
  builder.addCase(dicomAction.getInstanceList.fulfilled, reducer.getInstanceList);
});
const dicomObjectReducer = createReducer(instanceInitialState, (builder) => {
  builder.addCase(dicomAction.getDICOMObject.fulfilled, reducer.getDICOMObject);
});

export { dicomAction, studyReducer, seriesReducer, instanceReducer };
