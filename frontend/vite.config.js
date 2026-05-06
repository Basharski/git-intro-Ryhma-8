import {defineConfig} from 'vite';
import injectHTML from 'vite-plugin-html-inject';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        login: './src/auth/login.html',
        home: './src/home/index.html',
        analysis: './src/analysis/index.html',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  plugins: [injectHTML()],
});
