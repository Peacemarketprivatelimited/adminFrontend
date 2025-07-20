
import { api } from "../data/api" 

export const getOrders= async ()=>{

    const response=await api.get('/orders/orders')
    console.log(response.data)
    return response.data


}
export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await api.put(`/orders/orders/${orderId}/status`, { status });
  return response.data;
};