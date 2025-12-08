import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // By default, Vite doesn't expose process.env. This shim allows
      // process.env.API_KEY to work as used in the existing code.
      // We use || '' to ensure it doesn't crash if the key is missing during build.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Expose the Base URL for API Proxy (useful for regions like China)
      'process.env.GEMINI_API_BASE_URL': JSON.stringify(env.GEMINI_API_BASE_URL || ''),
    },
    build: {
      outDir: 'dist',
      sourcemap: false, // Disable sourcemaps in production to save bandwidth
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Manual chunking to separate vendor code from app code for better caching
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['lucide-react'],
            genai: ['@google/genai'],
            pdf: ['html2canvas', 'jspdf']
          }
        }
      }
    },
    server: {
      port: 3000,
    }
  };
});