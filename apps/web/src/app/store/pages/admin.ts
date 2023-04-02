import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AdminPageState {
  currentBodyIndex: number;
  bodies: {
    articleBody: {
      curPage: number;
      pageSize: number;
      totalPageCount: number;
    };
    recordBody: {
      curPage: number;
      pageSize: number;
      totalPageCount: number;
    };
  };
}

const initialState: AdminPageState = {
  currentBodyIndex: 0,
  bodies: {
    articleBody: {
      curPage: 0,
      pageSize: 10,
      totalPageCount: 0,
    },
    recordBody: {
      curPage: 0,
      pageSize: 10,
      totalPageCount: 0,
    },
  },
};

const adminPageSlice = createSlice({
  name: 'adminPage',
  initialState,
  reducers: {
    setCurrentBodyIndex(state, action: PayloadAction<number>) {
      state.currentBodyIndex = action.payload;
    },
    setArticleCurPage(state, action: PayloadAction<number>) {
      state.bodies.articleBody.curPage = action.payload;
    },
    setArticleTotalPageCount(state, action: PayloadAction<number>) {
      state.bodies.articleBody.totalPageCount = action.payload;
    },
    setRecordCurPage(state, action: PayloadAction<number>) {
      state.bodies.recordBody.curPage = action.payload;
    },
    setRecordTotalPageCount(state, action: PayloadAction<number>) {
      state.bodies.recordBody.totalPageCount = action.payload;
    },
  },
});

export const {
  setCurrentBodyIndex,
  setArticleCurPage,
  setArticleTotalPageCount,
  setRecordCurPage,
  setRecordTotalPageCount,
} = adminPageSlice.actions;

export default adminPageSlice.reducer;
