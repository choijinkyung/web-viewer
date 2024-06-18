import { createSlice } from '@reduxjs/toolkit';


interface ImagelayoutState {
    imagelayout: {
        imageLayout: number[]; // 이미지 레이아웃 시리즈 확인용
        imageLayoutDoubleClickBool: boolean; //이미지 레이아웃 더블클릭 확인용 상태값
        imageLayoutElementNumber: number; //선택(클릭)된 이미지레이아웃 시리즈의 Element Number확인용
        imageLayoutViewNumber : number; //pageup/pageDown 시 변경되는 이미지 값을 주기위한 상태값
    }
}

const initialState: ImagelayoutState = {
    imagelayout: {
        imageLayout: [1, 1],
        imageLayoutDoubleClickBool: false,
        imageLayoutElementNumber: 0,
        imageLayoutViewNumber:0,
    }
};

export const ImageLayoutSlice = createSlice({
    name: 'imagelayout',
    initialState,
    reducers: {
        setImageLayoutChange: (state, action) => {
            state.imagelayout.imageLayout = action.payload;
        },
        setImageLayoutDoubleClickBoolChange: (state, action) => {
            state.imagelayout.imageLayoutDoubleClickBool = action.payload;
        },
        setImageLayoutElementNumberChange: (state, action) => {
            state.imagelayout.imageLayoutElementNumber = action.payload;
        },
        setImageLayoutViewNumberChange: (state, action) => {
            state.imagelayout.imageLayoutViewNumber = action.payload;
        },
    },

});

export const {
    setImageLayoutChange,
    setImageLayoutDoubleClickBoolChange,
    setImageLayoutElementNumberChange,
    setImageLayoutViewNumberChange,
} = ImageLayoutSlice.actions;

