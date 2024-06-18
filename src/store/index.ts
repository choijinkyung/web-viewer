import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { instanceReducer, seriesReducer, studyReducer } from './dicom';
import infoSlice from './info';
import { userReducer } from './user';
import authSlice from './auth';
import { filterSlice } from './filter';
import { ToolSlice } from './Tool';
import {
  fetchWorklistReducer,
  fetchPatientPastStudyListReducer,
  fetchStudyInfoReducer,
  fetchMoreWorklistReducer,
  WorkListSlice,
} from './worklist';
import {
  fetchRecentReportReducer,
  fetchRecentCommentReducer,
  fetchRecentReportInfoReducer,
  fetchReportMacroCategoryReducer,
  fetchReportMacroContentsReducer,
  fetchReportMacroCodeReducer,
} from './report';
import { SettingSlice } from './settingbox';
import { ModalSlice } from './modal';
import { hangingReducer } from './hanging';
import { ComparisonSlice } from './comparison';
import { ImageLayoutSlice } from './imagelayout';
import { SeriesLayoutSlice } from './series';
import { ViewerSlice } from './viewer';
import { languageSlice } from './language';
import tokenSlice from './token';
import { studyStatusReducer } from './studyStatus';
import { viewerStatusSlice } from './viewerStatus';

export const store = configureStore({
  reducer: {
    study: studyReducer,
    series: seriesReducer,
    instance: instanceReducer,
    info: infoSlice.reducer,
    hanging: hangingReducer,
    worklist: fetchWorklistReducer,
    moreworklist: fetchMoreWorklistReducer,
    patientPastStudyList: fetchPatientPastStudyListReducer,
    worklistReducer: WorkListSlice.reducer,
    studyInfo: fetchStudyInfoReducer,
    user: userReducer,
    auth: authSlice.reducer,
    filter: filterSlice.reducer,
    tool: ToolSlice.reducer,
    viewer: ViewerSlice.reducer,
    serieslayout: SeriesLayoutSlice.reducer,
    imagelayout: ImageLayoutSlice.reducer,
    comparison: ComparisonSlice.reducer,
    modal: ModalSlice.reducer,
    setting: SettingSlice.reducer,
    language: languageSlice.reducer,
    report: fetchRecentReportReducer,
    reportInfo: fetchRecentReportInfoReducer,
    comment: fetchRecentCommentReducer,
    macroCategory: fetchReportMacroCategoryReducer,
    macroContents: fetchReportMacroContentsReducer,
    macroCode: fetchReportMacroCodeReducer,
    token: tokenSlice.reducer,
    studyStatus: studyStatusReducer,
    viewerStatus:viewerStatusSlice.reducer
  },
});
// useSelector 사용시 타입으로 사용하기 위함
export type RootState = ReturnType<typeof store.getState>;
// useDispatch를 좀 더 명확하게 사용하기 위함
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
