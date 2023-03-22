import { Box, MenuItem, MenuList, Stack } from '@mui/material';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setMessageState } from '../../app/store/message';
import { Header } from '../../components/Header';
import { ArticleAdminBody } from './components/ArticleAdminBody';
import { RecordAdminBody } from './components/RecordAdminBody';

const bodies = [<ArticleAdminBody></ArticleAdminBody>, <RecordAdminBody></RecordAdminBody>];
const options = [
  { text: '文章管理', bodyIndex: 0 },
  { text: '数据管理', bodyIndex: 1 },
  { text: '用户管理', bodyIndex: 2 },
];

export const AdminPage: React.FC = () => {
  // const {} = useQuery({

  // });
  const [currentBodyIndex, setCurrentBodyIndex] = useState(0);

  const { hasLogin, userInfo } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  if (!hasLogin || userInfo?.permission !== 'admin') {
    dispatch(setMessageState({ visible: true, text: '身份信息不匹配', state: 'error' }));
    return <Navigate to="/" />;
  }

  return (
    <Box>
      <Header />
      <Stack
        flexDirection="row"
        sx={{
          width: '100vw',
        }}
      >
        <MenuList>
          {options.map((option) => (
            <MenuItem
              onClick={() => setCurrentBodyIndex(option.bodyIndex)}
              key={option.text}
              sx={{
                padding: '1em',
              }}
            >
              {option.text}
            </MenuItem>
          ))}
        </MenuList>
        {bodies[currentBodyIndex]}
      </Stack>
    </Box>
  );
};
