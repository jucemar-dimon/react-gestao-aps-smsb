import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
:root{
  --blue-900:#27176d;
  --yellow-900:#fef300;
}

* {
  margin:0;
  padding:0;
  box-sizing:border-box;
}

html{
  @media(max-width:1080px){
    font-size: 93.75%;
  }

  @media(max-width:720){
    font-size: 87.5%;
  }
}

body {
  width:100%;
  height: 100vh;
  font-family: 'Poppins',sans-serif;
  -webkit-font-smoothing: antialiased;
}

button{
  cursor: pointer;
}

[disabled]{
  opacity: 0.6;
  cursor: not-allowed;
}

`;
