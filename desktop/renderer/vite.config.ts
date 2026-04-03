import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './', // Necesario para que Electron cargue correctamente desde file://
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@presentation': path.resolve(__dirname, './src/presentation'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 5173,
    open: false, // No abrir navegador automáticamente
    strictPort: true, // Fallar si el puerto está ocupado
    host: 'localhost', // Solo escuchar en localhost, no exponer a la red
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

