import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'popup.html'),
      output: {
        entryFileNames: 'popup/[name].js',
      },
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false,
    watch: {},
  },
});
