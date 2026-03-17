import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = mode === 'development'

  return {
    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),

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

    optimizeDeps: {
      include: ['react-quill'],
    },

    css: {
      devSourcemap: true,
    },
  }
})