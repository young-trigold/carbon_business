import { createSlice } from '@reduxjs/toolkit';

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
    toggleThemeMode: (state) => {
      if (state.themeMode === 'dark') state.themeMode = 'light';
      else state.themeMode = 'dark';
    },
  },
});

export const { toggleThemeMode } = themeModeSlice.actions;

export default themeModeSlice.reducer;
