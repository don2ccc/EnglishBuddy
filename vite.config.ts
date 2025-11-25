import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // By default, Vite doesn't expose process.env. This shim allows
      // process.env.API_KEY to work as used in the existing code.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Expose the Base URL for API Proxy (useful for regions like China)
      'process.env.GEMINI_API_BASE_URL': JSON.stringify(env.GEMINI_API_BASE_URL),
    },
    server: {
      port: 3000,
    }
  };
});