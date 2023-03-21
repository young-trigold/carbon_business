import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../app/store';

export const UserAvatar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { userInfo } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="打开设置">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={userInfo?.name ?? '游客'} src="../../../../../favicon.ico" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem
          key="后台管理"
          onClick={() => {
            navigate('/admin');
          }}
        >
          <Typography textAlign="center">后台管理</Typography>
        </MenuItem>
        <MenuItem
          key="退出登录"
          onClick={() => {
            window.watchedLocalStorage.removeItem('token');
          }}
        >
          <Typography textAlign="center">退出登录</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};
