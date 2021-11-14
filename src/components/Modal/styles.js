import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
`;

export const Container = styled.div`
  background: #ffffffee;
  height: 50%;
  width: 100%;
  position: absolute;
  bottom: ${(props) => (props.show ? '0%' : '-50%')};
  left: 0;
  z-index: 1;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding: 0 1rem 1rem;
  transition: bottom 1s;
`;
