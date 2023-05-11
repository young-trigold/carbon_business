import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { Article } from 'lib';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

export const InfoList = () => {
  const {
    data: infos,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['infos'],
    queryFn: async () => {
      const res = await axios.get<Article[]>('/api/infos?sortBy=readCount&limit=13');
      return res.data;
    },
  });

  useEffect(() => {
    const id = window.setInterval(refetch, 3000);

    return () => window.clearInterval(id);
  }, []);

  if (isLoading)
    return <Skeleton variant="rounded" animation="wave" width="400px" height="520px" />;

  return (
    <Box
      sx={{
        width: '530px',
        height: '520px',
        padding: '2em 0',
        marginLeft: '2em',
        flex: 1,
      }}
    >
      <Typography variant="h5">热点文章</Typography>
      {infos?.map((article) => (
        <Stack
          key={article.id}
          flexDirection="row"
          alignItems="center"
          sx={{
            margin: '0.5em 0',
          }}
        >
          <Stack
            flexDirection="row"
            sx={{
              marginRight: '0.5em',
            }}
          >
            <LocalFireDepartmentIcon color="error" titleAccess="浏览量"></LocalFireDepartmentIcon>
            <span>{article.readCount}</span>
          </Stack>
          <Box
            sx={{
              width: '100%',
              whiteSpace: 'nowrap',
              overflowX: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <a href={article.link} target="_blank" title={article.title}>
              {article.title}
            </a>
          </Box>
        </Stack>
      ))}
    </Box>
  );
};
