import { api } from "../data/api"

export const getAllUsers=async () => {

    const response=await api.get('/admin/users');
    return response.data


}

export const getUsersPaginated = async (page: number, limit: number = 10) => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data; // Should include { users: [...], total: number }
}
export const deleteUser=async (id:string) => {
    const response=await api.delete(`/admin/users/${id}`);
    return response.data
}   