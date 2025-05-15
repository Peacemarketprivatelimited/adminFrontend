import React from "react";
import { Category, FormState } from "../../types/AddProductTypes";

interface Props {
  form: FormState;
  categories: Category[];
  handleChange: (e: React.ChangeEvent<any>) => void;
}

const BasicInfoSection: React.FC<Props> = ({ form, categories, handleChange }) => (
  <div className="bg-gray-800 p-4 rounded-md dark:bg-gray-800">
    <h3 className="text-lg font-medium mb-4 text-gray-200 dark:text-gray-200">Basic Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300">Product Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-gray-100"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300">Category</label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-gray-100"
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat._id || cat['*id'] || ''}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300">Short Description</label>
        <input
          type="text"
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-gray-100"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300">Full Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-gray-100"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300">Price</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-gray-100"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-gray-100"
        />
      </div>
    </div>
  </div>
);

export default BasicInfoSection;