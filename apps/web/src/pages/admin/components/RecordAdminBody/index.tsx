import { Box } from '@mui/material';
import { AddRecord } from './AddRecord';
import { RecordTable } from './RecordTable';
import { PageController } from './PageController';

export const RecordAdminBody = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <RecordTable />
      <PageController />
      <AddRecord />
    </Box>
  );
};
