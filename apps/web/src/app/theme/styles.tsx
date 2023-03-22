import { GlobalStyles, Theme } from '@mui/material';

export const Styles = () => {
  const styles = (theme: Theme) => {
    return {
      a: {
        textDecoration: `none`,
        color: "inherit",
        transition: 'all 0.3s',

        '&:hover': {
          textDecoration: `underline wavy ${theme.palette.secondary.main}`,
        }
      },
      '::-webkit-scrollbar': {
        width: '6px',
        backgroundColor: 'transparent',

        '&:horizontal': {
          height: '6px',
        },
      },

      '::-webkit-scrollbar-thumb': {
        borderRadius: '6.4px',
        backgroundColor: theme.palette.primary.main,

        '&:hover': {
          backgroundColor: theme.palette.secondary.main,
        }
      },

      // ===============================================选择文字========================================
      '::selection': {
        backgroundColor: theme.palette.primary.main,
      },
    };
  };

  return <GlobalStyles styles={styles}></GlobalStyles>;
};
