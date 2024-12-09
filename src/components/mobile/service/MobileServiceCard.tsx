import styled from 'styled-components';
import { SwipeableCard } from '@/components/mobile/common/SwipeableCard';

const Card = styled(SwipeableCard)`
  margin: ${({ theme }) => theme.spacing(2)};
  border-radius: 16px;
  overflow: hidden;
`;

const ServiceImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ServiceContent = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
`;

const ServiceActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(2)};
  border-top: 1px solid ${({ theme }) => theme.colors.background.default};
`;

interface MobileServiceCardProps {
  service: Service;
  onBook: (serviceId: string) => void;
  onShare: (serviceId: string) => void;
}

export const MobileServiceCard: React.FC<MobileServiceCardProps> = ({
  service,
  onBook,
  onShare
}) => {
  return (
    <Card onSwipe={(direction) => handleSwipe(direction, service.id)}>
      <ServiceImage src={service.image} alt={service.title} />
      <ServiceContent>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <ServiceRating rating={service.rating} />
        <ServicePrice price={service.price} />
      </ServiceContent>
      <ServiceActions>
        <Button 
          variant="outlined" 
          onClick={() => onShare(service.id)}
        >
          分享
        </Button>
        <Button 
          variant="contained" 
          onClick={() => onBook(service.id)}
        >
          立即预约
        </Button>
      </ServiceActions>
    </Card>
  );
}; 