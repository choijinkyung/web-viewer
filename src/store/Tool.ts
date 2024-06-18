import { createSlice } from '@reduxjs/toolkit';


interface ToolState {
  toolbar: {
    tool: string; // 어느 tool이 선택되었는지 확인용
    choiceTool : string; // 현재 선택되어 있는 tool
    toolChangeCheckBool: boolean; //툴이 변화하거나 ,같은 툴이 클릭 되었는지 확인하기 위한 상태값
    playClipModal : boolean; // 플레이클립 stop/play 제어 모달
    scrollLoopBool : boolean; //스크롤루프 on/off Bool
    gspsBool : boolean;
    gspsURI : string[]
  }
}

const initialState: ToolState = {
  toolbar: {
    tool: "default",
    choiceTool : '',
    toolChangeCheckBool: false,
    playClipModal : false,
    scrollLoopBool:false,
    gspsBool:false,
    gspsURI : []
  }
};;

export const ToolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setToolChange: (state, action) => {
      state.toolbar.tool = action.payload.tool;
      state.toolbar.toolChangeCheckBool = action.payload.toolbool;
    },
    setChoiceToolChange : (state,action) => {
      state.toolbar.choiceTool = action.payload;
    },
    setPalyClipModalChnage : (state,action)=> {
      state.toolbar.playClipModal = action.payload;
    },
    setScrollLoopBoolChange : (state,action)=> {
      state.toolbar.scrollLoopBool = action.payload
    },
    setGSPSBoolChange : (state,action)=> {
      state.toolbar.gspsBool = action.payload
    },
    setGSPSURIChange : (state,action)=> {
      state.toolbar.gspsURI = action.payload
    },
  },

});

export const {
  setToolChange,
  setPalyClipModalChnage,
  setScrollLoopBoolChange,
  setChoiceToolChange,
  setGSPSBoolChange,
  setGSPSURIChange
} = ToolSlice.actions;

