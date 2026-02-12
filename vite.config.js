import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(function (_a) {
    var _b;
    var mode = _a.mode;
    var env = loadEnv(mode, '.', '');
    var repositoryName = (_b = env.GITHUB_REPOSITORY) === null || _b === void 0 ? void 0 : _b.split('/')[1];
    var isGithubActions = env.GITHUB_ACTIONS === 'true';
    return {
        plugins: [react()],
        base: isGithubActions && repositoryName ? "/".concat(repositoryName, "/") : '/',
        test: {
            environment: 'jsdom',
            globals: true,
        },
    };
});
