import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import dayjs from 'dayjs';
import { CarbonBusiness } from 'lib';
import { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { client } from '../../../../../../App';
import { useAppDispatch, useAppSelector } from '../../../../../../app/store';
import { setMessageState } from '../../../../../../app/store/message';

interface RecordRowProps {
  record: CarbonBusiness;
}

export const RecordRow: React.FC<RecordRowProps> = (props) => {
  const { record } = props;

  const initialFormState = useMemo(
    () =>
      Object.entries(record)
        .filter(([key]) => key !== 'id')
        .reduce((result, [key, value]) => {
          result[key] = value;
          return result;
        }, {} as any),
    [],
  );

  const [formState, setFormState] = useState<Omit<CarbonBusiness, 'id'>>(initialFormState as any);

  const onAgencyChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const agency = event.target.value;
    setFormState((preForm) => ({
      ...preForm,
      agency,
    }));
  };

  const onTypeChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const type = event.target.value;
    setFormState((preForm) => ({
      ...preForm,
      type,
    }));
  };

  const onDateChange = (value: { $d: string }) => {
    setFormState((preForm) => ({
      ...preForm,
      date: dayjs(new Date(value.$d)).format('YYYY-MM-DD'),
    }));
  };

  const onStartPriceChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const startPrice = Number.parseFloat(event.target.value);
    setFormState((preForm) => ({
      ...preForm,
      startPrice,
    }));
  };

  const onEndPriceChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const endPrice = Number.parseFloat(event.target.value);
    setFormState((preForm) => ({
      ...preForm,
      endPrice,
    }));
  };

  const onMinPriceChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const minPrice = Number.parseFloat(event.target.value);
    setFormState((preForm) => ({
      ...preForm,
      minPrice,
    }));
  };

  const onMaxPriceChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const maxPrice = Number.parseFloat(event.target.value);
    setFormState((preForm) => ({
      ...preForm,
      maxPrice,
    }));
  };

  const onAveragePriceChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const averagePrice = Number.parseFloat(event.target.value);
    setFormState((preForm) => ({
      ...preForm,
      averagePrice,
    }));
  };

  const onVolumeChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const volume = Number.parseFloat(event.target.value);
    setFormState((preForm) => ({
      ...preForm,
      volume,
    }));
  };

  const onAmountChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const amount = Number.parseFloat(event.target.value);
    setFormState((preForm) => ({
      ...preForm,
      amount,
    }));
  };

  const dispatch = useAppDispatch();

  const { curPage, pageSize } = useAppSelector((state) => state.adminPage.bodies.recordBody);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const closeModal = () => {
    setDeleteModalVisible(false);
  };

  const { mutate: updateRecord } = useMutation(
    (recordId: string) => {
      return axios.put(`/api/records/${recordId}`, formState, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      });
    },
    {
      onMutate(variables) {
        dispatch(setMessageState({ visible: true, text: '正在更新...', state: 'info' }));
      },
      onError(error, variables, context) {
        dispatch(setMessageState({ visible: true, text: '更新失败!', state: 'error' }));
      },
      onSuccess(data, variables, context) {
        // client.setQueryData<{
        //   records: CarbonBusiness[];
        //   totalPageCount: number;
        // }>(['records', curPage, pageSize], (pre) => ({
        //   ...pre!,
        //   records: pre!.records.map((prerecord) => {
        //     if (prerecord.id === record.id) return { ...prerecord, ...formState };
        //     return prerecord;
        //   }),
        // }));
        dispatch(setMessageState({ visible: true, text: '更新成功!', state: 'success' }));
      },
    },
  );

  const { mutate: deleteRecord } = useMutation(
    (recordId: string) => {
      return axios.delete(`/api/records/${recordId}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      });
    },
    {
      onMutate(variables) {
        dispatch(setMessageState({ state: 'info', visible: true, text: '正在删除...' }));
      },
      onError(error, variables, context) {
        dispatch(setMessageState({ state: 'error', visible: true, text: '删除失败!' }));
      },
      onSuccess(data, variables, context) {
        // client.setQueryData<{
        //   records: CarbonBusiness[];
        //   totalPageCount: number;
        // }>(['records', curPage, pageSize], (pre) => {
        //   return {
        //     ...pre!,
        //     records: pre!.records.filter((prerecord) => prerecord.id !== record.id),
        //   };
        // });
        dispatch(setMessageState({ state: 'success', visible: true, text: '删除成功!' }));
        closeModal();
      },
    },
  );

  return (
    <TableRow key={record.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        <DatePicker
          value={formState.date}
          maxDate={dayjs().format('YYYY-MM-DD')}
          onChange={onDateChange as any}
          renderInput={(params) => <TextField size="small" {...params} />}
        />
      </TableCell>
      <TableCell>
        <TextField
          onChange={onAgencyChange}
          multiline
          maxRows={2}
          variant="standard"
          value={formState.agency}
        ></TextField>
      </TableCell>
      <TableCell>
        <TextField onChange={onTypeChange} variant="standard" value={formState.type}></TextField>
      </TableCell>
      <TableCell>
        <TextField
          onChange={onStartPriceChange}
          variant="standard"
          value={formState.startPrice}
          type="number"
        ></TextField>
      </TableCell>
      <TableCell>
        <TextField
          onChange={onEndPriceChange}
          variant="standard"
          value={formState.endPrice}
          type="number"
        ></TextField>
      </TableCell>
      <TableCell>
        <TextField
          onChange={onMinPriceChange}
          variant="standard"
          value={formState.minPrice}
          type="number"
        ></TextField>
      </TableCell>
      <TableCell>
        <TextField
          onChange={onMaxPriceChange}
          variant="standard"
          value={formState.maxPrice}
          type="number"
        ></TextField>
      </TableCell>
      <TableCell>
        <TextField
          onChange={onAveragePriceChange}
          variant="standard"
          value={formState.averagePrice}
          type="number"
        ></TextField>
      </TableCell>
      <TableCell>
        <TextField
          onChange={onVolumeChange}
          variant="standard"
          value={formState.volume}
          type="number"
        ></TextField>
      </TableCell>
      <TableCell>
        <TextField
          onChange={onAmountChange}
          variant="standard"
          value={formState.amount}
          type="number"
        ></TextField>
      </TableCell>
      <TableCell align="center">
        <Button
          variant="outlined"
          sx={{
            marginBottom: '0.5em',
          }}
          onClick={() => {
            setDeleteModalVisible(true);
          }}
        >
          删除
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            updateRecord(record.id);
          }}
          disabled={JSON.stringify(initialFormState) === JSON.stringify(formState)}
        >
          更新
        </Button>
      </TableCell>
      <Dialog maxWidth={false} open={deleteModalVisible} onClose={closeModal}>
        <DialogTitle>确认删除</DialogTitle>
        <Box width={500}>
          <DialogContent>您确定要删除该文章吗？</DialogContent>
        </Box>
        <DialogActions>
          <Button onClick={closeModal}>取消</Button>
          <Button
            onClick={() => {
              deleteRecord(record.id);
            }}
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
};
