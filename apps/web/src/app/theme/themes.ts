import { Theme, createTheme } from "@mui/material/styles";
import { ThemeMode } from '../store/themeMode';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f4f5f5'
    }
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1b1b1d'
    }
  },
});

// const themes: Themes = {
//   light: {
//     primaryColor: '#1890ff',
//     hoverColor: '#40a9ff',
//     activeColor: '#096dd9',
//     backgroundColor: '#f4f5f5',
//     foregroundColor: '#ffffff',
//     surfaceColor: '#f2f2f2',
//     textColor: '#1c1e21',
//     successColor: '#52c41a',
//     warnColor: '#faad14',
//     dangeColor: '#ff4d4f',
//     shadowColor: 'rgb(0 0 0 / 0.1)',
//     borderColor: '#dadde1',
//     transition: 'all 0.3s cubic-bezier(0.34, 0.69, 0.1, 1)',
//   },
//   dark: {
//     primaryColor: '#67d6ed',
//     hoverColor: '#95e2f2',
//     activeColor: '#19b5d5',
//     backgroundColor: '#1b1b1d',
//     foregroundColor: '#242526',
//     surfaceColor: '#2f3031',
//     textColor: '#e3e3e3',
//     successColor: '#73d13d',
//     warnColor: '#ffec3d',
//     dangeColor: '#fa541c',
//     shadowColor: 'rgb(0 0 0/0.4)',
//     borderColor: '#606770',
//     transition: 'all 0.3s cubic-bezier(0.34, 0.69, 0.1, 1)',
//   },
// };

export const themes: Record<ThemeMode, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};
