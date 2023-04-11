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
          padding: '1em',
        }}
        alignItems="center"
      >
        <Chart width={1100} height={750} />
        <Form />
      </Stack>
    </Box>
  );
};

export default ChartPage;
