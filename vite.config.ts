// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';

  return {
    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        
        // Alias direto para o CSS do Quill (resolve o ENOENT/PostCSS)
        'react-quill/dist/quill.snow.css': path.resolve(
          __dirname,
          'node_modules/react-quill/dist/quill.snow.css'
        ),
      },
    },

    server: {
      proxy: {
        '/api': {
          target: isDev ? 'http://localhost:3000' : env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        '/Api': {
          target: 'https://www.rcccuritiba.online',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // Ajuda o Vite a pré-bundlear o Quill
    optimizeDeps: {
      include: ['react-quill'],
    },

    // Desativa sourcemap em dev se estiver causando lentidão (opcional)
    css: {
      devSourcemap: true,
    },
  };
});