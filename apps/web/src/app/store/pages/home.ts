import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface HomePageState {
  articleCurPage: number;
  pageSize: number;
  totalPageCount: number;
}

const initialState: HomePageState = {
  articleCurPage: 0,
  pageSize: 10,
  totalPageCount: 0,
};

const homePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    setArticleCurPage(state, action: PayloadAction<number>) {
      state.articleCurPage = action.payload;
    },
    setTotalPageCount(state, action: PayloadAction<number>) {
      state.totalPageCount = action.payload;
    },
  },
});

export const { setArticleCurPage, setTotalPageCount } = homePageSlice.actions;

export default homePageSlice.reducer;
