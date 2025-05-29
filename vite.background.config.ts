import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'src/background/background.ts'),
      output: {
        entryFileNames: 'background/background.js',
      },
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false,
    watch: {},
  },
});
