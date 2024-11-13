import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pen-and-paper/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
