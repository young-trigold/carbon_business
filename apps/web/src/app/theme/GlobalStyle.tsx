import { Global } from '@emotion/react';

export const GlobalStyle = () => (
  <Global
    styles={{
      '*': {
        boxSizing: 'border-box',
        outline: 'none',
      },
      body: {
        margin: 0,
      },
    }}
  />
);
