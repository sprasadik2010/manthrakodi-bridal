// src/pages/admin/DashboardHome.tsx
import { FaBox, FaShoppingCart, FaRupeeSign, FaUsers } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LineChart, Line, /*BarChart, Bar,*/ XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardHome = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/analytics/dashboard-stats');
      return response.data;
    },
  });

  const { data: salesData } = useQuery({
    queryKey: ['sales-analytics'],
    queryFn: async () => {
      const response = await axios.get('/api/analytics/sales-analytics?period=week');
      return response.data;
    },
  });

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.total_products || 0,
      icon: <FaBox className="text-2xl" />,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: <FaShoppingCart className="text-2xl" />,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.total_revenue || 0).toLocaleString()}`,
      icon: <FaRupeeSign className="text-2xl" />,
      color: 'bg-purple-500',
      change: '+15%',
    },
    {
      title: 'Today\'s Orders',
      value: stats?.today_orders || 0,
      icon: <FaUsers className="text-2xl" />,
      color: 'bg-yellow-500',
      change: '+5%',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-bridal-maroon to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="opacity-90">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-2">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-green-600 text-sm mt-2">{stat.change} from last week</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-6">Sales Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData?.sales_data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#800000" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#D4AF37" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-6">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '#ORD-001', customer: 'Priya Sharma', amount: '₹45,999', status: 'Delivered' },
                  { id: '#ORD-002', customer: 'Anjali Reddy', amount: '₹32,500', status: 'Processing' },
                  { id: '#ORD-003', customer: 'Meera Patel', amount: '₹67,800', status: 'Shipped' },
                  { id: '#ORD-004', customer: 'Sonia Verma', amount: '₹28,450', status: 'Pending' },
                  { id: '#ORD-005', customer: 'Ritu Singh', amount: '₹53,200', status: 'Delivered' },
                ].map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              Add New Product
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              View Recent Orders
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              Update Inventory
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-4">Low Stock Alert</h3>
          <div className="space-y-3">
            {stats?.low_stock_products > 0 ? (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="font-medium text-red-800">{stats.low_stock_products} products low in stock</p>
                <p className="text-sm text-red-600 mt-1">Check inventory immediately</p>
              </div>
            ) : (
              <p className="text-green-600">All products are well stocked</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-4">Store Performance</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Conversion Rate</span>
              <span className="font-bold">4.8%</span>
            </div>
            <div className="flex justify-between">
              <span>Avg. Order Value</span>
              <span className="font-bold">₹42,500</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Satisfaction</span>
              <span className="font-bold">98%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;