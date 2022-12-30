import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@assets': resolve(__dirname, './src/assets')
    }
  },
  plugins: [vue()],
  
})
