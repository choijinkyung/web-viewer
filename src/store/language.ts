import { createSlice } from '@reduxjs/toolkit';


interface language {
  lang : {
    language: string;
  }
}

const initialState: language = {
  lang : {
    language: 'ko',
  }
};

export const languageSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    languageChangeAction: (state, action) => {
      state.lang.language = action.payload;
    },
  },
});

export const { languageChangeAction} = languageSlice.actions;
