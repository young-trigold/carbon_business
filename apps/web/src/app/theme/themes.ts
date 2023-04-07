import { Theme, createTheme } from '@mui/material/styles';
import { ThemeMode } from '../store/themeMode';
import { zhCN } from '@mui/material/locale';

const lightTheme = createTheme(
  {
    palette: {
      mode: 'light',
      contrastThreshold: 4.5,
      background: {
        default: '#f4f5f5',
        paper: '#ffffff',
      },
      primary: {
        main: '#81c784',
      },
      secondary: {
        main: '#ffa733',
      },
      action: {
        hover: '#66bb6a',
        focus: '#4caf50',
        active: '#43a047',
      },

    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        // most basic recommended timing
        standard: 300,
        // this is to be used in complex animations
        complex: 375,
        // recommended when something is entering screen
        enteringScreen: 225,
        // recommended when something is leaving screen
        leavingScreen: 195,
      },
      easing: {
        // This is the most common easing curve.
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        // Objects enter the screen at full velocity from off-screen and
        // slowly decelerate to a resting point.
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        // Objects leave the screen at full velocity. They do not decelerate when off-screen.
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        // The sharp curve is used by objects that may return to the screen at any time.
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
  },
  zhCN,
);

const darkTheme = createTheme(
  {
    palette: {
      mode: 'dark',
      contrastThreshold: 4.5,
      background: {
        default: '#1b1b1d',
        paper: '#242526',
      },
      primary: {
        main: '#43a047',
      },
      secondary: {
        main: '#ff9100',
      },
      action: {
        hover: '#388e3c',
        focus: '#2e7d32',
        active: '#1b5e20',
      },
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        // most basic recommended timing
        standard: 300,
        // this is to be used in complex animations
        complex: 375,
        // recommended when something is entering screen
        enteringScreen: 225,
        // recommended when something is leaving screen
        leavingScreen: 195,
      },
      easing: {
        // This is the most common easing curve.
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        // Objects enter the screen at full velocity from off-screen and
        // slowly decelerate to a resting point.
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        // Objects leave the screen at full velocity. They do not decelerate when off-screen.
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        // The sharp curve is used by objects that may return to the screen at any time.
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
  },
  zhCN,
);

export const themes: Record<ThemeMode, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};
