// src/App.tsx
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SEO from './components/SEO';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

<<<<<<< HEAD
function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="w-full min-h-screen bg-bridal-cream overflow-x-hidden">
      {/* Fixed Navbar - Hidden on Admin routes */}
      {!isAdminPath && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
      )}
      
      {/* Add padding-top to main content to account for fixed navbar height, unless on Admin routes */}
      <main className={`w-full max-w-[100vw] overflow-hidden ${isAdminPath ? 'pt-0' : 'pt-20'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/*" element={
            <ErrorBoundary>
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </ErrorBoundary>
          } />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#800000',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

=======
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <SEO />
<<<<<<< HEAD
          <AppContent />
=======
          {/* ADD THIS DIV - it fixes overflow issues */}
          <div className="w-full min-h-screen bg-bridal-cream overflow-x-hidden">
            {/* Fixed Navbar */}
            <div className="fixed top-0 left-0 right-0 z-50">
              <Navbar />
            </div>
            
            {/* Add padding-top to main content to account for fixed navbar height */}
            <main className="w-full max-w-[100vw] overflow-hidden pt-20"> {/* Adjust pt-20 based on your navbar height */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/*" element={
                  <ErrorBoundary>
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
              </Routes>
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#800000',
                  color: '#fff',
                },
              }}
            />
          </div>
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;