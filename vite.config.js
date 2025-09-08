import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
  ],
  clearScreen: false,
  // Tauri应用需要使用相对路径
  base: './',
  server: {
    port: 5176,
    strictPort: true,
    host: '0.0.0.0',
    hmr: {
      port: 5177,
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // 说明：启用 top-level await 等现代特性
    // - Windows 仍定位到较新的 Chrome Runtime
    // - 非 Windows（macOS/Linux 的 WebView）使用 'esnext' 以支持 TLA
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'esnext',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', '@vueuse/core'],
          markdown: ['markdown-it', 'highlight.js'],
        },
      },
    },
  },
})
