import { Box, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import { Article } from 'lib';
import { useQuery } from 'react-query';

export const InfoList = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['sample'],
    queryFn: async () => {
      const res = await axios.get<Article[]>('/api/articles?sample=13');
      return res.data;
    },
  });
  const { palette } = useTheme();

  if (isLoading) return <Skeleton variant="rounded" animation="wave" width="400px" height="520px" />;


  return (
    <Box
      sx={{
        width: '400px',
        height: '520px',
        padding: '2em 0',
        overflowY: 'overlay',
      }}
    >
      <Typography variant="h6">新闻资讯</Typography>
      {articles?.map((article) => (
        <Stack
          key={article.id}
          flexDirection="row"
          alignItems="center"
          sx={{
            margin: '0.5em 0',
          }}
        >
          <Box
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              marginRight: '8px',
              backgroundColor: palette.primary.main,
            }}
          />
          <Box
            sx={{
              whiteSpace: 'nowrap',
              overflowX: 'hidden',
              
              textOverflow: 'ellipsis',
            }}
          >
            <a href={article.link} target="_blank">
              {article.title}
            </a>
          </Box>
        </Stack>
      ))}
    </Box>
  );
};
