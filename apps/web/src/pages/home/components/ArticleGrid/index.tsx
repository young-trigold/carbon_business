import { Box, Skeleton } from '@mui/material';
import axios from 'axios';
import { Article } from 'lib';
import { useQuery } from 'react-query';
import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { setTotalPageCount } from '../../../../app/store/pages/home';
import { ArticleCard } from './ArticleCard';
import { PageController } from './PageController';
import { useEffect } from 'react';

export const ArticleGrid = () => {
  const { articleCurPage, pageSize } = useAppSelector((state) => state.homePage);

  const { data, isLoading } = useQuery({
    queryKey: ['articles', articleCurPage, pageSize],
    queryFn: async () => {
      const searchParamsAsStr = Object.entries({
        curPage: articleCurPage,
        pageSize: pageSize,
      })
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      const res = await axios.get<{
        articles: Article[];
        totalPageCount: number;
      }>(`/api/articles?${searchParamsAsStr}`);
      return res.data;
    },
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoading) return;
    dispatch(setTotalPageCount(data?.totalPageCount ?? 0));
  }, [isLoading]);

  if (isLoading)
    return <Skeleton variant="rounded" animation="wave" width="100%" height="1000px" />;

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 600px)',
          gridGap: '1em',
          justifyContent: 'space-around',
          padding: '2em',
        }}
      >
        {data?.articles?.map((article) => (
          <ArticleCard key={article._id} {...article}></ArticleCard>
        ))}
      </Box>
      <PageController />
    </Box>
  );
};
