import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import OfferingDetail from '../components/OfferingDetail';
import { SOLUTIONS_DATA, getSolutionBySlug } from '../data/solutions';

const SolutionDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const solution = slug ? getSolutionBySlug(slug) : undefined;

  if (!solution) {
    return <Navigate to="/solutions" replace />;
  }

  const related = SOLUTIONS_DATA.filter((s) => s.id !== solution.id).slice(0, 3);

  return (
    <OfferingDetail
      offering={solution}
      basePath="/solutions"
      back={{ path: '/solutions', label: 'All Solutions' }}
      related={related}
      relatedHeading="Other Solutions"
      image={solution.image}
    />
  );
};

export default SolutionDetail;
