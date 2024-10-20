import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // URL ของ API
        changeOrigin: true, // เปลี่ยนที่อยู่ต้นทาง
        secure: false, // ถ้าเป็น HTTPS สามารถเปลี่ยนเป็น true
      },
    },
  },
});
