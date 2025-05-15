// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    server: {
        port: 5000,
        hot: true,
    },
    build: {
        rollupOptions: {
            input: './index.html',
        },
    },
    plugins: [
        tailwindcss(),
      ],
});
