import { createSlice } from '@reduxjs/toolkit';


interface settingBoxState {
  setting: {
    searchBoxBool: boolean;
    thumbnailBoxBool: boolean;
    toolBoxBool: boolean;
    reportModalBool: boolean;
    userSettingMenuBool: boolean;
    adminSettingMenuBool:boolean;
    mobileThumbnailBool : boolean;
  };
}

const initialState: settingBoxState = {
  setting: {
    searchBoxBool: false,
    thumbnailBoxBool: false,
    toolBoxBool: true,
    reportModalBool: false,
    userSettingMenuBool: true,
    adminSettingMenuBool:false,
    mobileThumbnailBool:false,
  },
};

export const SettingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setSearchBoxBoolChange: (state, action) => {
      state.setting.searchBoxBool = action.payload;
    },
    setThumbnailBoxBoolChange: (state, action) => {
      state.setting.thumbnailBoxBool = action.payload;
    },
    setToolBoxBoolChange: (state, action) => {
      state.setting.toolBoxBool = action.payload;
    },
    setReportModalChange: (state, action) => {
      state.setting.reportModalBool = action.payload;
    },
    setUserSettingMenuChange: (state, action) => {
      state.setting.userSettingMenuBool = action.payload;
    },
    setAdminSettingMenuChange: (state, action) => {
      state.setting.adminSettingMenuBool = action.payload;
    },
    setMobileThumbnailChange: (state, action) => {
      state.setting.mobileThumbnailBool = action.payload;
    },
  },
});

export const {
  setSearchBoxBoolChange,
  setThumbnailBoxBoolChange,
  setToolBoxBoolChange,
  setReportModalChange,
  setUserSettingMenuChange,
  setAdminSettingMenuChange,
  setMobileThumbnailChange,
} = SettingSlice.actions;
