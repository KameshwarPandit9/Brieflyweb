import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: resolve(root, 'popup.html'),
        sidepanel: resolve(root, 'sidepanel.html'),
        background: resolve(root, 'src/background/index.ts'),
        content: resolve(root, 'src/content/index.ts'),
      },
      output: { entryFileNames: '[name].js', chunkFileNames: 'chunks/[name]-[hash].js', assetFileNames: 'assets/[name]-[hash][extname]' },
    },
  },
  plugins: [react(), {
    name: 'copy-extension-manifest',
    closeBundle() { copyFileSync(resolve(root, 'manifest.json'), resolve(root, 'dist/manifest.json')); },
  }],
});
