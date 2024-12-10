import styled from 'styled-components';
import { FadeTransition } from '@/components/animation/FadeTransition';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing(3)};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ServiceTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const ServiceStatus = styled.div<{ status: 'available' | 'busy' | 'offline' }>`
  color: ${({ theme, status }) => {
    switch (status) {
      case 'available': return theme.colors.success.main;
      case 'busy': return theme.colors.warning.main;
      case 'offline': return theme.colors.error.main;
    }
  }};
`;

interface ServiceCardProps {
  title: string;
  description: string;
  status: 'available' | 'busy' | 'offline';
  onClick: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  status,
  onClick
}) => {
  return (
    <FadeTransition>
      <Card onClick={onClick}>
        <ServiceTitle>{title}</ServiceTitle>
        <ServiceDescription>{description}</ServiceDescription>
        <ServiceStatus status={status}>
          {status === 'available' && '可预约'}
          {status === 'busy' && '繁忙中'}
          {status === 'offline' && '暂停服务'}
        </ServiceStatus>
      </Card>
    </FadeTransition>
  );
}; 