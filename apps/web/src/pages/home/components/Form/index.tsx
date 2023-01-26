import {
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

export const Form = () => {
  const [value, setValue] = useState();

  return (
    <Stack>
      <FormGroup>
        <DatePicker
          label="交易开始日期"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />

        <DatePicker
          label="交易结束日期"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </FormGroup>

      <FormGroup>
        <FormControlLabel control={<Checkbox></Checkbox>} label="test"></FormControlLabel>
      </FormGroup>

      <FormControl>
        <FormLabel>查询目标值</FormLabel>
        <RadioGroup defaultValue="female" name="queryKey">
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
};
