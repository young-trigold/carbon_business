import {
  Button,
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
import { useAppDispatch, useAppSelector } from '../../../../app/store';
import {
  setAgencies,
  setEndDate,
  setQueryKey,
  setStartDate,
} from '../../../../app/store/pages/home';
import {
  AgenciesOfCarbonBusiness,
  QueryKeyOfCarbonBusiness,
  agencies,
  carbonBusinessKeys,
  queryKeys,
} from 'types';
import { AgencyCheckBox } from './components/AgencyCheckBox';

export interface FormState {
  startDate: string;
  endDate: string;
  checkedAgencies: AgenciesOfCarbonBusiness[];
  queryKey: QueryKeyOfCarbonBusiness;
}

export const Form = () => {
  const { startDate, endDate, checkedAgencies, queryKey } = useAppSelector(
    (state) => state.homePage,
  );
  const [form, setForm] = useState<FormState>({
    startDate,
    endDate,
    checkedAgencies,
    queryKey,
  });

  const onStartDateChange = (value: { $d: string }) => {
    setForm((preForm) => ({
      ...preForm,
      startDate: dayjs(new Date(value.$d)).format('YYYY-MM-DD'),
    }));
  };

  const onEndDateChange = (value: { $d: string }) => {
    setForm((preForm) => ({
      ...preForm,
      endDate: dayjs(new Date(value.$d)).format('YYYY-MM-DD'),
    }));
  };

  const onQueryKeyChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setForm((preForm) => ({
      ...preForm,
      queryKey: event.target.value as QueryKeyOfCarbonBusiness,
    }));
  };

  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(setStartDate(form.startDate));
    dispatch(setEndDate(form.endDate));
    dispatch(setQueryKey(form.queryKey));
    dispatch(setAgencies(form.checkedAgencies));
  };

  return (
    <Stack spacing={2}>
      <FormGroup>
        <Stack spacing={2}>
          <DatePicker
            label="交易开始日期"
            value={form.startDate}
            onChange={onStartDateChange as any}
            renderInput={(params) => <TextField {...params} />}
          />

          <DatePicker
            label="交易结束日期"
            value={form.endDate}
            onChange={onEndDateChange as any}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </FormGroup>

      <FormGroup>
        <FormLabel>碳排放交易机构</FormLabel>
        <Stack direction="row" flexWrap="wrap">
          {agencies.map((agency) => (
            <AgencyCheckBox
              agency={agency}
              setForm={setForm}
              checkedAgencies={form.checkedAgencies}
            />
          ))}
        </Stack>
      </FormGroup>

      <FormGroup>
        <FormLabel>查询目标值</FormLabel>
        <RadioGroup defaultValue="averagePrice" name="queryKey" onChange={onQueryKeyChange}>
          {queryKeys.map((queryKey) => (
            <FormControlLabel
              value={queryKey}
              control={<Radio checked={form.queryKey === queryKey} />}
              label={carbonBusinessKeys.get(queryKey)}
            />
          ))}
        </RadioGroup>
      </FormGroup>

      <Button variant="contained" onClick={onClick}>
        查询
      </Button>
    </Stack>
  );
};
