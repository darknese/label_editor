import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const proxyPaths = ['/api', '/auth', '/templates', '/files']; // добавляйте новые пути сюда

const proxy = Object.fromEntries(
  proxyPaths.map((path) => [
    path,
    {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (p: string) => p,
    },
  ])
);

export default defineConfig({
  plugins: [react()],
  server: {
    proxy,
  },
});
