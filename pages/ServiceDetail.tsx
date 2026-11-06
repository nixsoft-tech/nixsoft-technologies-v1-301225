import React from 'react';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import OfferingDetail from '../components/OfferingDetail';
import { SERVICES_DATA, getServiceBySlug, getServiceImage, getServiceImageAlt } from '../data/services';

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return <NotFound />;
  }

  // Related: other services in the same category first, then fill to 3.
  const sameCategory = SERVICES_DATA.filter(
    (s) => s.id !== service.id && s.category === service.category
  );
  const others = SERVICES_DATA.filter(
    (s) => s.id !== service.id && s.category !== service.category
  );
  const related = [...sameCategory, ...others].slice(0, 3);

  return (
    <OfferingDetail
      offering={service}
      basePath="/services"
      back={{ path: '/services', label: 'All Services' }}
      related={related}
      relatedHeading="Related Services"
      image={getServiceImage(service)}
      imageAlt={getServiceImageAlt(service)}
    />
  );
};

export default ServiceDetail;
