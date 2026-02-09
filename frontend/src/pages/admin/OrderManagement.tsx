// src/pages/admin/OrderManagement.tsx
import { useState } from 'react';
import { FaEye, FaPrint, FaCheck, FaTruck, FaBoxOpen } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Define Order type
interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

const OrderManagement = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/orders`);
      return response.data;
    },
  });

  const filteredOrders = orders?.filter((order: Order) => 
    filter === 'all' || order.status === filter
  ) || [];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}/status`, { status });
      // Refetch orders - you might want to invalidate queries here
      // queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Order Management</h2>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' 
                ? 'bg-bridal-maroon text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'processing' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setFilter('shipped')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'shipped' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Shipped
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'delivered' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'cancelled' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bridal-maroon mx-auto mb-4"></div>
            <p>Loading orders...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders&&filteredOrders.map((order: Order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">#{order.id.slice(0, 8)}</td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-gray-500 text-sm">{order.customer_phone}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 font-bold text-bridal-maroon">
                        ₹{order.total_amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {/* View order details */}}
                            className="text-blue-600 hover:text-blue-900 p-2"
                            title="View Details"
                          >
                            <FaEye size={18} />
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900 p-2"
                            title="Confirm Order"
                          >
                            <FaCheck size={18} />
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            className="text-purple-600 hover:text-purple-900 p-2"
                            title="Mark as Shipped"
                          >
                            <FaTruck size={18} />
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="text-indigo-600 hover:text-indigo-900 p-2"
                            title="Mark as Delivered"
                          >
                            <FaBoxOpen size={18} />
                          </button>
                          <button
                            onClick={() => {/* Print invoice */}}
                            className="text-gray-600 hover:text-gray-900 p-2"
                            title="Print Invoice"
                          >
                            <FaPrint size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders found.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold text-bridal-maroon mb-2">
            {orders?.filter((o: Order) => o.status === 'pending').length || 0}
          </div>
          <div className="text-gray-600">Pending Orders</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {orders?.filter((o: Order) => o.status === 'processing').length || 0}
          </div>
          <div className="text-gray-600">Processing</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {orders?.filter((o: Order) => o.status === 'shipped').length || 0}
          </div>
          <div className="text-gray-600">Shipped</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {orders?.filter((o: Order) => o.status === 'delivered').length || 0}
          </div>
          <div className="text-gray-600">Delivered</div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;