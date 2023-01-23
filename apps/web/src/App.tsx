import { Button } from '@mui/material';
import styled from '@emotion/styled';

import { GlobalStyle } from './app/theme/GlobalStyle';
import { Chart } from './pages/home/components/Chart';
import { QueryClient, QueryClientProvider } from 'react-query';

const APPContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

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
  return (
    <QueryClientProvider client={client}>
      <APPContainer>
        <GlobalStyle />
        <Chart />
        <Button>click me</Button>
      </APPContainer>
    </QueryClientProvider>
  );
};

export default App;
