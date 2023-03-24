import { Alert, CssBaseline, Snackbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/zh-cn';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useEffect } from 'react';
import { RouterPart } from './app/router';
import { useAppDispatch, useAppSelector } from './app/store';
import { setMessageVisible } from './app/store/message';
import './app/store/watchedLocationStorage';
import { getUserInfo } from './app/store/watchedLocationStorage';
import { Styles } from './app/theme/styles';
import { themes } from './app/theme/themes';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 1000,
    },
  },
});

const App = () => {
  const { themeMode } = useAppSelector((state) => state.themeMode);
  const { visible, text, state } = useAppSelector((state) => state.message);

  const { hasLogin } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const value = window.watchedLocalStorage.getItem('token');
    if (typeof value === 'string' && !hasLogin) {
      getUserInfo(value);
    }
  }, [hasLogin]);

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={themes[themeMode]}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <CssBaseline enableColorScheme />
          <Styles />
          <RouterPart />
          <Snackbar
            autoHideDuration={4000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={visible}
            onClose={() => {
              dispatch(setMessageVisible(false));
            }}
          >
            <Alert
              onClose={() => {
                dispatch(setMessageVisible(false));
              }}
              severity={state}
              sx={{ width: '100%' }}
            >
              {text}
            </Alert>
          </Snackbar>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
