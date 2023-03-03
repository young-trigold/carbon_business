import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/zh-cn';
import { QueryClient, QueryClientProvider } from 'react-query';

import { RouterPart } from './app/router';
import { useAppSelector } from './app/store';
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
