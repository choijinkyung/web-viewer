import {  createAsyncThunk, createReducer, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {jwtUtil} from "@utils/JwtHelper"

// const fetchWorklistInitialState = {
//   worklist:[],
// };

// const fetchPatientPastStudyListInitialState = {
//   patientPastStudyList : []
// }

// const fetchStudyInfoState = {
//   studyInfo: {},
// };

const fetchWorklistInitialState = {
  worklist:[],
  moreWorkList:[],
  patientPastStudyList : [],
  studyInfo: {},
}
interface worklistReducer {
  worklist : {
    worklistArr : [],
    CheckStudy : []
    mobileDetailSearchBool : boolean;
  }
}
const initialState : worklistReducer = {
  worklist : {
    worklistArr : [],
    CheckStudy : [],
    mobileDetailSearchBool : false,
  }
}

export const worklistActions = {
  fetchWorklist: createAsyncThunk('GET/WORKLIST', async (payload: any, { rejectWithValue,fulfillWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/worklists?pID=${payload.params.patient_id}&pName=${payload.params.patient_name}&reportStatus=${payload.params.reading_status}&startDate=${payload.params.start_date}&endDate=${payload.params.end_date}&modality=${payload.params.modality}&verifyFlag=${payload.params.verify_flag}&pagingNum=${payload.params.pagingNum}&limit=${payload.params.limit}`,
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
  fetchMoreWorklist: createAsyncThunk('GET/MOREWORKLIST', async (payload: any, { rejectWithValue,fulfillWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/worklists?pID=${payload.params.patient_id}&pName=${payload.params.patient_name}&reportStatus=${payload.params.reading_status}&startDate=${payload.params.start_date}&endDate=${payload.params.end_date}&modality=${payload.params.modality}&verifyFlag=${payload.params.verify_flag}&pagingNum=${payload.params.pagingNum}&limit=${payload.params.limit}&listLength=${payload.params.listLength}`,
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
  fetchPatientPastStudyList: createAsyncThunk('GET/PASTSTUDYLIST', async (payload: any, { rejectWithValue,fulfillWithValue })=> {
    return axios({
      method: 'get',
      url: `/api/v1/worklists/patient-id/${encodeURIComponent(payload.params.patient_id)}`,
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
  fetchStudyInfo: createAsyncThunk('GET/STUDYINFO', async (payload: any, { rejectWithValue, fulfillWithValue }) => {
    return axios({
      method: 'get',
      url: `/api/v1/worklists/studies/${payload.study_key}`,
      headers: payload.headers,
    })
      .then((res) => {
        res.data
      })
      .catch(async (error) => {
        const jwt = await jwtUtil(error);
        if (jwt.message === 'Retry success') {
          return fulfillWithValue(jwt.response.data);
        }
      });
  })
}

export const reducer = {
  fetchWorklist: (state: any, action: any) => {
    state.worklist = action.payload;
  },
  fetchMoreWorklist: (state: any, action: any) => {
    state.moreWorkList = action.payload;
  },
  fetchPatientPastStudyList: (state: any, action: any) => {
    state.patientPastStudyList = action.payload;
  },
  fetchStudyInfo: (state: any, action: any) => {
    state.studyInfo = action.payload
  },
};

export const WorkListSlice = createSlice({
  name: 'worklistReducer',
  initialState,
  reducers: {
    setWorklistArrChange : (state,action)=> {
      state.worklist.worklistArr = action.payload;
    },
    setCheckStudyChange : (state,action)=> {
      state.worklist.CheckStudy = action.payload;
    },
    setMobileDetailSearchBoolChange : (state,action)=> {
      state.worklist.mobileDetailSearchBool = action.payload;
    },
  },

});

const fetchWorklistReducer = createReducer(fetchWorklistInitialState, (builder) => {
  builder.addCase(worklistActions.fetchWorklist.fulfilled, reducer.fetchWorklist);
});
const fetchMoreWorklistReducer = createReducer(fetchWorklistInitialState, (builder) => {
  builder.addCase(worklistActions.fetchMoreWorklist.fulfilled, reducer.fetchMoreWorklist);
});

const fetchPatientPastStudyListReducer = createReducer(fetchWorklistInitialState, (builder) => {
  builder.addCase(worklistActions.fetchPatientPastStudyList.fulfilled, reducer.fetchPatientPastStudyList);
});

const fetchStudyInfoReducer = createReducer(fetchWorklistInitialState, (builder) => {
  builder.addCase(worklistActions.fetchStudyInfo.fulfilled, reducer.fetchStudyInfo);
});

export { fetchWorklistReducer, fetchPatientPastStudyListReducer, fetchStudyInfoReducer,fetchMoreWorklistReducer };
export const { setWorklistArrChange,setCheckStudyChange,setMobileDetailSearchBoolChange } = WorkListSlice.actions;