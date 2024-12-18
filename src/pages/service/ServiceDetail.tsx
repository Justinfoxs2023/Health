import { useEffect } from 'react';

import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { LoadingState } from '@/components/common/LoadingState';
import { fetchServiceDetail } from '@/store/slices/serviceSlice';

const ServiceContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
`;

const ServiceHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const ServiceContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing(3)};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ServiceInfo = styled.div`
  background: ${({ theme }) => theme.colors.background.paper};
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 12px;
`;

const BookingPanel = styled.div`
  background: ${({ theme }) => theme.colors.background.paper};
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 12px;
  position: sticky;
  top: ${({ theme }) => theme.spacing(3)};
`;

export const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const { currentService, loading } = useSelector((state: RootState) => state.service);

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchServiceDetail(serviceId));
    }
  }, [serviceId, dispatch]);

  if (loading) return <LoadingState />;

  return (
    <ServiceContainer>
      <ServiceHeader>
        <h1>{currentServicetitle}</h1>
        <ServiceBreadcrumb category={currentService?.category} title={currentService?.title} />
      </ServiceHeader>

      <ServiceContent>
        <ServiceInfo>
          <ServiceDescription description={currentService?.description} />
          <ServiceFeatures features={currentService?.features} />
          <ServiceProvider provider={currentService?.provider} />
          <ServiceReviews reviews={currentService?.reviews} />
        </ServiceInfo>

        <BookingPanel>
          <ServicePrice price={currentService?.price} discount={currentService?.discount} />
          <ServiceAvailability availability={currentService?.availability} />
          <BookingForm serviceId={serviceId} onSubmit={handleBooking} />
        </BookingPanel>
      </ServiceContent>
    </ServiceContainer>
  );
};
