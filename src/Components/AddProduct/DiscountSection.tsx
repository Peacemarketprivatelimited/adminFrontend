import React from "react";
import { FormState } from "../../types/AddProductTypes";

interface Props {
  form: FormState;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DiscountSection: React.FC<Props> = ({ form, handleChange, handleCheckboxChange }) => (
  <div className="bg-gray-800 p-4 rounded-md dark:bg-gray-800">
    <h3 className="text-lg font-medium mb-4 text-gray-200 dark:text-gray-200">Discount</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Regular Discount */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300">Regular Discount %</label>
        <input
          type="number"
          name="discount.regular.percentage"
          value={form.discount.regular.percentage}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-gray-100"
        />
      </div>
      <div className="flex items-center h-full pt-6">
        <input
          type="checkbox"
          name="discount.regular.active"
          checked={form.discount.regular.active}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-300">Active</label>
      </div>
      {/* Subscription Discount */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300">Subscription Discount %</label>
        <input
          type="number"
          name="discount.subscription.percentage"
          value={form.discount.subscription.percentage}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-gray-100"
        />
      </div>
      <div className="flex items-center h-full pt-6">
        <input
          type="checkbox"
          name="discount.subscription.active"
          checked={form.discount.subscription.active}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-300">Active</label>
      </div>
    </div>
  </div>
);

export default DiscountSection;