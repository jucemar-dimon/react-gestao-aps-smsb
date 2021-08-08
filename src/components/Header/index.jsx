import React from 'react';

import { Container, Logo } from './styles';
import logoImage from '../../assets/images/logo.png';

function Header() {
  return (
    <Container>
      <Logo src={logoImage} alt='Logotipo Biguaçu' />
    </Container>
  );
}

export default Header;
