import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   // port: 80,
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8800',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace('/^\/api/', '')
  //     }
  //   }
  // }
})
