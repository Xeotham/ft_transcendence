// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 5000, // Change the port to 5000
        hot: true,
    },
    build: {
        rollupOptions: {
            input: './index.html',
        },
    },
});
