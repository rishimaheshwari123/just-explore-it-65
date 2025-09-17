import React from 'react';
import { useParams } from 'react-router-dom';
import AddBusinessForm from '@/components/AddBusinessForm';

const EditBusiness: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AddBusinessForm mode="edit" businessId={id} />
  );
};

export default EditBusiness;