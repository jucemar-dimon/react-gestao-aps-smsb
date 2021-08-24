import styled from 'styled-components';

export const Container = styled.header`
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
`;

export const Logo = styled.img`
  height: 4rem;
  margin: 0 1rem 0 0;
`;
export const Title = styled.h1`
  font-size: 1.1rem;
`;

export const TitleArea = styled.div`
  line-height: 1.5rem;
`;

export const Subtitle = styled.p`
  font-size: 0.9rem;
  font-weight: ${(props) => (props.bold ? 700 : 400)};
  font-style: ${(props) => (props.italic ? 'italic' : 'normal')};
`;
