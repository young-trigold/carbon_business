import { QueryClient, QueryClientProvider } from 'react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, GlobalStyles, Theme } from '@mui/material';
import 'dayjs/locale/zh-cn';

import { themes } from './app/theme/themes';
import { useAppSelector } from './app/store';
import { RouterPart } from './app/router';
import { Styles } from './app/theme/styles';

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

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={themes[themeMode]}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <CssBaseline enableColorScheme />
          <Styles />
          <RouterPart />
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
