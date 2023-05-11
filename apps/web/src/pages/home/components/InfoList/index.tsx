import { Box, Skeleton, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { Article } from 'lib';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

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
        height: '520px',
        padding: '2em 0',
        overflowY: 'overlay',
      }}
    >
      <Typography variant="h6">热点文章</Typography>
      {infos?.map((article) => (
        <Stack
          key={article.id}
          flexDirection="row"
          alignItems="center"
          sx={{
            margin: '0.5em 0',
          }}
        >
          <Box
            sx={
              {
                // width: '8px',
                // height: '8px',
                // borderRadius: '50%',
                // marginRight: '8px',
                // backgroundColor: palette.primary.main,
              }
            }
          >
            <LocalFireDepartmentIcon color="error"></LocalFireDepartmentIcon>
            {article.readCount}
          </Box>
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
