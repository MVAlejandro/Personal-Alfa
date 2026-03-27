import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/rh/',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                staff: resolve(__dirname, 'staff.html'),
                attendance: resolve(__dirname, 'attendance.html'),
                uniforms: resolve(__dirname, 'uniforms.html'),
                permissions: resolve(__dirname, 'permissions.html')
            }
        },
    },
});
