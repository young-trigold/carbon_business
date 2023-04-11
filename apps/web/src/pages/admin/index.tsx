import { Stack } from '@mui/material';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/store';
import { AdminMenuList } from './components/AdminMenuList';
import { ArticleAdminBody } from './components/ArticleAdminBody';
import { RecordAdminBody } from './components/RecordAdminBody';
import { SlideAdminBody } from './components/SlideAdminBody';

export const tabs = [
  {text: '文章管理', body: <ArticleAdminBody />},
  {text: '数据管理', body: <RecordAdminBody />},
  {text: '轮播图管理', body: <SlideAdminBody />},
];

const AdminPage: React.FC = () => {
  const currentBody = useAppSelector((state) => tabs[state.adminPage.currentBodyIndex].body);
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

export default AdminPage;
