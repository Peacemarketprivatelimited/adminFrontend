
import { api } from "../data/api" 

export const getOrders= async ()=>{

    const response=await api.get('/orders/orders')
    console.log(response.data)
    return response.data


}