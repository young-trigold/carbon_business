import { Forest } from '@mui/icons-material';
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

const pages = [
  { title: '碳交易面板', link: '/chart' },
  { title: '碳导航', link: 'https://navi.co2.press/' },
  { title: '碳市场', link: ' ' },
  { title: '碳足迹', link: '' },
  { title: '政策法规', link: '' },
];

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state);
  const { hasLogin, userInfo } = user;

  return (
    <AppBar position="sticky" sx={{
      filter: 'opacity(0.7)',
      backdropFilter: 'blur(10px)',
    }}>
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
            <Forest sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
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
