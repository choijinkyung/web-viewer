import { createSlice } from '@reduxjs/toolkit';
import { seriesStorage } from '@typings/etcType';

//지워도 됨

interface SeriesLayoutState {
  seriesLayout: {
    series: number[]; //시르즈 레이아웃 확인용
    seriesDoubleClickBool: boolean; // 시리즈 더블클릭 확인용 상태값
    selectedElementNumber: number; // 선택(클릭)된 시리즈의 Element Number확인용
    seriesMin: number; //viewer 에서 보여질 최소값 (pageUp/down용) 
    seriesMax: number; //viewer 에서 보여질 최대값 (pageUp/down용)
    seriesStorage :seriesStorage //이전 시리즈 레이아웃 저장용
    defaultSeriesStorage : number[]
    comparisonSeriesStorage : number[]
    oneSeries: boolean; // 일반검사 원시리즈 On/Off 확인용
    comparisonOneSeries : boolean; //비교검사 원시리즈 On/Off 확인용
    wadoElementNumber : number; ///현재 Element
    oneSeriesStartNumber : number; //원시리즈에서 표출될 이미지 Number
    thumbnailClick : boolean;
  }
}

const initialState: SeriesLayoutState = {
  seriesLayout: {
    series: [1, 1],
    seriesDoubleClickBool: false,
    selectedElementNumber: 0,
    wadoElementNumber : 0,
    seriesMin: 0,
    seriesMax: 4,
    seriesStorage : {
      default: [],
      comparison: [],
    },
    defaultSeriesStorage : [],
    comparisonSeriesStorage : [],
    oneSeries: false,
    oneSeriesStartNumber : 0,
    comparisonOneSeries : false,
    thumbnailClick:false,
  }
};

export const SeriesLayoutSlice = createSlice({
  name: 'seriesLayout',
  initialState,
  reducers: {
    setSeriesChange: (state, action) => {
      state.seriesLayout.series = action.payload;
    },
    setSeriesDoubleClickElementChange: (state, action) => {
      state.seriesLayout.seriesDoubleClickBool = action.payload.seriesDoubleClickBool;
      state.seriesLayout.selectedElementNumber = action.payload.selectedElementNumber;
    },
    setSeriesElementChange: (state, action) => {
      state.seriesLayout.selectedElementNumber = action.payload.selectedElementNumber;
    },
    setSeriesValueChange: (state, action) => {
      state.seriesLayout.seriesMin = action.payload.seriesMin;
      state.seriesLayout.seriesMax = action.payload.seriesMax;
    },
    setSeriesStorageChange : (state,action)=> {
      state.seriesLayout.seriesStorage = action.payload;
    },
    setDefaultSeriesStorageChange : (state,action)=> {
      state.seriesLayout.defaultSeriesStorage = action.payload;
    },
    setComparisonSeriesStorageChange : (state,action)=> {
      state.seriesLayout.comparisonSeriesStorage = action.payload;
    },
    setOneSeriesBoolChange: (state, action) => {
      state.seriesLayout.oneSeries = action.payload;
    },
    setComparisonOneSeriesBoolChange: (state, action) => {
      state.seriesLayout.comparisonOneSeries = action.payload;
    },
    setWadoElementNumberChange: (state, action) => {
      state.seriesLayout.wadoElementNumber = action.payload;
    },
    setOneSeriesStartNumberChange: (state, action) => {
      state.seriesLayout.oneSeriesStartNumber = action.payload;
    },
    setThumbnailClickChange: (state,action) => {
      state.seriesLayout.thumbnailClick = action.payload;
    },
  },

});

export const {
  setSeriesChange,
  setSeriesDoubleClickElementChange,
  setSeriesElementChange,
  setSeriesValueChange,
  setOneSeriesBoolChange,
  setComparisonOneSeriesBoolChange,
  setWadoElementNumberChange,
  setOneSeriesStartNumberChange,
  setSeriesStorageChange,
  setDefaultSeriesStorageChange,
  setComparisonSeriesStorageChange,
  setThumbnailClickChange
} = SeriesLayoutSlice.actions;

