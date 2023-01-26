import { styled } from '@mui/material/styles';
import { Chart } from './components/Chart';

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
      <Chart />
    </HomePageContainer>
  );
};
