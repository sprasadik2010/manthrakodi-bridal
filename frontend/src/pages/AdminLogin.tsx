<<<<<<< HEAD
=======
// src/pages/AdminLogin.tsx
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

<<<<<<< HEAD
interface AdminLoginProps {
  onLoginSuccess?: () => void;
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
=======
const AdminLogin = () => {
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // For demo purposes, using simple validation
<<<<<<< HEAD
=======
    // In production, make API call to backend
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        localStorage.setItem('admin_token', 'demo_token');
        toast.success('Login successful!');
<<<<<<< HEAD
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate('/admin');
        }
=======
        navigate('/admin');
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
      } else {
        toast.error('Invalid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-0" />

      {/* Login Card */}
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-bridal-lg border border-white/20 p-8 md:p-10 z-10 animate-fade-in">
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
=======
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the Manthrakodi Bridal admin panel
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
<<<<<<< HEAD
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
=======
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-bridal-maroon focus:border-bridal-maroon focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
<<<<<<< HEAD
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-bridal-maroon focus:border-transparent text-sm transition-all duration-200 bg-gray-50/50"
                  placeholder="Enter your password"
=======
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-bridal-maroon focus:border-bridal-maroon focus:z-10 sm:text-sm"
                  placeholder="Password"
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
<<<<<<< HEAD
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-bridal-maroon hover:bg-[#660000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bridal-maroon disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Verifying...
                </div>
              ) : (
                'Sign In to Dashboard'
=======
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-bridal-maroon hover:bg-bridal-maroon/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bridal-maroon disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
              )}
            </button>
          </div>

<<<<<<< HEAD
          <div className="bg-bridal-cream/45 border border-bridal-gold/20 p-3.5 rounded-xl text-center">
            <p className="text-xs text-bridal-maroon font-medium">
              Demo Credentials:
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Username: <strong className="font-mono text-gray-900">admin</strong> &nbsp;|&nbsp; Password: <strong className="font-mono text-gray-900">admin123</strong>
=======
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Demo credentials: admin / admin123
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;