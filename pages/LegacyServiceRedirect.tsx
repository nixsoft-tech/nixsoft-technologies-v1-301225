import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getServiceBySlugOrAlias } from '../data/services';

// Legacy /service/<slug> URLs now live under /services. Resolve the old slug
// (canonical or alias) to the current service and 301 there; unknown → /services.
const LegacyServiceRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlugOrAlias(slug) : undefined;
  return <Navigate to={service ? `/services/${service.slug}` : '/services'} replace />;
};

export default LegacyServiceRedirect;
