import React from 'react';
import Header from '../Header';
import GoogleMap from '../Map';
import { GlobalStyle } from '../../styles/globalStyle';
import { Main, Container } from './styles';

function App() {
  return (
    <>
      <Container>
        <GlobalStyle />
        <Header />
        <Main>
          <GoogleMap />
        </Main>
      </Container>
    </>
  );
}

export default App;
