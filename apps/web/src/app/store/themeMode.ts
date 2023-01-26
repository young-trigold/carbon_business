import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type ThemeMode = 'dark' | 'light';

interface ThemeModeState {
  themeMode: ThemeMode;
}

const initialState: ThemeModeState = {
  themeMode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
};

const themeModeSlice = createSlice({
  name: 'themeMode',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
  },
});

export const { setThemeMode } = themeModeSlice.actions;

export default themeModeSlice.reducer;
