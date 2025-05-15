import { api } from "../data/api"

export const getAllUsers=async () => {

    const response=await api.get('/admin/users');
    return response.data


}

export const deleteUser=async (id:string) => {
    const response=await api.delete(`/admin/users/${id}`);
    return response.data
}   