import { Chart } from './components/Chart';
import { Stack } from '@mui/material';
import { Form } from './components/Form';
import { Header } from '../../components/Header';
import { HomeCarousel } from './components/Carousel';
import { InfoList } from './components/InfoList';

export const HomePage = () => {
  return (
    <div>
      <Header />
      <Stack
        direction="row"
        spacing={2}
        sx={{
          padding: '1em',
        }}
      >
        <HomeCarousel />
        <InfoList />
      </Stack>
      
      <Stack
        direction="row"
        spacing={2}
        sx={{
          padding: '1em',
        }}
      >
        <Chart width={1100} height={700} />
        <Form />
      </Stack>
    </div>
  );
};
