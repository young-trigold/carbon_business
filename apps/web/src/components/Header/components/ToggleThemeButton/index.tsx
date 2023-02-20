import { DarkMode, LightMode } from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip, styled } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { ThemeMode, setThemeMode } from '../../../../app/store/themeMode';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: '50%',
    },
    '&:first-of-type': {
      borderRadius: '50%',
    },
  },
}));

export const ToggleThemeButton = () => {
  const dispatch = useAppDispatch();
  const onThemeModeChange = (event: React.MouseEvent, value: ThemeMode) => {
    if (value) dispatch(setThemeMode(value));
  };

  const { themeMode } = useAppSelector((state) => state.themeMode);

  return (
    <Box sx={{ marginRight: '2em' }}>
      <StyledToggleButtonGroup
        value={themeMode}
        exclusive
        onChange={onThemeModeChange}
        sx={{
          borderRadius: '2em',
        }}
      >
        <Tooltip title="白天">
          <ToggleButton value="light">
            <LightMode />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="夜间">
          <ToggleButton value="dark">
            <DarkMode />
          </ToggleButton>
        </Tooltip>
      </StyledToggleButtonGroup>
    </Box>
  );
};
