import { useEffect, useState } from 'react'
import { getOrders, updateOrderStatus, deliverAndCreditWallet } from '../../api/orderapi';

const Orders = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<{ [key: string]: string }>({});
  const [creditingOrder, setCreditingOrder] = useState<string | null>(null);

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setStatusUpdate(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateStatus = async (orderId: string) => {
    const newStatus = statusUpdate[orderId];
    if (!newStatus) return;
    try {
      await updateOrderStatus(orderId, newStatus);
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

  // NEW: Handle Deliver & Credit Wallet
  const handleDeliverAndCredit = async (orderId: string) => {
    if (!confirm('Mark this order as delivered and credit wallet?')) return;
    
    setCreditingOrder(orderId);
    try {
      const response = await deliverAndCreditWallet(orderId) as { message?: string };
      
      // Update local state
      setOrders(orders =>
        orders.map(order =>
          order._1d === orderId
            ? {
                ...order,
                status: 'delivered',
                walletCredit: {
                  ...order.walletCredit,
                  credited: true,
                  creditedAt: new Date()
                }
              }
            : order
        )
      );
      
      alert(response.message || 'Order delivered and wallet credited!');
    } catch (err: any) {
      alert('Failed: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    } finally {
      setCreditingOrder(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-blue-300">Loading orders...</div>;
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-blue-400 drop-shadow text-center">All Orders</h1>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by Order # or Phone"
          className="px-4 py-2 rounded-lg bg-gray-800 border border-blue-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-blue-700 text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          {searchQuery || statusFilter !== 'all' ? 'No orders match your search criteria.' : 'No orders found.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-800 bg-gray-900">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Order Number</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Total</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Wallet Credit</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Phone Number</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {filteredOrders.map((order: any) => (
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
                  
                  {/* NEW: Wallet Credit Column */}
                  <td className="py-3 px-6">
                    {order.walletCredit && order.walletCredit.amount > 0 ? (
                      <div className="flex flex-col">
                        <span className="font-bold text-green-400">
                          PKR {order.walletCredit.amount}
                        </span>
                        <span className={`text-xs ${order.walletCredit.credited ? 'text-green-500' : 'text-yellow-500'}`}>
                          {order.walletCredit.credited ? '✓ Credited' : '⏳ Pending'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No credit</span>
                    )}
                  </td>

                  <td className="py-3 px-6">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-6">{order.phoneNumber}</td>
                  <td className="py-3 px-6">
                    <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
                      <button
                        className="bg-gradient-to-r from-blue-700 to-green-600 hover:from-blue-800 hover:to-green-700 text-white px-4 py-2 rounded-lg shadow font-semibold transition text-sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </button>
                      <div className="flex gap-2 items-center flex-wrap">
                        <select
                          className="px-2 py-1 rounded bg-gray-800 text-blue-300 border border-blue-700 text-sm"
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
                          className="bg-gradient-to-r from-blue-700 to-green-600 hover:from-blue-800 hover:to-green-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition text-sm"
                          onClick={() => handleUpdateStatus(order._id)}
                        >
                          Update
                        </button>
                        
                        {/* NEW: Deliver & Credit Button */}
                        {order.walletCredit && order.walletCredit.amount > 0 && !order.walletCredit.credited && (
                          <button
                            className="bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDeliverAndCredit(order._id)}
                            disabled={creditingOrder === order._id}
                          >
                            {creditingOrder === order._id ? 'Processing...' : '✓ Deliver & Credit'}
                          </button>
                        )}
                      </div>
                    </div>
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
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative border-2 border-blue-900 text-gray-200 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-blue-400 text-3xl font-bold"
              onClick={() => setSelectedOrder(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-blue-400">Order Details</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div><strong className="text-blue-300">Order Number:</strong> {selectedOrder.orderNumber}</div>
              <div><strong className="text-blue-300">Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold
                  ${selectedOrder.status === 'delivered' ? 'bg-green-900 text-green-300' :
                    selectedOrder.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-blue-900 text-blue-300'}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div><strong className="text-blue-300">Subtotal:</strong> <span className="font-bold text-green-400">PKR {selectedOrder.subtotal}</span></div>
              <div><strong className="text-blue-300">Shipping:</strong> PKR {selectedOrder.shipping}</div>
              <div><strong className="text-blue-300">Tax:</strong> PKR {selectedOrder.tax || 0}</div>
              <div><strong className="text-blue-300">Total:</strong> <span className="font-bold text-green-400">PKR {selectedOrder.total}</span></div>
            </div>

            {/* Wallet Credit Info */}
            {selectedOrder.walletCredit && selectedOrder.walletCredit.amount > 0 && (
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-700 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-bold text-blue-300 mb-2">💰 Wallet Credit</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Amount:</strong> PKR {selectedOrder.walletCredit.amount}</div>
                  <div><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold
                      ${selectedOrder.walletCredit.credited ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                      {selectedOrder.walletCredit.credited ? '✓ Credited' : '⏳ Pending'}
                    </span>
                  </div>
                  {selectedOrder.walletCredit.creditedAt && (
                    <div className="col-span-2"><strong>Credited At:</strong> {new Date(selectedOrder.walletCredit.creditedAt).toLocaleString()}</div>
                  )}
                </div>
              </div>
            )}

            <div className="mb-3"><strong className="text-blue-300">Shipping Address:</strong> {selectedOrder.shippingAddress}</div>
            <div className="mb-3"><strong className="text-blue-300">Billing Address:</strong> {selectedOrder.billingAddress?.address}</div>
            <div className="mb-3"><strong className="text-blue-300">Payment Method:</strong> {selectedOrder.payment?.method}</div>
            <div className="mb-3"><strong className="text-blue-300">Phone:</strong> {selectedOrder.phoneNumber}</div>
            <div className="mb-3"><strong className="text-blue-300">Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
            
            <div className="mb-3"><strong className="text-blue-300">Items:</strong>
              <ul className="mt-2 space-y-3">
                {selectedOrder.items.map((item: any, idx: number) => (
                  <li key={idx} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-gray-100">{item.name}</div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mt-2">
                          <div>Qty: {item.quantity}</div>
                          <div>Actual Price: PKR {item.actualPrice}</div>
                          <div>Discounted: PKR {item.discountedPrice}</div>
                          <div className="text-green-400">Discount: PKR {item.discount}</div>
                        </div>
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