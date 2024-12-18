import styled from 'styled-components';

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.primary.light};
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingState: React.FC<{ message?: string }> = ({ message = '加载中...' }) => {
  return (
    <LoadingWrapper>
      <Spinner />
      <span>{message}</span>
    </LoadingWrapper>
  );
};
