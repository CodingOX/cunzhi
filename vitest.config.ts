import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: [
      'src/frontend/**/*.spec.ts',
      'src/frontend/**/*.spec.tsx',
    ],
    deps: {
      inline: [
        '@tauri-apps/api',
      ],
    },
  },
})

