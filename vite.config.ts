import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const repositoryName = env.GITHUB_REPOSITORY?.split('/')[1];
  const isGithubActions = env.GITHUB_ACTIONS === 'true';

  return {
    plugins: [react()],
    base: isGithubActions && repositoryName ? `/${repositoryName}/` : '/',
    test: {
      environment: 'jsdom',
      globals: true,
    },
  };
});
