import { Box, Skeleton } from '@mui/material';
import axios from 'axios';
import { Article } from 'lib';
import { useQuery } from 'react-query';
import { ArticleCard } from './ArticleCard';

export const ArticleGrid = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const res = await axios.get<Article[]>('/api/articles?count=100');
      return res.data;
    },
  });

  if (isLoading)
    return <Skeleton variant="rounded" animation="wave" width="100%" height="1000px" />;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 600px)',
        gridGap: '1em',
        justifyContent: 'space-around',
        padding: '2em',
      }}
    >
      {articles!.map((article) => (
        <ArticleCard key={article.id} {...article}></ArticleCard>
      ))}
    </Box>
  );
};
