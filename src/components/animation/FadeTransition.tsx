import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const FadeTransition = styled.div<{ delay?: number }>`
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: ${({ delay = 0 }) => delay}ms;
  animation-fill-mode: both;
`; 