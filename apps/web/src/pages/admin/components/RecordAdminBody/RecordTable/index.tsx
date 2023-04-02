import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { CarbonBusiness } from 'lib';
import { useQuery } from 'react-query';
import { useAppDispatch, useAppSelector } from '../../../../../app/store';
import { setRecordTotalPageCount } from '../../../../../app/store/pages/admin';
import { RecordRow } from './RecordRow';

export const RecordTable = () => {
  const dispatch = useAppDispatch();
  const { curPage, pageSize } = useAppSelector((state) => state.adminPage.bodies.recordBody);

  const { data, isLoading } = useQuery({
    queryKey: ['records', curPage, pageSize],
    queryFn: async () => {
      const searchParamsAsStr = Object.entries({
        curPage,
        pageSize,
        paged: 1,
      })
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      const res = await axios.get<{
        records: CarbonBusiness[];
        totalPageCount: number;
      }>(`/api/records?${searchParamsAsStr}`);
      return res.data;
    },
    onSuccess(data) {
      dispatch(setRecordTotalPageCount(data?.totalPageCount ?? 0));
    },
  });

  if (isLoading)
    return <Skeleton variant="rounded" animation="wave" width="100%" height="1000px" />;

  return (
    <TableContainer
      component={Paper}
      sx={{
        height: 'calc(100vh - 76px - 32px)',
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
            <TableCell>日期</TableCell>
            <TableCell>交易机构</TableCell>
            <TableCell>类型</TableCell>
            <TableCell>开盘价</TableCell>
            <TableCell>终盘价</TableCell>
            <TableCell>最低价</TableCell>
            <TableCell>最高价</TableCell>
            <TableCell>平均价</TableCell>
            <TableCell>交易量</TableCell>
            <TableCell>交易额</TableCell>
            <TableCell align="center">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.records?.map((record) => (
            <RecordRow key={record.id} record={record}></RecordRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
