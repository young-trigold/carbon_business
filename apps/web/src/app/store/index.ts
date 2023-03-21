import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import homePageReducer from './pages/home';
import themeModeReducer from './themeMode';
import userReducer from './user';
import messageReducer from './message';

export const store = configureStore({
  reducer: {
    themeMode: themeModeReducer,
    homePage: homePageReducer,
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
