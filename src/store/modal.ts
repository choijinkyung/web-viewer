import { createSlice } from '@reduxjs/toolkit';


interface ModalState {
  modal: {
    viewerContextMenuBool: boolean; //viewer page 우클릭 modal용
    dicomHeaderModalBool: boolean; // viewer page dicom header modal 용
    addHangingProtocolModalBool: boolean; // 사용자 설정 레이아웃 추가 Modal용 bool
    modifyHangingProtocolModalBool: boolean; // 사용자 설정 레이아웃 수정 Modal용 bool
    showHangingProtocolModalBool: boolean; //사용안함 - 빌드전 수정 필요
    showUserInfoModalBool: boolean; //사용안함 - 빌드전 수정 필요
    addUserModalBool:boolean;  //관리자설정 사용자 추가 Modal 용 bool
    modifyUserModalBool:boolean; // 관리자 설정 사용자 수정 Modal 용 bool
    comparisonCheckModalBool : boolean; // 비교검사 리스트 Modal 용 bool
  };
}

const initialState: ModalState = {
  modal: {
    viewerContextMenuBool: false,
    dicomHeaderModalBool: false,
    addHangingProtocolModalBool: false,
    modifyHangingProtocolModalBool: false,
    showHangingProtocolModalBool: false,
    showUserInfoModalBool: false,
    addUserModalBool:false,
    modifyUserModalBool:false,
    comparisonCheckModalBool:false,
  },
};

export const ModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setViewerContextMenuBool: (state, action) => {
      state.modal.viewerContextMenuBool = action.payload;
    },
    setDicomHeaderModalBool: (state, action) => {
      state.modal.dicomHeaderModalBool = action.payload;
    },
    setAddHangingProtocolModalBool: (state, action) => {
      state.modal.addHangingProtocolModalBool = action.payload;
    },
    setModifyHangingProtocolModalBool: (state, action) => {
      state.modal.modifyHangingProtocolModalBool = action.payload;
    },
    setShowHangingProtocolModalBool: (state, action) => {
      state.modal.showHangingProtocolModalBool = action.payload;
    },
    setShowUserInfoModalBool: (state, action) => {
      state.modal.showUserInfoModalBool = action.payload;
    },
    setAddUserModalBool: (state, action) => {
      state.modal.addUserModalBool = action.payload;
    },
    setModifyUserModalBool: (state,action)=> {
      state.modal.modifyUserModalBool = action.payload;
    },
    setComparisonCheckModalBool : (state,action)=> {
      state.modal.comparisonCheckModalBool = action.payload;
    }
  },
});

export const {
  setViewerContextMenuBool,
  setDicomHeaderModalBool,
  setAddHangingProtocolModalBool,
  setModifyHangingProtocolModalBool,
  setShowHangingProtocolModalBool,
  setShowUserInfoModalBool,
  setAddUserModalBool,
  setModifyUserModalBool,
  setComparisonCheckModalBool
} = ModalSlice.actions;
