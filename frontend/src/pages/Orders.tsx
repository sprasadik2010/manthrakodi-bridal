// src/pages/Orders.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaHistory } from 'react-icons/fa';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('manthrakodi_orders') || '[]');
    // Sort by date (newest first)
    const sortedOrders = storedOrders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(sortedOrders);
    setLoading(false);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaHistory className="text-yellow-500" />;
      case 'confirmed': return <FaBox className="text-blue-500" />;
      case 'processing': return <FaBox className="text-purple-500" />;
      case 'shipped': return <FaShippingFast className="text-indigo-500" />;
      case 'delivered': return <FaCheckCircle className="text-green-500" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      default: return <FaHistory className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-700 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">Your order history will appear here</p>
          <Link
            to="/products"
            className="inline-block bg-bridal-maroon hover:bg-bridal-maroon/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-playfair font-bold mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.orderId} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(order.status)}
                    <h3 className="text-xl font-bold">Order #{order.orderId}</h3>
                  </div>
                  <p className="text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-bridal-maroon">
                      ₹{order.total.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <h4 className="font-semibold mb-4">Items ({order.items.length})</h4>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium">{item.name}</h5>
                      <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">₹{item.price.toLocaleString()} each</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Footer */}
            <div className="bg-gray-50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-2">Shipping Address</h5>
                  <p className="text-gray-600">
                    {order.customer.name}<br />
                    {order.customer.address}<br />
                    {order.customer.city}, {order.customer.state} - {order.customer.pincode}<br />
                    Phone: {order.customer.phone}
                  </p>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Order Summary</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (18%)</span>
                      <span>₹{order.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total</span>
                      <span>₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {order.notes && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-1">Customer Notes:</h5>
                  <p className="text-blue-700">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;