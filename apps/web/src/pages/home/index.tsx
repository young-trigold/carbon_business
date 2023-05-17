import { Box, Stack } from '@mui/material';
import { Header } from '../../components/Header';
import { ArticleGrid } from './components/ArticleGrid';
import { HomeCarousel } from './components/HomeCarousel';
import { InfoList } from './components/InfoList';

export const HomePage = () => {
  return (
    <Box>
      <Header />
      <Box padding="0 2em">
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <HomeCarousel />
          <InfoList />
        </Stack>
        <ArticleGrid />
      </Box>
    </Box>
  );
};
