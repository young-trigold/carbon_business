import { Button } from '@mui/material';
import styled from '@emotion/styled';
import { Global } from '@emotion/react';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

const App = () => {
  return (
    <Container>
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
      <Button>click me</Button>
    </Container>
  );
};

export default App;
