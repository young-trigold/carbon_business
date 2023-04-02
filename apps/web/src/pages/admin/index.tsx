import { Stack } from '@mui/material';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/store';
import { AdminMenuList } from './components/AdminMenuList';
import { ArticleAdminBody } from './components/ArticleAdminBody';
import { RecordAdminBody } from './components/RecordAdminBody';

const bodies = [<ArticleAdminBody />, <RecordAdminBody />];

export const AdminPage: React.FC = () => {
  const { currentBodyIndex } = useAppSelector((state) => state.adminPage);

  const currentBody = useMemo(() => bodies[currentBodyIndex], [currentBodyIndex]);

  const { hasLogin, userInfo } = useAppSelector((state) => state.user);

  if (!hasLogin || userInfo?.permission !== 'admin') return <Navigate to="/" />;

  return (
    <Stack
      width="100vw"
      height="100vh"
      flexDirection="row"
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <AdminMenuList />
      {currentBody}
      
    </Stack>
  );
};
