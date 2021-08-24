import React from 'react';
import Header from '../Header';
import GoogleMap from '../Map';
import { GlobalStyle } from '../../styles/global';
import Footer from '../Footer';

function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <GoogleMap />
      <Footer />
    </>
  );
}

export default App;
