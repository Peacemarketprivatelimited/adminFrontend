
import { api } from '../data/api'; // <-- use your shared axios instance

// const API_URL = 'http://localhost:5000/api/categories';

interface CategoryData {
    name: string;
    description?: string;
}

interface ApiResponse {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export const createCategory = async (categoryData: CategoryData): Promise<ApiResponse> => {
    try {
        const response = await api.post<ApiResponse>('/categories', categoryData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create category');
    }
};



export const getCategories = async () => {
    try {
      const response = await api.get<{ categories: any[] }>('/categories');
      // Map _id to id for frontend consistency
      return response.data.categories.map(cat => ({
        ...cat,
        id: cat.id || cat._id, // ensure id is present
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
};


export const deleteCategory = async (id: string): Promise<void> => {
    try {
        await api.delete(`/categories/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
};