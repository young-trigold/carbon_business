import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { AgenciesOfCarbonBusiness, QueryKeyOfCarbonBusiness, startDate } from 'lib';

interface AdminPageState {
  bodies: {
    articleBody: {
      articleCurPage: number;
      pageSize: number;
      totalPageCount: number;
    };
    recordBody: {
      form: {
        startDate: string;
        endDate: string;
        checkedAgencies: AgenciesOfCarbonBusiness[];
        queryKey: QueryKeyOfCarbonBusiness;
      };
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
    recordBody: {
      form: {
        startDate: startDate,
        endDate: dayjs().format('YYYY-MM-DD'),
        checkedAgencies: ['上海', '湖北', '深圳', '广州'],
        queryKey: 'averagePrice',
      },
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
    setStartDate(state, action: PayloadAction<string>) {
      state.bodies.recordBody.form.startDate = action.payload;
    },
    setEndDate(state, action: PayloadAction<string>) {
      state.bodies.recordBody.form.endDate = action.payload;
    },
    setAgencies(state, action: PayloadAction<AgenciesOfCarbonBusiness[]>) {
      state.bodies.recordBody.form.checkedAgencies = action.payload;
    },
    setQueryKey(state, action: PayloadAction<QueryKeyOfCarbonBusiness>) {
      state.bodies.recordBody.form.queryKey = action.payload;
    },
  },
});

export const {
  setArticleCurPage,
  setTotalPageCount,
  setStartDate,
  setEndDate,
  setAgencies,
  setQueryKey,
} = adminPageSlice.actions;

export default adminPageSlice.reducer;
