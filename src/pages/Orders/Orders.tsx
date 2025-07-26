import { useEffect, useState } from 'react'
import { getOrders } from '../../api/orderapi'
import { updateOrderStatus } from '../../api/orderapi'; // Import the function

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders() as { orders: any[] };
        setOrders(response.orders || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  
  const handleStatusChange = (orderId: string, newStatus: string) => {
    setStatusUpdate(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateStatus = async (orderId: string) => {
    const newStatus = statusUpdate[orderId];
    if (!newStatus) return;
    try {
      await updateOrderStatus(orderId, newStatus);
      // Optionally, refresh orders list
      setOrders(orders =>
        orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert('Order status updated!');
    } catch (err: any) {
      alert('Failed to update status: ' + (err.message || 'Unknown error'));
    }
  };

  if (loading) return <div className="p-8 text-center text-blue-300">Loading orders...</div>;
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-blue-400 drop-shadow text-center">All Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-400">No orders found.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-800 bg-gray-900">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Order Number</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Total</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Phone Number</th>
                {/* <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Order Person Name</th> */}
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {orders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-800 transition">
                  <td className="py-3 px-6">{order.orderNumber}</td>
                  <td className="py-3 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${order.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                        order.status === 'delivered' ? 'bg-green-900 text-green-300' :
                          order.status === 'cancelled' ? 'bg-red-900 text-red-300' :
                            'bg-blue-900 text-blue-300'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-bold text-blue-300">PKR {order.total}</td>
                  <td className="py-3 px-6">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-6">{order.phoneNumber}</td>
                  {/* <td className="py-3 px-6">{order.phoneNumber}</td> */}
                  <td className="py-3 px-6 ">
                    <button
                      className="bg-gradient-to-r from-blue-700 to-green-600 hover:from-blue-800 hover:to-green-700 text-white px-4 py-2 rounded-lg shadow font-semibold transition"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </button>
                    <select
                      className="mx-2 px-2 py-1 rounded bg-gray-800 text-blue-300 border border-blue-700"
                      value={statusUpdate[order._id] || order.status}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                    <button
                      className="bg-gradient-to-r mx-2 from-blue-700 to-green-600 hover:from-blue-800 hover:to-green-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                      onClick={() => handleUpdateStatus(order._id)}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for order details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border-2 border-blue-900 text-gray-200">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-blue-400 text-3xl font-bold"
              onClick={() => setSelectedOrder(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-blue-400">Order Details</h3>
            <div className="mb-3"><strong className="text-blue-300">Order Number:</strong> {selectedOrder.orderNumber}</div>
            <div className="mb-3"><strong className="text-blue-300">Status:</strong> {selectedOrder.status}</div>
            <div className="mb-3"><strong className="text-blue-300">Total:</strong> <span className="font-bold text-green-400">PKR {selectedOrder.total}</span></div>
            <div className="mb-3"><strong className="text-blue-300">Shipping Address:</strong> {selectedOrder.shippingAddress}</div>
            <div className="mb-3"><strong className="text-blue-300">Billing Address:</strong> {selectedOrder.billingAddress?.address}</div>
            <div className="mb-3"><strong className="text-blue-300">Payment Method:</strong> {selectedOrder.payment?.method}</div>
            <div className="mb-3"><strong className="text-blue-300">Notes:</strong> {selectedOrder.notes || '-'}</div>
            <div className="mb-3"><strong className="text-blue-300">Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
            <div className="mb-3"><strong className="text-blue-300">Items:</strong>
              <ul className="list-disc ml-6">
                {selectedOrder.items.map((item: any, idx: number) => (
                  <li key={idx} className="mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product?.image?.url}
                        alt={item.product?.image?.alt}
                        className="w-16 h-16 object-cover rounded-lg border border-blue-900 shadow"
                      />
                      <div>
                        <div className="font-semibold text-lg text-gray-100">{item.product?.name}</div>
                        <div className="text-gray-400 text-sm">Qty: {item.quantity}</div>
                        <div className="text-gray-300 text-sm">
                          Price: <span className="font-bold text-blue-300">PKR {item.price}</span>
                          {item.discount > 0 && (
                            <span className="ml-2 text-green-400 text-xs">(Discount: PKR {item.discount})</span>
                          )}
                        </div>
                        <div className="text-gray-500 text-xs">Subtotal: PKR {item.totalPrice}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;