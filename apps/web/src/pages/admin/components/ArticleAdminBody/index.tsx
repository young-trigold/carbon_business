import { Box } from '@mui/material';
import { AddArticle } from './AddArticle';
import { ArticleTable } from './ArticleTable';
import { PageController } from './PageController';

export const ArticleAdminBody = () => {
  return (
    <Box sx={{
      flexGrow: 1,
    }}>
      <ArticleTable />
      <PageController />
      <AddArticle />
    </Box>
  );
};
