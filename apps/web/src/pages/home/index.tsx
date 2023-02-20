import { Box } from '@mui/material';
import { Header } from '../../components/Header';
import { ArticleGrid } from './components/ArticleGrid';
import { HomeCarousel } from './components/HomeCarousel';

export const HomePage = () => {
  return (
    <Box>
      <Header />
      <HomeCarousel />
      <ArticleGrid />
    </Box>
  );
};
