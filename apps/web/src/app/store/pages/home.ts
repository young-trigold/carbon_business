import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface HomePageState {
  articleCurPage: number;
  pageSize: number;
  totalPageCount: {
    default: number;
    market: number;
    footage: number;
    finance: number;
  };
}

const initialState: HomePageState = {
  articleCurPage: 0,
  pageSize: 10,
  totalPageCount: {
    default: 0,
    market: 0,
    footage: 0,
    finance: 0,
  },
};

const homePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    setArticleCurPage(state, action: PayloadAction<number>) {
      state.articleCurPage = action.payload;
    },
    setDefaultTotalPageCount(state, action: PayloadAction<number>) {
      state.totalPageCount.default = action.payload;
    },
    setMarketTotalPageCount(state, action: PayloadAction<number>) {
      state.totalPageCount.market = action.payload;
    },
    setFootageTotalPageCount(state, action: PayloadAction<number>) {
      state.totalPageCount.footage = action.payload;
    },
    setFinanceTotalPageCount(state, action: PayloadAction<number>) {
      state.totalPageCount.finance = action.payload;
    },
  },
});

export const {
  setArticleCurPage,
  setDefaultTotalPageCount,
  setMarketTotalPageCount,
  setFootageTotalPageCount,
  setFinanceTotalPageCount,
} = homePageSlice.actions;

export default homePageSlice.reducer;
