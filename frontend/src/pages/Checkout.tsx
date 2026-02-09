// src/pages/Checkout.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaWhatsapp, 
  FaPhone, 
  FaUser, 
  FaMapMarkerAlt, 
  FaArrowLeft, 
  FaLock, 
  FaCheckCircle, 
  FaBusinessTime, 
  FaQrcode,
  FaShoppingBag,
  FaRupeeSign,
  FaShippingFast,
  FaShieldAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

// Your WhatsApp Business number - UPDATE THIS!
const YOUR_WHATSAPP_NUMBER = '917994036951'; // Replace with your WhatsApp Business number
const BUSINESS_NAME = 'Manthrakodi Bridals';
const BUSINESS_ADDRESS = '1st Floor, Bengacheri Complex, Kanhangad';
const BUSINESS_PHONE = '7994036951';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    paymentMethod: 'cod',
    notes: '',
    preferredContact: 'whatsapp',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit phone number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter valid 6-digit pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MB${day}${month}${timestamp}${random}`;
  };

  const formatOrderForWhatsApp = (orderId: string) => {
    const orderDate = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const itemsList = items.map((item, index) => 
      `${index + 1}. *${item.product.name}*
   Qty: ${item.quantity} × ₹${item.product.price} = ₹${item.product.price * item.quantity}
   ${item.product.description?.substring(0, 50)}...`
    ).join('\n\n');

    const subtotal = total;
    const tax = total * 0.18;
    const shipping = 0;
    const grandTotal = subtotal + tax + shipping;

    return `🛍️ *${BUSINESS_NAME} - NEW ORDER*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 *ORDER ID:* ${orderId}
📅 *DATE & TIME:* ${orderDate}
🛒 *ITEMS:* ${items.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *CUSTOMER DETAILS*
• *Name:* ${formData.name}
• *Phone:* +91 ${formData.phone}
• *Email:* ${formData.email || 'Not provided'}
• *Address:* ${formData.address}
• *City:* ${formData.city}, ${formData.state}
• *Pincode:* ${formData.pincode}
• *Preferred Contact:* ${formData.preferredContact === 'whatsapp' ? 'WhatsApp 📱' : 'Phone Call 📞'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛒 *ORDER ITEMS*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 *BILLING SUMMARY*
• *Subtotal:* ₹${subtotal.toLocaleString()}
• *GST (18%):* ₹${tax.toLocaleString()}
• *Shipping:* ₹${shipping.toLocaleString()} (FREE 🚚)
• *────────────────────*
• *Grand Total:* ₹${grandTotal.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 *PAYMENT METHOD*
${formData.paymentMethod === 'cod' ? 'Cash on Delivery 💵' : 'Online Payment 💳'}

📝 *CUSTOMER NOTES*
${formData.notes || 'No additional notes'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 *QUICK CONTACT*
• WhatsApp: https://wa.me/91${formData.phone}
• Call: +91 ${formData.phone}
• Email: ${formData.email || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*🛍️ Order placed via ${BUSINESS_NAME} Website*
*⏰ Please confirm within 30 minutes*
*📍 ${BUSINESS_ADDRESS}*
`;
  };

  const formatCustomerConfirmation = (orderId: string) => {
    const subtotal = total;
    const tax = total * 0.18;
    const grandTotal = subtotal + tax;

    return `✅ *ORDER CONFIRMED - ${BUSINESS_NAME}*

Dear ${formData.name},

Thank you for your order! 🎉 Your bridal selection is being processed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 *ORDER DETAILS*
• *Order ID:* ${orderId}
• *Order Date:* ${new Date().toLocaleDateString('en-IN')}
• *Items:* ${items.length} bridal items
• *Total Amount:* ₹${grandTotal.toLocaleString()}
• *Payment Method:* ${formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
• *Shipping:* FREE across India 🚚

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 *ORDER PROCESSING*
1. ✅ Order Received
2. 🔄 Processing (1-2 hours)
3. 📦 Packing
4. 🚚 Shipping (1-3 business days)
5. 🎉 Delivery

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 *CONTACT & SUPPORT*
• *WhatsApp:* https://wa.me/91${BUSINESS_PHONE}
• *Phone:* +91 ${BUSINESS_PHONE}
• *Email:* info@manthrakodibridals.com
• *Address:* ${BUSINESS_ADDRESS}
• *Business Hours:* 10 AM - 8 PM (Mon-Sat)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *NEXT STEPS*
• We will contact you shortly to confirm details
• Keep your phone handy for delivery updates
• For queries, reply to this message

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Thank you for choosing ${BUSINESS_NAME}!*
*May your special day be filled with joy and beauty! 💐*`;
  };

  const sendOrderToWhatsAppBusiness = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);

      // 1. Send order to YOUR WhatsApp Business
      const orderMessage = formatOrderForWhatsApp(newOrderId);
      const encodedOrderMessage = encodeURIComponent(orderMessage);
      const whatsappBusinessURL = `https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${encodedOrderMessage}`;
      
      // Open in new tab
      window.open(whatsappBusinessURL, '_blank');

      // 2. Save order to database/localStorage
      await saveOrderToDatabase(newOrderId);

      // 3. Show success
      setTimeout(() => {
        clearCart();
        setOrderPlaced(true);
        toast.success(
          <div>
            <p className="font-semibold">Order sent to WhatsApp Business!</p>
            <p className="text-sm">Check your WhatsApp for order details</p>
          </div>,
          { duration: 5000 }
        );
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      toast.error(
        <div>
          <p className="font-semibold">Failed to place order</p>
          <p className="text-sm">Please try again or contact us directly</p>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  const saveOrderToDatabase = async (orderId: string) => {
    try {
      const orderData = {
        orderId,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          preferredContact: formData.preferredContact,
        },
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images[0],
          category: item.product.category,
          description: item.product.description,
        })),
        subtotal: total,
        tax: total * 0.18,
        shipping: 0,
        total: total * 1.18,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        status: 'pending',
        source: 'website',
        createdAt: new Date().toISOString(),
        whatsappSent: true,
        whatsappSentAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('manthrakodi_orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('manthrakodi_orders', JSON.stringify(existingOrders));

      // Also save to customer's orders
      const customerOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
      customerOrders.push({
        orderId,
        items: orderData.items,
        total: orderData.total,
        status: 'pending',
        date: orderData.createdAt,
      });
      localStorage.setItem('my_orders', JSON.stringify(customerOrders));

    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const sendCustomerConfirmation = () => {
    const customerPhone = formData.phone;
    const customerMessage = formatCustomerConfirmation(orderId);
    const encodedMessage = encodeURIComponent(customerMessage);
    const customerWhatsAppURL = `https://wa.me/91${customerPhone}?text=${encodedMessage}`;
    
    window.open(customerWhatsAppURL, '_blank');
    toast.success('Opening WhatsApp to send confirmation to customer');
  };

//   const openCustomerWhatsApp = () => {
//     const customerWhatsAppURL = `https://wa.me/91${formData.phone}`;
//     window.open(customerWhatsAppURL, '_blank');
//   };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingBag className="text-4xl text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add beautiful bridal items to your cart before checkout</p>
          <Link
            to="/products"
            className="inline-block bg-bridal-maroon hover:bg-bridal-maroon/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-green-100"
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-bridal-maroon to-purple-700 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <FaCheckCircle className="text-5xl text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-3 font-playfair">Order Placed Successfully!</h1>
              <p className="text-white/90 text-lg">
                Your order has been sent to our WhatsApp Business
              </p>
            </div>
          </div>

          <div className="p-8">
            {/* Order Details */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  #{orderId}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100"
                >
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="text-blue-600" /> Customer Info
                  </h3>
                  <p className="text-gray-800 font-medium">{formData.name}</p>
                  <p className="text-gray-600">+91 {formData.phone}</p>
                  <p className="text-gray-600">{formData.city}, {formData.state}</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-100"
                >
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaRupeeSign className="text-purple-600" /> Order Summary
                  </h3>
                  <p className="text-gray-800">{items.length} bridal items</p>
                  <p className="text-3xl font-bold text-bridal-maroon">
                    ₹{(total * 1.18).toLocaleString()}
                  </p>
                  <p className="text-gray-600">{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </motion.div>
              </div>
            </div>

            {/* WhatsApp Actions */}
            <div className="space-y-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
              >
                <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                  <FaBusinessTime /> Next Steps via WhatsApp Business
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <FaWhatsapp className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Step 1: Order Received</h4>
                      <p className="text-sm text-gray-600">
                        Order details sent to your WhatsApp Business number
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <FaPhone className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Step 2: Contact Customer</h4>
                      <p className="text-sm text-gray-600">
                        Confirm order details with customer via {formData.preferredContact}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <FaCheckCircle className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Step 3: Process Order</h4>
                      <p className="text-sm text-gray-600">
                        Pack and ship the order within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <button
                  onClick={sendCustomerConfirmation}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
                >
                  <FaWhatsapp size={24} />
                  Send Confirmation to Customer
                </button>
                
                <button
                  onClick={() => setShowQRCode(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
                >
                  <FaQrcode size={24} />
                  Show Customer QR Code
                </button>
              </motion.div>
            </div>

            {/* Continue Shopping */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border-t border-gray-100 pt-6"
            >
              <button
                onClick={() => navigate('/products')}
                className="w-full bg-gradient-to-r from-bridal-maroon to-purple-700 text-white py-4 rounded-xl font-bold text-lg hover:from-bridal-maroon/90 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl mb-4"
              >
                Continue Shopping for More Bridal Items
              </button>
              <p className="text-center text-gray-600">
                Need help? WhatsApp us: <a href={`https://wa.me/91${BUSINESS_PHONE}`} className="text-bridal-maroon font-semibold hover:underline">+91 {BUSINESS_PHONE}</a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* QR Code Modal */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-sm"
            >
              <h3 className="text-2xl font-bold mb-4 text-center">Customer WhatsApp QR</h3>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-green-300 mb-4">
                <div className="text-center mb-2">
                  <p className="font-semibold">Scan to message customer</p>
                  <p className="text-sm text-gray-600">WhatsApp: +91 {formData.phone}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-green-400 to-blue-500 mx-auto flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <FaQrcode className="text-6xl text-white/80 mx-auto mb-2" />
                      <p className="text-white text-sm font-semibold">WhatsApp QR Code</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    https://wa.me/91{formData.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQRCode(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-gray-600 hover:text-bridal-maroon mb-2"
          >
            <FaArrowLeft className="mr-2" /> Back to Cart
          </Link>
          <h1 className="text-5xl font-playfair font-bold text-center mb-4">Checkout</h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Complete your bridal purchase with secure checkout via WhatsApp Business
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-lg p-8 mb-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <FaUser className="text-blue-600 text-xl" />
                  </div>
                  Shipping Information
                </h2>
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="text-sm text-bridal-maroon hover:text-bridal-maroon/80"
                >
                  {showInstructions ? 'Hide Help' : 'Need Help?'}
                </button>
              </div>

              {showInstructions && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">📝 How to fill this form:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use your delivery address where you want to receive the order</li>
                    <li>• Double-check phone number for WhatsApp updates</li>
                    <li>• Add any special instructions in the notes section</li>
                    <li>• Your data is secure and private</li>
                  </ul>
                </div>
              )}

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-bridal-maroon focus:border-transparent transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-14 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-bridal-maroon focus:border-transparent transition-all ${
                          errors.phone ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="98765 43210"
                        maxLength={10}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bridal-maroon focus:border-transparent transition-all hover:border-gray-400"
                    placeholder="you@example.com"
                  />
                  <p className="text-sm text-gray-500 mt-2">For order updates and receipt</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-bridal-maroon focus:border-transparent transition-all resize-none ${
                      errors.address ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="House no, Building, Street, Area, Landmark"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-2">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-bridal-maroon focus:border-transparent transition-all ${
                        errors.city ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-2">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bridal-maroon focus:border-transparent transition-all hover:border-gray-400"
                    >
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Other">Other State</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-bridal-maroon focus:border-transparent transition-all ${
                        errors.pincode ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="600001"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-2">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                      formData.preferredContact === 'whatsapp' 
                        ? 'border-green-500 bg-green-50 shadow-sm' 
                        : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="preferredContact"
                        value="whatsapp"
                        checked={formData.preferredContact === 'whatsapp'}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-green-600"
                      />
                      <div className="ml-4">
                        <span className="font-medium flex items-center gap-2">
                          <FaWhatsapp className="text-green-600" /> WhatsApp
                        </span>
                        <p className="text-sm text-gray-600">Fast & convenient updates</p>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                      formData.preferredContact === 'call' 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="preferredContact"
                        value="call"
                        checked={formData.preferredContact === 'call'}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600"
                      />
                      <div className="ml-4">
                        <span className="font-medium flex items-center gap-2">
                          <FaPhone className="text-blue-600" /> Phone Call
                        </span>
                        <p className="text-sm text-gray-600">For urgent communication</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bridal-maroon focus:border-transparent transition-all resize-none hover:border-gray-400"
                    placeholder="Special instructions, gift wrapping requests, delivery timing preferences, etc."
                  />
                </div>
              </form>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <FaLock className="text-purple-600 text-xl" />
                </div>
                Payment Method
              </h2>

              <div className="space-y-4">
                <label className={`flex items-start p-6 border rounded-xl cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod' 
                    ? 'border-bridal-maroon bg-red-50' 
                    : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-bridal-maroon mt-1"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-lg">Cash on Delivery (COD)</span>
                        <p className="text-gray-600 mt-1">Pay when you receive your order</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Note:</strong> ₹500 advance via UPI may be required for high-value orders
                      </p>
                    </div>
                  </div>
                </label>

                <label className={`flex items-start p-6 border rounded-xl cursor-pointer transition-all ${
                  formData.paymentMethod === 'online' 
                    ? 'border-bridal-maroon bg-red-50' 
                    : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-bridal-maroon mt-1"
                  />
                  <div className="ml-4">
                    <span className="font-bold text-lg">Online Payment</span>
                    <p className="text-gray-600 mt-1">Pay now using UPI/Card/Net Banking</p>
                    <div className="mt-3">
                      <div className="flex gap-2">
                        <div className="bg-white p-2 rounded-lg border">
                          <span className="text-sm font-medium">UPI</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border">
                          <span className="text-sm font-medium">Cards</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border">
                          <span className="text-sm font-medium">Net Banking</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {formData.paymentMethod === 'online' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    <strong>For online payments:</strong> We will contact you on WhatsApp with payment details after order confirmation.
                  </p>
                </div>
              )}

              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FaShieldAlt className="text-green-600" /> Secure Checkout
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✅ Your payment information is secure</li>
                  <li>✅ WhatsApp Business for order tracking</li>
                  <li>✅ Free shipping across India</li>
                  <li>✅ Easy returns within 7 days</li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-6"
            >
              <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 text-lg">Items ({items.length})</h3>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="relative">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        {item.product.featured && (
                          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.product.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-bridal-maroon">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">₹{item.product.price} each</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">₹{(total * 0.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600 flex items-center gap-1">
                    <FaShippingFast /> FREE
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xl font-bold">
                  <span>Total Amount</span>
                  <span className="text-bridal-maroon text-2xl">
                    ₹{(total * 1.18).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* WhatsApp Order Button */}
              <button
                onClick={sendOrderToWhatsAppBusiness}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <FaWhatsapp size={28} />
                    Place Order via WhatsApp Business
                  </>
                )}
              </button>

              {/* WhatsApp Info */}
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 mb-6">
                <div className="flex items-start gap-4">
                  <FaWhatsapp className="text-green-600 text-2xl mt-1" />
                  <div>
                    <h4 className="font-bold text-green-800 mb-2">How WhatsApp Order Works:</h4>
                    <ul className="text-sm text-green-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                        <span>Order details sent to our WhatsApp Business</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                        <span>We confirm order and share payment details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                        <span>Free shipping across India in 3-7 days</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                        <span>Track order and updates via WhatsApp</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact & Security */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FaPhone className="text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Need help? Call us:</div>
                    <a
                      href={`tel:+91${BUSINESS_PHONE}`}
                      className="text-bridal-maroon font-bold hover:underline"
                    >
                      +91 {BUSINESS_PHONE}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-gray-600" />
                  <div className="text-sm text-gray-600">
                    Free shipping across India • 7-day returns
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500 pt-4 border-t">
                  <p>By placing your order, you agree to our Terms & Conditions</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;