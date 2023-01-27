import { styled } from '@mui/material/styles';
import { Chart } from './components/Chart';
import { Box, Stack } from '@mui/material';
import { Form } from './components/Form';
import { Header } from '../../components/Header';

export const HomePage = () => {
  return (
    <div>
      <Header />
      <Stack
        direction="row"
        spacing={2}
        sx={{
          padding: '1.5em 1em',
        }}
      >
        <Chart width={1100} height={700}/>
        <Form />
      </Stack>
    </div>
  );
};
