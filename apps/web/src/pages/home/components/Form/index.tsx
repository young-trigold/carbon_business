import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../../../app/store';
import { setEndDate, setStartDate } from '../../../../app/store/pages/home';
import { carbonBusinessKeys, queryKeys, startDate } from 'types';

export const Form = () => {
  const dispatch = useAppDispatch();

  const onStartDateChange = (value) => {
    console.debug(value);
    dispatch(setStartDate(value));
  };

  const onEndDateChange = (value) => {
    console.debug(value);
    dispatch(setEndDate(value));
  };

  const onAgenciesChange = (value) => {};

  const onQueryKeyChange = (value) => {};

  return (
    <Stack spacing={2}>
      <FormGroup>
        <Stack spacing={2}>
          <DatePicker
            label="交易开始日期"
            value={startDate}
            onChange={onStartDateChange}
            renderInput={(params) => <TextField {...params} />}
          />

          <DatePicker
            label="交易结束日期"
            value={dayjs().format('YYYY-MM-DD')}
            onChange={onEndDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </FormGroup>

      <FormGroup>
        <FormLabel>碳排放交易机构</FormLabel>
        {['上海', '湖北', '深圳', '广州'].map((agency) => (
          <FormControlLabel control={<Checkbox></Checkbox>} label={agency}></FormControlLabel>
        ))}
      </FormGroup>

      <FormControl>
        <FormLabel>查询目标值</FormLabel>

        <RadioGroup defaultValue="female" name="queryKey">
          {queryKeys.map((queryKey) => (
            <FormControlLabel
              value={queryKey}
              control={<Radio />}
              label={carbonBusinessKeys.get(queryKey)}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Button variant="contained">查询</Button>
    </Stack>
  );
};
