// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    server: {
        port: DUMMY_FRONT_PORT,
        hot: true,
    },
    build: {
        rollupOptions: {
            input: './index.html',
        },
    },
});
