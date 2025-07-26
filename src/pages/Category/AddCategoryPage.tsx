import React from 'react';
import CategoryForm from '../../Components/CategoryForm';
import DeleteCategory from '../../Components/DeleteCategory';

const AddCategoryPage: React.FC = () => {
  return (
    <div>
      <CategoryForm />
      <DeleteCategory/>
    </div>
  );
};

export default AddCategoryPage;