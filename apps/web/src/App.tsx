import { QueryClient, QueryClientProvider } from 'react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import { themes } from './app/theme/themes';
import { useAppSelector } from './app/store';
import { RouterPart } from './app/router';

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
        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <CssBaseline />
          <RouterPart />
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
