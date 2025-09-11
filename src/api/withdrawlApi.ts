import { api } from "../data/api";

export const getAllWithdrawals = async () => {
  const response = await api.get('/admin/withdrawals');
  console.log('Data received from API:', response.data);
  return response.data;
};

export const approveWithdrawal = async (userId: string, requestedAt: string, adminNote?: string) => {
  const response = await api.put('/admin/withdrawals/approve', { userId, requestedAt, adminNote });
  return response.data;
};

export const rejectWithdrawal = async (userId: string, requestedAt: string, adminNote?: string) => {
  const response = await api.put('/admin/withdrawals/reject', { userId, requestedAt, adminNote });
  return response.data;
};