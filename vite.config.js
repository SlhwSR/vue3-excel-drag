import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vuejsx from "@vue/babel-plugin-jsx"
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@assets': resolve(__dirname, './src/assets')
    }
  },
  plugins: [vue(),vuejsx({})],
  esbuild:{
   jsxFactory:'h',
   jsxFragment:"Fragment",
   jsxInject:"import {h} from 'vue';"
  },
  server:{
    port:9527
  }
  
})
