// src/pages/Cart.tsx
// import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import useCartStore  from '../store/cartStore';

const Cart = () => {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some beautiful bridal items to your cart!</p>
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
      <h1 className="text-4xl font-playfair font-bold mb-8 text-center">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items&&items.map((item) => (
            <div key={item.product.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="text-xl font-semibold hover:text-bridal-maroon">
                        {item.product.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-gray-600 mt-2 line-clamp-2">{item.product.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-bridal-maroon">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{item.product.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between">
            <Link
              to="/products"
              className="text-bridal-maroon hover:text-bridal-maroon/80 font-semibold"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{(total * 0.18).toLocaleString()}</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-bridal-maroon">
                  ₹{(total * 1.18).toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-bridal-maroon hover:bg-bridal-maroon/90 text-white text-center py-3 rounded-lg font-semibold transition-colors mb-4"
            >
              Proceed to Checkout
            </Link>
            
            <p className="text-sm text-gray-500 text-center">
              Secure checkout · No login required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;