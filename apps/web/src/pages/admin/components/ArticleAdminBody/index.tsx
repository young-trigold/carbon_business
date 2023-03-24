import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { Article } from 'lib';
import { useQuery } from 'react-query';
import { useAppSelector } from '../../../../app/store';
import { ArticleRow } from './ArticleRow';

export const ArticleAdminBody = () => {
  const { articleCurPage, pageSize } = useAppSelector(
    (state) => state.adminPage.bodies.articleBody,
  );

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

  const { palette } = useTheme();

  if (isLoading)
    return <Skeleton variant="rounded" animation="wave" width="100%" height="1000px" />;

  return (
    <TableContainer
      component={Paper}
      sx={{
        flexGrow: 1,
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 999,
            backdropFilter: 'blur(8px)',
          }}
        >
          <TableRow>
            <TableCell>标题</TableCell>
            <TableCell>来源</TableCell>
            <TableCell>链接</TableCell>
            <TableCell>背景图</TableCell>
            <TableCell>日期</TableCell>
            <TableCell align="center">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.articles?.map((article) => (
            <ArticleRow article={article}></ArticleRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
