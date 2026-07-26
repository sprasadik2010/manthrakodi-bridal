// src/pages/AdminLogin.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface AdminLoginProps {
  onLoginSuccess?: () => void;
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // For demo purposes, using simple validation
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        localStorage.setItem('admin_token', 'demo_token');
        toast.success('Login successful!');
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate('/admin');
        }
      } else {
        toast.error('Invalid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-0" />

      {/* Login Card */}
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-bridal-lg border border-white/20 p-8 md:p-10 z-10 animate-fade-in relative">
        {/* Close Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
          aria-label="Close and return to home"
        >
          <FaTimes size={18} />
        </button>

        <div className="text-center mb-8">
          <span className="text-bridal-gold font-bold uppercase tracking-widest text-xs block mb-1">
            Secure Access
          </span>
          <h2 className="text-3xl font-playfair font-bold text-gray-900 leading-tight">
            MKB Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your inventory and orders
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FaUser size={16} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-bridal-maroon focus:border-transparent text-sm transition-all duration-200 bg-gray-50/50"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FaLock size={16} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-bridal-maroon focus:border-transparent text-sm transition-all duration-200 bg-gray-50/50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-bridal-maroon hover:bg-[#660000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bridal-maroon disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Verifying...
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;