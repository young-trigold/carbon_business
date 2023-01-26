import { styled } from '@mui/material/styles';
import { Chart } from './components/Chart';
import { Stack } from '@mui/material';
import { Form } from './components/Form';

const HomePageContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
}));

export const HomePage = () => {
  return (
    <HomePageContainer>
      <Stack direction="row" spacing={2}>
        <Chart />
        <Form />
      </Stack>
    </HomePageContainer>
  );
};
