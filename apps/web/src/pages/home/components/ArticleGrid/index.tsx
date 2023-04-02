import { Box, Skeleton } from '@mui/material';
import axios from 'axios';
import { Article } from 'lib';
import { useQuery } from 'react-query';
import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { setMessageState } from '../../../../app/store/message';
import { setArticleTotalPageCount as setTotalPageCountForAdmin } from '../../../../app/store/pages/admin';
import { setTotalPageCount as setTotalPageCountForHome } from '../../../../app/store/pages/home';
import { ArticleCard } from './ArticleCard';
import { PageController } from './PageController';

export const ArticleGrid = () => {
  const { articleCurPage, pageSize } = useAppSelector((state) => state.homePage);
  const dispatch = useAppDispatch();

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
    onError(err) {
      dispatch(setMessageState({ visible: true, text: '请求失败，刷新重试!', state: 'error' }));
    },
    onSuccess(data) {
      dispatch(setTotalPageCountForHome(data?.totalPageCount ?? 0));
      dispatch(setTotalPageCountForAdmin(data?.totalPageCount ?? 0));
    },
  });

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
          <ArticleCard key={article.id} {...article}></ArticleCard>
        ))}
      </Box>
      <PageController />
    </Box>
  );
};
