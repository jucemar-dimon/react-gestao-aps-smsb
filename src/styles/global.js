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

// Small devices (landscape phones, 576px and up)
@media (min-width: 192px) { font-size: 68.75%;  }
@media (min-width: 384px) { font-size: 75.25%;  }

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) { font-size: 81.25%;  }

// Medium devices (tablets, 768px and up)
@media (min-width: 768px) { font-size: 87.5%;  }

// Large devices (desktops, 992px and up)
@media (min-width: 992px) { font-size: 93.75%;  }

// X-Large devices (large desktops, 1200px and up)
@media (min-width: 1200px) {  }

// XX-Large devices (larger desktops, 1400px and up)
@media (min-width: 1400px) {  }

}

body {
  font-family: 'Poppins',sans-serif;
  -webkit-font-smoothing: antialiased;
  height: 100vh;
  width: 100%;
}

#root{
  display: flex;
  flex-direction:column;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
}

 div.map {
    position: relative !important;
  }









button{
  cursor: pointer;
}

[disabled]{
  opacity: 0.6;
  cursor: not-allowed;
}

`;
