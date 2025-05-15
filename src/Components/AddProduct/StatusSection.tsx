import React from "react";
import { FormState } from "../../types/AddProductTypes";

interface Props {
  form: FormState;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StatusSection: React.FC<Props> = ({ form, handleCheckboxChange }) => (
  <div className="bg-gray-800 p-4 rounded-md dark:bg-gray-800">
    <h3 className="text-lg font-medium mb-4 text-gray-200 dark:text-gray-200">Status</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          name="status.active"
          checked={form.status?.active ?? true}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-700 rounded dark:bg-gray-900"
        />
        <label className="ml-2 block text-sm text-gray-300 dark:text-gray-300">Active</label>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="status.featured"
          checked={form.status?.featured ?? false}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-700 rounded dark:bg-gray-900"
        />
        <label className="ml-2 block text-sm text-gray-300 dark:text-gray-300">Featured</label>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="status.inStock"
          checked={form.status?.inStock ?? true}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-700 rounded dark:bg-gray-900"
        />
        <label className="ml-2 block text-sm text-gray-300 dark:text-gray-300">In Stock</label>
      </div>
    </div>
  </div>
);

export default StatusSection;