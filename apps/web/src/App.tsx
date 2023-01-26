import { QueryClient, QueryClientProvider } from 'react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styled, ThemeProvider } from '@mui/material/styles';

import { GlobalStyle } from './app/theme/GlobalStyle';
import { Chart } from './pages/home/components/Chart';
import { themes } from './app/theme/themes';
import { useAppSelector } from './app/store';

const APPContainer = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
}));

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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <APPContainer>
            <GlobalStyle />
            <Chart />
          </APPContainer>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
