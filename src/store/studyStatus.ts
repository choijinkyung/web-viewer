import { combineReducers, createSlice } from '@reduxjs/toolkit';


interface layoutState {
    seriesLayout: {
        seriesLayout: number[]; //시리즈 레이아웃 확인용
        seriesDoubleClickBool: boolean; // 시리즈 더블클릭 확인용 상태값
        selectedElementNumber: number; // 선택(클릭)된 시리즈의 Element Number확인용
        seriesMin: number; //viewer 에서 보여질 최소값 (pageUp/down용) 
        seriesMax: number; //viewer 에서 보여질 최대값 (pageUp/down용)
        seriesStorage: number[] //이전 시리즈 레이아웃 저장용
        isOneSeries: boolean; // 일반검사 원시리즈 On/Off 확인용
        oneSeriesStartNumber: number; //원시리즈에서 표출될 이미지 Number
        seriesThumbnailClick: boolean
        seriesElementNumber: number; //선택되어 active되어있는 element
        seriesLength:{}
    }
    imageLayout: {
        imageLayout: number[],
        imageLayoutDoubleClickBool: boolean,
        imageLayoutElementNumber: number,
        imageLayoutViewStartNumber: number
    },
}

const initialState: layoutState = {
    seriesLayout: {
        seriesLayout: [1, 1], //시리즈 레이아웃 확인용
        seriesDoubleClickBool: false, // 시리즈에서 더블클릭으로 1*1이 된건지 확인용
        selectedElementNumber: 0,// 선택(클릭)된 시리즈의 Element Number확인용
        seriesMin: 0, //viewer 에서 보여질 최소값 (pageUp/down용) 
        seriesMax: 4,//viewer 에서 보여질 최대값 (pageUp/down용)
        seriesStorage: [1, 1], //이전 시리즈 레이아웃 저장용
        isOneSeries: false, // 일반검사 원시리즈 On/Off 확인용
        oneSeriesStartNumber: 0, //원시리즈에서 표출될 이미지 Number
        seriesThumbnailClick: false,
        seriesElementNumber: 0,//선택되어 active되어있는 element
        seriesLength:{}
    },
    imageLayout: {
        imageLayout: [1, 1], //이미지 레이아웃 확인용
        imageLayoutDoubleClickBool: false, //이미지 선택여부 
        imageLayoutElementNumber: 0, // 선택된 이미지
        imageLayoutViewStartNumber: 0 //보여지는 이미지
    },
}



function createStudyStatusWithNamedType(studyType = '') {
    return function studyStatus(state = initialState, action: any) {
        switch (action.type) {
            ///시리즈레이아웃 리듀서
            case `setSeriesLayout/${studyType}`:
                return {
                    ...state,
                    seriesLayout: {
                        ...state.seriesLayout,
                        seriesLayout: action.payload
                    }
                }
            case `setSeriesDoubleClickBool/${studyType}`:
                return action.payload.selectedElementNumber ? {
                    ...state,
                    seriesLayout: {
                        ...state.seriesLayout,
                        seriesDoubleClickBool: action.payload.seriesDoubleClickBool,
                        selectedElementNumber: action.payload.selectedElementNumber
                    }
                } : {
                    ...state,
                    seriesLayout: {
                        ...state.seriesLayout,
                        seriesDoubleClickBool: action.payload.seriesDoubleClickBool
                    }
                }

            case `setselectedElementNumber/${studyType}`:
                return {
                    ...state,
                    seriesLayout: {
                        ...state.seriesLayout,
                        selectedElementNumber: action.payload
                    }
                }
            case `setSeriesViewRange/${studyType}`:
                return {
                    ...state,
                    seriesLayout: {
                        ...state.seriesLayout,
                        seriesMin: action.payload.min,
                        seriesMax: action.payload.max
                    }
                }
            case `setSeriesStorage/${studyType}`:
                return {
                    ...state,
                    seriesLayout: {
                        ...state.seriesLayout,
                        seriesStorage: action.payload
                    }
                }
            case `setIsOneSeries/${studyType}`:
                return {
                    ...state,
                    seriesLayout: {
                        ...state.seriesLayout,
                        isOneSeries: action.payload
                    }
                }
            case `setOneSeriesStartNumber/${studyType}`:
                return {
                    ...state,
                    seriesLayout: {
                        ...state.seriesLayout,
                        oneSeriesStartNumber: action.payload
                    }
                }
            case `setSeriesThumbnailClick/${studyType}`:
                return {
                    ...state,
                    seriesLayout: {
                        ...state.seriesLayout,
                        seriesThumbnailClick: action.payload
                    }
                }
            case `setSeriesElementNumber/${studyType}`:
                return {
                    ...state,
                    seriesLayout: {
                        ...state.seriesLayout,
                        seriesElementNumber: action.payload
                    }
                }
            case `setSeriesLength/${studyType}`:
                return {
                    ...state,
                    seriesLayout: {
                        ...state.seriesLayout,
                        seriesLength:action.payload
                    }
                }
            
            ////이미지 레이아웃 리듀서
            case `setImageLayout/${studyType}`:
                return {
                    ...state,
                    imageLayout: {
                        ...state.imageLayout,
                        imageLayout: action.payload
                    }
                }
            case `setImageLayoutDoubleClickBool/${studyType}`:
                return {
                    ...state,
                    imageLayout: {
                        ...state.imageLayout,
                        imageLayoutDoubleClickBool: action.payload
                    }
                }
            case `setImageLayoutElementNumber/${studyType}`:
                return {
                    ...state,
                    imageLayout: {
                        ...state.imageLayout,
                        imageLayoutElementNumber: action.payload
                    }
                }
            case `setImageLayoutViewStartNumber/${studyType}`:
                return {
                    ...state,
                    imageLayout: {
                        ...state.imageLayout,
                        imageLayoutViewStartNumber: action.payload
                    }
                }

            //// 기타 리듀서
            default: return state
        }
    }

}
export const studyStatusReducer = combineReducers(
    [
        createStudyStatusWithNamedType('0'),
        createStudyStatusWithNamedType('1'),
        createStudyStatusWithNamedType('2'),
        createStudyStatusWithNamedType('3')
    ]
)