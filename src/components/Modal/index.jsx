import React from 'react';
import { FaWindowClose } from 'react-icons/fa';

import { Container, Header } from './styles';

function Modal(props) {
  const { isOpen, data, handleCloseModal } = props;
  return (
    <Container show={false}>
      <Header>
        <h3>{data.feature && data.feature.nomeEstabelecimento}</h3>
        <FaWindowClose size='1rem' onClick={handleCloseModal} />
      </Header>
    </Container>
  );
}

export default Modal;
