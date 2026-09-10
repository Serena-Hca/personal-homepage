import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 允许 localtunnel 公网隧道域名访问(仅开发模式生效)
    allowedHosts: ['.loca.lt'],
  },
});
