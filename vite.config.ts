import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
<<<<<<< HEAD
    open: true,
	host: true
=======
    open: true
>>>>>>> c835a9d7d76a4a6c23fc717868e817a25770fa73
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})