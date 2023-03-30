import { Box, MenuItem, MenuList, useTheme } from '@mui/material';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { ArticleAdminBody } from './components/ArticleAdminBody';
import { RecordAdminBody } from './components/RecordAdminBody';

const options = [
  { text: '文章管理', bodyIndex: 0 },
  { text: '数据管理', bodyIndex: 1 },
  { text: '用户管理', bodyIndex: 2 },
];

export const AdminPage: React.FC = () => {
  const bodies = [<ArticleAdminBody />, <RecordAdminBody />];
  const [currentBodyIndex, setCurrentBodyIndex] = useState(0);
  const { hasLogin, userInfo } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { palette } = useTheme();

  if (!hasLogin || userInfo?.permission !== 'admin') return <Navigate to="/" />;

  return (
    <Box
      width="100vw"
      height="100vh"
      sx={{
        display: 'flex',
      }}
    >
      <MenuList
        sx={{
          position: 'sticky',
          top: 0,
          height: 'fit-content',
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            onClick={() => setCurrentBodyIndex(option.bodyIndex)}
            key={option.text}
            sx={{
              padding: '1em',
              backgroundColor: currentBodyIndex === index ? palette.primary.main : 'unset',
            }}
          >
            {option.text}
          </MenuItem>
        ))}
      </MenuList>

      {bodies[currentBodyIndex]}
    </Box>
  );
};
