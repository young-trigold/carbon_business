import { createSlice } from '@reduxjs/toolkit';

interface HomePageState {

}

const initialState: HomePageState = {
  
};

const homePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
 
  },
});

export const {  } = homePageSlice.actions;

export default homePageSlice.reducer;
