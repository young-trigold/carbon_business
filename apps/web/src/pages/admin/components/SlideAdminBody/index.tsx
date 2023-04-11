import { Box } from '@mui/material';
import { AddSlide } from './AddSlide';
import { SlideTable } from './SlideTable';

export const SlideAdminBody = () => {
  return (
    <Box sx={{
      flexGrow: 1,
    }}>
      <SlideTable />
      <AddSlide />
    </Box>
  );
};
