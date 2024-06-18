import { combineReducers, createSlice } from '@reduxjs/toolkit';


interface viewerStatus {
    
        countStudies: number;// 총 검사 개수
        studyKeys: string[];//검사 스터디키 배열
        selectedStudyType: string; //선택된 스터디 타입 ex.imageLoaderType
    
}

const initialState: viewerStatus = {
    
        countStudies: 1,
        studyKeys: [],
        selectedStudyType: 'default'
    
}

export const viewerStatusSlice = createSlice({
    name: 'viewerStatus',
    initialState,
    reducers: {
        setSelectedStudyType: (state, action) => {
            state.selectedStudyType = action.payload
        }
    }
})

export const {
    setSelectedStudyType,
} = viewerStatusSlice.actions