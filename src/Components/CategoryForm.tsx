import React, { useState } from 'react';
import { createCategory } from '../api/categoryApi';

const CategoryForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const categoryData = {
        name,
        description,
        discount,
        featured,
        active,
        order,
      };

       await createCategory(categoryData);
      setSuccess('Category created successfully!');
      // Reset form fields
      setName('');
      setDescription('');
      setDiscount('');
      setFeatured(false);
      setActive(true);
      setOrder(0);
    } catch (err) {
      setError('Failed to create category. Please try again.');
    }
  };

  // ...existing code...
  return (
    <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg dark:bg-gray-900">
      <h2 className="text-2xl font-bold text-gray-100 mb-6 dark:text-gray-100">Add New Category</h2>
      
      {error && (
        <div className="bg-red-900 text-red-300 px-4 py-3 rounded mb-4 border border-red-700 dark:bg-opacity-80">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900 text-green-300 px-4 py-3 rounded mb-4 border border-green-700 dark:bg-opacity-80">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1 dark:text-gray-300">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1 dark:text-gray-300">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-300 mb-1 dark:text-gray-300">Discount</label>
          <input
            id="discount"
            type="text"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        
        <div className="flex space-x-6">
          <div className="flex items-center">
            <input
              id="featured"
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-700 rounded dark:bg-gray-800"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-300 dark:text-gray-300">Featured</label>
          </div>
          
          <div className="flex items-center">
            <input
              id="active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-700 rounded dark:bg-gray-800"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-300 dark:text-gray-300">Active</label>
          </div>
        </div>
        
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-1 dark:text-gray-300">Order</label>
          <input
            id="order"
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-32 px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
// ...existing code...
};

export default CategoryForm;