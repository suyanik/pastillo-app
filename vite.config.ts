import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Firebase ayrı chunk
            firebase: ['firebase/app', 'firebase/firestore'],
            // Recharts ayrı chunk
            charts: ['recharts'],
            // Vendor libs
            vendor: ['react', 'react-dom'],
            // Lucide icons
            icons: ['lucide-react']
          }
        }
      },
      chunkSizeWarningLimit: 600
    }
  };
});