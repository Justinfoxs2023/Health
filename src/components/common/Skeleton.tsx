import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonBase = styled.div<{ height: string; width: string }>`
  height: ${props => props.height};
  width: ${props => props.width};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.background.paper} 25%,
    ${({ theme }) => theme.colors.background.default} 37%,
    ${({ theme }) => theme.colors.background.paper} 63%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
  border-radius: 4px;
`;

interface SkeletonProps {
  type?: 'text' | 'avatar' | 'button' | 'card';
  height?: string;
  width?: string;
  repeat?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  type = 'text',
  height = '20px',
  width = '100%',
  repeat = 1
}) => {
  const skeletons = Array(repeat).fill(null);

  return (
    <>
      {skeletons.map((_, index) => (
        <SkeletonBase
          key={index}
          height={height}
          width={width}
          style={{ marginBottom: index < repeat - 1 ? '8px' : 0 }}
        />
      ))}
    </>
  );
}; 