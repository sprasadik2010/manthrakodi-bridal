// src/components/OrderTracker.tsx
import React from 'react';
import { FaBox, FaCheckCircle, FaShippingFast, FaHome } from 'react-icons/fa';

interface OrderTrackerProps {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  orderId: string;
  estimatedDelivery?: string;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ status, orderId, estimatedDelivery }) => {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: <FaBox /> },
    { key: 'confirmed', label: 'Confirmed', icon: <FaCheckCircle /> },
    { key: 'processing', label: 'Processing', icon: <FaCheckCircle /> },
    { key: 'shipped', label: 'Shipped', icon: <FaShippingFast /> },
    { key: 'delivered', label: 'Delivered', icon: <FaHome /> },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === status);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-6">Order #{orderId}</h3>
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-1 bg-green-500 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg
                ${index <= currentStepIndex 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
                ${index === currentStepIndex ? 'ring-4 ring-green-200' : ''}
              `}>
                {step.icon}
              </div>
              <span className="mt-2 text-sm font-medium text-center">
                {step.label}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {index === 0 && 'Order received'}
                {index === 1 && 'Payment verified'}
                {index === 2 && 'Preparing order'}
                {index === 3 && 'On the way'}
                {index === 4 && 'Delivered'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {estimatedDelivery && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">
            <span className="font-semibold">Estimated Delivery:</span> {estimatedDelivery}
          </p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">Need Help?</h4>
          <p className="text-gray-600 text-sm mb-2">
            Contact our customer support for any queries
          </p>
          <a href="tel:+919876543210" className="text-bridal-maroon font-semibold">
            +91 98765 43210
          </a>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">Track Shipping</h4>
          <p className="text-gray-600 text-sm mb-2">
            Use your tracking ID to check shipping status
          </p>
          <button className="text-bridal-maroon font-semibold">
            Track Package
          </button>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">Order Details</h4>
          <p className="text-gray-600 text-sm">
            View complete order details and download invoice
          </p>
          <button className="mt-2 text-bridal-maroon font-semibold">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};