
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
// NEW: Deliver order and credit wallet
export const deliverAndCreditWallet = async (orderId: string) => {
  const response = await api.post(`/admin/orders/${orderId}/deliver-and-credit`);
  return response.data;
};