import { createSlice } from '@reduxjs/toolkit';


interface ViewerState {
  viewer: {
    contextMenuLocation :{
        x:string | null;
        y:string | null;
    }; // 어느 tool이 선택되었는지 확인용
    wadoElementInfo : HTMLDivElement | null
    spinner : boolean;
  }
}

const initialState: ViewerState = {
    viewer: {
    contextMenuLocation : {
        x:null,
        y:null
    },
    wadoElementInfo : null,
    spinner:false,
  }
};

export const ViewerSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setContextMenuLocationChange: (state, action) => {
      state.viewer.contextMenuLocation = action.payload
    },
    setWadoElementInfoChange: (state, action) => {
      state.viewer.wadoElementInfo = action.payload
    },
    setSpinnerChange : (state,action)=> {
      if (state.viewer.spinner !== action.payload) {
        state.viewer.spinner = action.payload
      }
    }
  },

});

export const {
    setContextMenuLocationChange,
    setWadoElementInfoChange,
    setSpinnerChange
} = ViewerSlice.actions;

