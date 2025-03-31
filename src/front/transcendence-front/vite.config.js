// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
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
