import { Checkbox, FormControlLabel } from '@mui/material';
import { AgenciesOfCarbonBusiness } from 'lib';
import { FormState } from '../..';

interface AgencyCheckBoxProps {
  agency: AgenciesOfCarbonBusiness;
  checkedAgencies: AgenciesOfCarbonBusiness[];
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

export const AgencyCheckBox: React.FC<AgencyCheckBoxProps> = (props) => {
  const { agency, checkedAgencies, setForm } = props;
  const checked = checkedAgencies.includes(agency);

  const onAgencyChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setForm((preForm) => {
      const newCheckedAgencies = event.target.checked
        ? [...preForm.checkedAgencies, event.target.name]
        : preForm.checkedAgencies.filter((agency) => agency !== event.target.name);

      return {
        ...preForm,
        checkedAgencies: newCheckedAgencies as AgenciesOfCarbonBusiness[],
      };
    });
  };

  return (
    <FormControlLabel
      control={<Checkbox checked={checked} name={agency} onChange={onAgencyChange} />}
      label={agency}
    />
  );
};
