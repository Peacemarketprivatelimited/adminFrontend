import React, { useEffect, useState } from 'react';
import { addProduct } from '../api/productApi';
import { getCategories } from '../api/categoryApi';
import { Category, FormState } from '../types/AddProductTypes';
import BasicInfoSection from './AddProduct/BasicInfoSection';
import DiscountSection from './AddProduct/DiscountSection';
import StatusSection from './AddProduct/StatusSection';
import ImagesSection from './AddProduct/ImageSection';


const initialForm: FormState = {
  name: '',
  description: '',
  shortDescription: '',
  price: '',
  quantity: '',
  categoryId: '',
  subcategoryId: '',
  discount: {
    regular: {
      percentage: 0,
      active: false
    },
    subscription: {
      percentage: 0,
      active: false
    }
  },
  seo: {
    title: '',
    description: '',
    keywords: []
  },
  attributes: {
    color: '',
    size: '',
    material: ''
  },
  shipping: {
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    }
  },
  status: {
    active: true,
    featured: false,
    inStock: true
  }
};

interface AddProductFormProps {
  token: string;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ token: propToken }) => {


  const [form, setForm] = useState<FormState>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = propToken || localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response) {
          setCategories(response);
        } else {
          setCategories([]);
          setMessage('No categories found');
        }
      } catch (err: any) {
        setMessage(err.message || 'Failed to load categories');
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');

    if (nameParts.length === 1) {
      setForm(prev => ({ ...prev, [name]: value }));
    } else if (nameParts.length === 2) {
      setForm(prev => ({
        ...prev,
        [nameParts[0]]: {
          ...prev[nameParts[0] as keyof FormState] as Record<string, any>,
          [nameParts[1]]: value
        }
      }));
    } else if (nameParts.length === 3) {
      setForm(prev => ({
        ...prev,
        [nameParts[0]]: {
          ...prev[nameParts[0] as keyof FormState] as Record<string, any>,
          [nameParts[1]]: {
            ...(prev[nameParts[0] as keyof FormState] as Record<string, any>)[nameParts[1]],
            [nameParts[2]]: value
          }
        }
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const nameParts = name.split('.');

    if (nameParts.length === 2) {
      setForm(prev => ({
        ...prev,
        [nameParts[0]]: {
          ...prev[nameParts[0] as keyof FormState] as Record<string, any>,
          [nameParts[1]]: checked
        }
      }));
    } else if (nameParts.length === 3) {
      setForm(prev => ({
        ...prev,
        [nameParts[0]]: {
          ...prev[nameParts[0] as keyof FormState] as Record<string, any>,
          [nameParts[1]]: {
            ...(prev[nameParts[0] as keyof FormState] as Record<string, any>)[nameParts[1]],
            [nameParts[2]]: checked
          }
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();

      // Add basic fields
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('shortDescription', form.shortDescription);
      formData.append('price', form.price);
      formData.append('quantity', String(Number(form.quantity)));
      formData.append('categoryId', form.categoryId);

      // Add JSON fields
      formData.append('discount', JSON.stringify({
        regular: {
          percentage: form.discount.regular.percentage,
          active: form.discount.regular.active
        },
        subscription: {
          percentage: form.discount.subscription.percentage,
          active: form.discount.subscription.active
        }
      }));
      formData.append('seo', JSON.stringify(form.seo || {
        title: '',
        description: '',
        keywords: []
      }));

      formData.append('attributes', JSON.stringify(form.attributes || {
        color: '',
        size: '',
        material: ''
      }));

      formData.append('shipping', JSON.stringify(form.shipping || {
        weight: '',
        dimensions: {
          length: '',
          width: '',
          height: ''
        }
      }));

      formData.append('status', JSON.stringify(form.status || {
        active: true,
        featured: false,
        inStock: true
      }));

      // Add images
      if (images) {
        Array.from(images).forEach(file => {
          formData.append('images', file);
        });
      }

      await addProduct(formData, token);
      setMessage('Product added successfully!');
      setForm(initialForm);
      setImages(null);
    } catch (err: any) {
      setMessage(err.response?.data?.message || err.message || 'Failed to add product');
    }
    setLoading(false);
  };

  return (<div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg dark:bg-gray-900">
    <h2 className="text-2xl font-bold mb-6 text-gray-100 dark:text-gray-100">Add New Product</h2>
    {message && (
      <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'} dark:bg-opacity-80`}>
        {message}
      </div>
    )}
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoSection
        form={form}
        categories={categories}
        handleChange={handleChange}
      />
      <DiscountSection
        form={form}
        handleChange={handleChange}
        handleCheckboxChange={handleCheckboxChange}
      />
      <StatusSection
        form={form}
        handleCheckboxChange={handleCheckboxChange}
      />
      <ImagesSection setImages={setImages} />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 ${loading ? 'bg-blue-400' : 'bg-blue-700 hover:bg-blue-800'} shadow-lg`}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </div>
    </form>
  </div>
  );
};

export default AddProductForm;