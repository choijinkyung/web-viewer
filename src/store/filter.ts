import { createSlice } from '@reduxjs/toolkit';


interface filterState {
  filter : {
    patient_id: string;
    patient_name: string;
    reading_status: string;
    modality: string;
    verify_flag: string;
    startDate: string;
    endDate: string;
    pagingNum : number;
    resetTrigger : boolean;
    limit : number;
  }
}

const initialState: filterState = {
  filter : {
    patient_id: '',
    patient_name: '',
    reading_status: '',
    modality: '',
    verify_flag: '',
    startDate: '',
    endDate: '',
    pagingNum : 0,
    resetTrigger : false,
    limit : 10,
  }
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    patientIDAction: (state, action) => {
      state.filter.patient_id = action.payload;
    },
    patientNameAction: (state, action) => {
      state.filter.patient_name = action.payload;
    },
    readingStatusAction: (state, action) => {
      state.filter.reading_status = action.payload;
    },
    modalityAction: (state, action) => {
      state.filter.modality = action.payload;
    },
    verifyFlagAction: (state, action) => {
      state.filter.verify_flag = action.payload;
    },
    startDateAction: (state, action) => {
      state.filter.startDate = action.payload;
    },
    endDateAction: (state, action) => {
      state.filter.endDate = action.payload;
    },
    pagingNumAction: (state, action) => {
      state.filter.pagingNum = action.payload;
    },
    limitAction : (state,action)=> {
      state.filter.limit = action.payload;
    },
    resetTriggerChange : (state,action)=> {
      state.filter.resetTrigger = action.payload;
    },
  },
});

export const { startDateAction, endDateAction,patientIDAction,patientNameAction,modalityAction,readingStatusAction,verifyFlagAction,pagingNumAction,resetTriggerChange,limitAction} = filterSlice.actions;
