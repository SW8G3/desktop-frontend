import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.VITE_PORT || 3000,
  },
  define: {
    VITE_API_URL: JSON.stringify(process.env.VITE_API_URL),
    VITE_PORT: JSON.stringify(process.env.VITE_PORT),
  }
});
