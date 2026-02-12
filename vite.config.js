import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
var repository = process.env.GITHUB_REPOSITORY;
var repositoryName = repository === null || repository === void 0 ? void 0 : repository.split('/')[1];
export default defineConfig({
    plugins: [react()],
    base: process.env.GITHUB_ACTIONS && repositoryName ? "/".concat(repositoryName, "/") : '/',
    test: {
        environment: 'jsdom',
        globals: true,
    },
});
