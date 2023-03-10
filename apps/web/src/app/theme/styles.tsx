import { GlobalStyles, Theme } from '@mui/material';

export const Styles = () => {
  const styles = (theme: Theme) => {
    return {
      '::-webkit-scrollbar': {
        width: '6px',
        backgroundColor: 'transparent',
      },

      '::-webkit-scrollbar:horizontal': {
        height: '6px',
      },

      '::-webkit-scrollbar-thumb': {
        borderRadius: '6.4px',
        backgroundColor: theme.palette.primary.main,
      },

      // ===============================================éćŠćĺ­========================================
      '::selection': {
        backgroundColor: theme.palette.primary.main,
      },
    };
  };

  return <GlobalStyles styles={styles}></GlobalStyles>;
};
