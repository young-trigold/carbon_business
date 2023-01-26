import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { QueryKeyOfCarbonBusiness, startDate } from 'types';

interface HomePageState {
  startDate: string;
  endDate: string;
  agencies: string[];
  queryKey: QueryKeyOfCarbonBusiness;
}

const initialState: HomePageState = {
  startDate: startDate,
  endDate: dayjs().format('YYYY-MM-DD'),
  agencies: ['上海', '湖北', '深圳', '广州'],
  queryKey: 'averagePrice',
};

const homePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    setStartDate(state, action: PayloadAction<string>) {
      state.startDate = action.payload;
    },
    setEndDate(state, action: PayloadAction<string>) {
      state.endDate = action.payload;
    },
    setAgencies(state, action: PayloadAction<string[]>) {
      state.agencies = action.payload;
    },
    setQueryKey(state, action: PayloadAction<QueryKeyOfCarbonBusiness>) {
      state.queryKey = action.payload;
    },
  },
});

export const { setStartDate, setEndDate, setAgencies, setQueryKey } = homePageSlice.actions;

export default homePageSlice.reducer;
