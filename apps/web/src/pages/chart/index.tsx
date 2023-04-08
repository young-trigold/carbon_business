import { Box, Stack } from '@mui/material';
import { Header } from '../../components/Header';
import { Chart } from './components/Chart';
import { Form } from './components/Form';

const ChartPage = () => {
  return (
    <Box>
      <Header />
      <Stack
        direction="row"
        spacing={2}
        sx={{
          height: 'calc(100vh - 69px)',
          padding: '1em',
          alignItems: 'center',
        }}
      >
        <Chart width={1100} height={700} />
        <Form />
      </Stack>
    </Box>
  );
};

export default ChartPage;
