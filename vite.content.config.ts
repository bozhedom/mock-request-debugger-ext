import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'src/content/content.ts'),
      output: {
        entryFileNames: 'content/content.js',
      },
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false,
    watch: {},
  },
});
