import React from 'react';
import { useParams } from 'react-router-dom';
import BusinessForm from '@/components/BusinessForm';

const EditBusiness: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <BusinessForm mode="edit" businessId={id} />
  );
};

export default EditBusiness;