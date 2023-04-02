import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import Fab from '@mui/material/Fab';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import dayjs from 'dayjs';
import { CarbonBusiness } from 'lib';
import { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useAppDispatch, useAppSelector } from '../../../../../app/store';
import { setMessageState } from '../../../../../app/store/message';

export const AddRecord = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const closeModal = () => {
    setAddModalVisible(false);
  };

  const initialFormState: Omit<CarbonBusiness, 'id'> = useMemo(
    () => ({
      date: dayjs().format('YYYY-MM-DD'),
      agency: '',
      type: '',
    }),
    [],
  );

  const [formState, setFormState] = useState(initialFormState);

  const dispatch = useAppDispatch();

  const { curPage, pageSize } = useAppSelector((state) => state.adminPage.bodies.recordBody);

  const { mutate: addRecord } = useMutation(
    async () => {
      const res = await axios.post('/api/records', formState);
      return res.data;
    },
    {
      onMutate(variables) {
        dispatch(setMessageState({ text: '正在添加', state: 'info', visible: true }));
      },
      onError(error, variables, context) {
        dispatch(setMessageState({ text: '添加失败!', state: 'error', visible: true }));
      },
      onSuccess(data, variables, context) {
        dispatch(setMessageState({ text: '添加成功!', state: 'success', visible: true }));
        setFormState(initialFormState);
        // client.setQueryData<{
        //   articles: Article[];
        //   totalPageCount: number;
        // }>(['articles', curPage, pageSize], (pre) => {
        //   return {
        //     ...pre!,
        //     articles: [data.newArticle, ...(pre?.articles ?? [])],
        //   };
        // });
      },
    },
  );

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

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'absolute',
          right: '48px',
          bottom: '48px',
        }}
        onClick={() => setAddModalVisible(true)}
      >
        <AddIcon />
      </Fab>
      <Dialog maxWidth={false} open={addModalVisible} onClose={closeModal}>
        <DialogTitle>添加数据</DialogTitle>

        <DialogContent>
          <Box width={500} component="form">
            <Box
              sx={{
                margin: '0.5em 0',
              }}
            >
              <DatePicker
                label="文章日期"
                value={formState.date}
                maxDate={dayjs().format('YYYY-MM-DD')}
                onChange={onDateChange as any}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>

            <TextField
              fullWidth
              value={formState.agency}
              label="交易机构"
              multiline
              maxRows={2}
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onAgencyChange}
            ></TextField>
            <TextField
              fullWidth
              value={formState.type}
              label="交易类型"
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onTypeChange}
            ></TextField>
            <TextField
              fullWidth
              value={formState.maxPrice}
              label="最高价"
              type="number"
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onMaxPriceChange}
            ></TextField>
            <TextField
              fullWidth
              value={formState.minPrice}
              label="最低价"
              type="number"
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onMinPriceChange}
            ></TextField>
            <TextField
              fullWidth
              value={formState.startPrice}
              label="开盘价"
              type="number"
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onStartPriceChange}
            ></TextField>
            <TextField
              fullWidth
              value={formState.endPrice}
              label="终盘价"
              type="number"
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onEndPriceChange}
            ></TextField>
            <TextField
              fullWidth
              value={formState.averagePrice}
              label="平均价"
              type="number"
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onAveragePriceChange}
            ></TextField>
            <TextField
              fullWidth
              value={formState.volume}
              label="交易量"
              type="number"
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onVolumeChange}
            ></TextField>
            <TextField
              fullWidth
              value={formState.amount}
              label="交易额"
              type="number"
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onAmountChange}
            ></TextField>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal}>取消</Button>
          <Button
            onClick={() => addRecord()}
            variant="contained"
            disabled={Object.entries(initialFormState).every(
              ([key, value]) => formState[key as keyof Omit<CarbonBusiness, 'id'>] === value,
            )}
          >
            添加
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
