import React from 'react';

import { Container } from './styles';

function Footer() {
  return (
    <Container>
      <span>
        Desenvolvido por
        <strong>Jucemar Dimon</strong>
      </span>
      <span className='version'>Versão 0.1</span>
    </Container>
  );
}

export default Footer;
