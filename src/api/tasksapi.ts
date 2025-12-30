
import { api } from '../data/api';

export interface Task {
  _id: string;
  title: string;
  description: string;
  platform: string;
  actionUrl: string;
  points: number;
  repeatable: boolean;
  maxPerUser: number;
  expiryDate?: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  platform?: string;
  actionUrl?: string;
  points: number;
  repeatable?: boolean;
  maxPerUser?: number;
  expiryDate?: string;
  isActive?: boolean;
}

export interface TasksAnalytics {
  totalTasks: number;
  activeTasks: number;
  totalSubmissions: number;
  totalPointsAwarded: number;
}

const tasksApi = {
  // Admin endpoints
  createTask: async (data: CreateTaskData) => {
    const response = await api.post('/admin/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<CreateTaskData>) => {
    const response = await api.put(`/admin/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await api.delete(`/admin/tasks/${id}`);
    return response.data;
  },

  adminListTasks: async () => {
    const response = await api.get('/admin/tasks');
    return response.data;
  },

  getTasksSummary: async () => {
    const response = await api.get('/admin/analytics/tasks-summary');
    return response.data;
  }
};

export default tasksApi;