export const healthAnimations = {
  fadeIn: keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `,
  
  slideIn: keyframes`
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  `,
  
  pulse: keyframes`
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  `
};

export const animatedComponents = {
  card: styled.div`
    animation: ${fadeIn} 0.3s ease-in-out;
  `,
  
  sidebar: styled.div`
    animation: ${slideIn} 0.3s ease-in-out;
  `,
  
  button: styled.button`
    &:hover {
      animation: ${pulse} 0.3s ease-in-out;
    }
  `
}; 