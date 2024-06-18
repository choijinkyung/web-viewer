import { createSlice } from '@reduxjs/toolkit';


interface ComparisonState {
  comparison: {
    ComparisonseriesDoubleClickBool: boolean; // 비교검사 시리즈 더블클릭 확인용 상태값
    comparisonCheckBool : boolean; //비교검사 Bool
    comparisonStudyKey : string; //비교검사에서 표출할 study_key의 값
    comparisonSeries : number[]; //비교검사 시리즈 레이아웃
    comparisonImageLayout: number[]; // 비교검사 이미지 레이아웃
    comparisonImageLayoutDoubleClickBool : boolean; // 비교검사 더블클릭 확인용
    comparisonImageLayoutElementNumber : number;
    comparisonSeriesMin : number; //비교검사 뷰어에서 보여질 최소값 (pageDown/up/스크롤용)
    comparisonSeriesMax : number; //비교검사 뷰어에서 보여질 최대값 (pageDown/up/스크롤용)
    imageLoaderType : string; //이미지 로더의 타입 일반/ 비교검사
    comparisonOneSeriesStartNumber: number;  // 비교검사 원시리즈 레이아웃용 startNumber
    comparisonImageLayoutViewNumber : number;//비교검사 pageup/pageDown 시 변경되는 이미지 값을 주기위한 상태값
    comparisonWadoElementNumber: number; //비교검사 Element active용 상태값
    comparisonThumbnailClickBool: boolean;
  }
}

const initialState: ComparisonState = {
  comparison: {
    ComparisonseriesDoubleClickBool : false,
    comparisonCheckBool:false,
    comparisonStudyKey:'',
    comparisonSeries:[2,2],
    comparisonImageLayout:[1,1],
    comparisonImageLayoutDoubleClickBool : false,
    comparisonImageLayoutElementNumber : 0,
    comparisonSeriesMin : 0,
    comparisonSeriesMax : 4,
    imageLoaderType : 'default',
    comparisonOneSeriesStartNumber :0,
    comparisonImageLayoutViewNumber : 0,
    comparisonWadoElementNumber: 999999,
    comparisonThumbnailClickBool: false

  }
};

export const ComparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    setComparisonDoubleClickBoolChange : (state,action)=> {
      state.comparison.ComparisonseriesDoubleClickBool = action.payload
    },
    setComparisonCheckBoolChange : (state,action)=> {
      state.comparison.comparisonCheckBool = action.payload
    },
    setComparisonStudyKeyChange : (state,action)=> {
      state.comparison.comparisonStudyKey = action.payload
    },
    setComparisonSeriesChange : (state,action)=> {
      state.comparison.comparisonSeries = action.payload
    },
    setComparisonImgaeLayoutChange : (state,action)=> {
      state.comparison.comparisonImageLayout = action.payload
    },
    setComparisonImageLayoutDoubleClickBool : (state,action)=> {
      state.comparison.comparisonImageLayoutDoubleClickBool = action.payload
    },
    setComparisonImageLayoutElementNumber : (state,action)=> {
      state.comparison.comparisonImageLayoutElementNumber = action.payload;
    },
    setImageLoaderTypeChnage :(state,action) => {
      state.comparison.imageLoaderType = action.payload;
    },
    setComaprisonSeriesValueChange : (state,action)=> {
      state.comparison.comparisonSeriesMin = action.payload.comparisonSeriesMin;
      state.comparison.comparisonSeriesMax = action.payload.comparisonSeriesMax;
    },
    setComparisonOneSeriesStartNumberChange : (state,action) => {
      state.comparison.comparisonOneSeriesStartNumber = action.payload;
    },
    setComparisonImageLayoutViewNumberChange : (state,action) => {
      state.comparison.comparisonImageLayoutViewNumber = action.payload;
    },
    setComparisonWadoElementNumberChange : (state,action) => {
      state.comparison.comparisonWadoElementNumber = action.payload;
    },
    setComparisonThumbnailClickBool: (state, action) => {
      state.comparison.comparisonThumbnailClickBool=action.payload
    }

  },

});

export const {
  setComparisonDoubleClickBoolChange,
  setComparisonCheckBoolChange,
  setComparisonStudyKeyChange,
  setComparisonSeriesChange,
  setComparisonImgaeLayoutChange,
  setComparisonImageLayoutDoubleClickBool,
  setImageLoaderTypeChnage,
  setComaprisonSeriesValueChange,
  setComparisonImageLayoutElementNumber,
  setComparisonOneSeriesStartNumberChange,
  setComparisonImageLayoutViewNumberChange,
  setComparisonWadoElementNumberChange,
  setComparisonThumbnailClickBool
} = ComparisonSlice.actions;

