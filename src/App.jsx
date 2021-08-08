import React from 'react';
import Header from './components/Header';
import GoogleMap from './components/Map';
import { GlobalStyle } from './styles/globalStyle';
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
