import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AdminPageState {
  bodies: {
    articleBody: {
      articleCurPage: number;
      pageSize: number;
      totalPageCount: number;
    };
  };
}

const initialState: AdminPageState = {
  bodies: {
    articleBody: {
      articleCurPage: 0,
      pageSize: 10,
      totalPageCount: 0,
    },
  },
};

const adminPageSlice = createSlice({
  name: 'adminPage',
  initialState,
  reducers: {
    setArticleCurPage(state, action: PayloadAction<number>) {
      state.bodies.articleBody.articleCurPage = action.payload;
    },
    setTotalPageCount(state, action: PayloadAction<number>) {
      state.bodies.articleBody.totalPageCount = action.payload;
    },
  },
});

export const { setArticleCurPage, setTotalPageCount } = adminPageSlice.actions;

export default adminPageSlice.reducer;
