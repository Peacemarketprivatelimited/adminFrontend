
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
      const response = await api.get<{ categories: ApiResponse[] }>('/categories');
      return response.data.categories;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  };