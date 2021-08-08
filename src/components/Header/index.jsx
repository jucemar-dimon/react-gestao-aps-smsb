import React from 'react';

import {
  Container, Logo, Title, Subtitle, TitleArea,
} from './styles';
import logoImage from '../../assets/images/logo.png';

function Header() {
  return (
    <Container>
      <Logo src={logoImage} alt='Logotipo Biguaçu' />
      <TitleArea>
        <Title>Prefeitura Municipal de Biguaçu</Title>
        <Subtitle>Secretaria Municipal de Saúde</Subtitle>
        <Subtitle italic>Painel de Gestão da Atenção Primária</Subtitle>
      </TitleArea>
    </Container>
  );
}

export default Header;
