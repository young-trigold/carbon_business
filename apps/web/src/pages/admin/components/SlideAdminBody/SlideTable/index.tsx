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
import { Slide } from 'lib';
import { useQuery } from 'react-query';
import { useAppDispatch } from '../../../../../app/store';
import { SlideRow } from '../SlideTable/SlideRow';

export const SlideTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['slides'],
    queryFn: async () => {
      const res = await axios.get<Array<Slide>>(`/api/slides`);
      return res.data;
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
            <TableCell>标题</TableCell>
            <TableCell>描述</TableCell>
            <TableCell>链接</TableCell>
            <TableCell>背景图</TableCell>
            <TableCell align="center">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((slide) => (
            <SlideRow key={slide.id} slide={slide}></SlideRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
