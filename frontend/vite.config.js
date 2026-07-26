import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '');
  
  // Extract API URL from env, fallback to default
  const apiUrl = env.VITE_API_URL || 'http://localhost:8000';
  
  // Remove /api suffix if present (since proxy already adds it)
  const target = apiUrl.replace(/\/api$/, '');
  
  console.log('Vite Config - Mode:', mode);
  console.log('Vite Config - API URL:', apiUrl);
  console.log('Vite Config - Proxy Target:', target);
  
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: target,
          changeOrigin: true,
          secure: false,
          // Optional: If your backend doesn't expect /api prefix
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  };
});