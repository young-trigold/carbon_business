import { Box, Skeleton, Typography } from '@mui/material';
import axios from 'axios';
import { Article } from 'lib';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { setMessageState } from '../../../../app/store/message';
import { setArticleTotalPageCount as setTotalPageCountForAdmin } from '../../../../app/store/pages/admin';
import {
  setFinanceTotalPageCount,
  setFootageTotalPageCount,
  setMarketTotalPageCount,
  setDefaultTotalPageCount as setTotalPageCountForHome,
} from '../../../../app/store/pages/home';
import { ArticleCard } from './ArticleCard';
import { PageController } from './PageController';

export const ArticleGrid = () => {
  const { articleTag = 'default' } = useParams();

  const { articleCurPage, pageSize } = useAppSelector((state) => state.homePage);
  const dispatch = useAppDispatch();

  const { data, isLoading } = useQuery({
    queryKey: ['articles', articleTag, articleCurPage, pageSize],
    queryFn: async () => {
      const searchParamsAsStr = Object.entries({
        articleTag,
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
      switch (articleTag) {
        case 'default':
          dispatch(setTotalPageCountForHome(data?.totalPageCount ?? 0));
          dispatch(setTotalPageCountForAdmin(data?.totalPageCount ?? 0));
          break;
        case 'market':
          dispatch(setMarketTotalPageCount(data?.totalPageCount ?? 0));
          break;
        case 'finance':
          dispatch(setFinanceTotalPageCount(data?.totalPageCount ?? 0));
          break;
        case 'footage':
          dispatch(setFootageTotalPageCount(data?.totalPageCount ?? 0));
        default:
          break;
      }
    },
  });

  if (isLoading)
    return <Skeleton variant="rounded" animation="wave" width="100%" height="1000px" />;

  return (
    <Box>
      <Typography variant="h5">实时文章</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 600px)',
          gridGap: '1em',
          justifyContent: 'space-between',
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
