import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import messageReducer from './message';
import chartPageReducer from './pages/chart';
import homePageReducer from './pages/home';
import adminPageReducer from './pages/admin';
import themeModeReducer from './themeMode';
import userReducer from './user';

export const store = configureStore({
  reducer: {
    themeMode: themeModeReducer,
    chartPage: chartPageReducer,
    homePage: homePageReducer,
    adminPage: adminPageReducer,
    user: userReducer,
    message: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
