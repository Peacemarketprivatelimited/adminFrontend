import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: string;
    permissions: string[];
  };
}

export const loginAdmin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/users/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const isAdminAuthenticated = (): boolean => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};