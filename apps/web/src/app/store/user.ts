import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface UserState {
  userInfo: {
    name: string;
    avatarURL: string;
    permission: string;
  } | null;
  hasLogin: boolean;
}

const initialState: UserState = {
  userInfo: null,
  hasLogin: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserState['userInfo']>) => {
      state.userInfo = action.payload;
    },
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.hasLogin = action.payload;
    },
  },
});

export const { setUserInfo, setIsLogin } = userSlice.actions;

export default userSlice.reducer;
