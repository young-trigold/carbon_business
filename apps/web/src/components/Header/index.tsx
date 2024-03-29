import { Stack, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/store';
import { LoginButton } from './components/LoginButton';
import { ToggleThemeButton } from './components/ToggleThemeButton';
import { UserAvatar } from './components/UserAvatar';
import XUPTIcon from '../../../src/static/icons/xupt_logo.png';

export const HeaderHeight = 60;

const pages = [
  { title: '碳交易面板', link: '/chart' },
  { title: '碳导航', link: 'https://navi.co2.press/' },
  { title: '碳市场', link: '/market' },
  { title: '碳足迹', link: '/footage' },
  { title: '碳金融', link: '/finance' },
];

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state);
  const { hasLogin, userInfo } = user;
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      sx={{
        filter: 'opacity(0.7)',
        backdropFilter: 'blur(10px)',
        height: `${HeaderHeight}px`,
        boxShadow: theme.shadows[1],
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Stack
            onClick={() => {
              navigate('/');
            }}
            flexDirection="row"
            alignItems="center"
            sx={{
              cursor: 'pointer',
            }}
          >
            <Box width={50} sx={{
              borderRadius: '50%',
              overflow: 'hidden',
              marginRight: '0.5em',
            }}>
              <img
                alt="西安邮电大学"
                src={XUPTIcon}
                width={50}
              />
            </Box>

            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              首页
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {[
              ...pages.map((page) => (
                <Button
                  key={page.title}
                  onClick={() =>
                    page.link.startsWith('http') ? window.open(page.link) : navigate(page.link)
                  }
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.title}
                </Button>
              )),
            ]}
          </Box>
          <ToggleThemeButton />
          {hasLogin ? <UserAvatar /> : <LoginButton />}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
