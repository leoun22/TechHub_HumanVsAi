import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/TechHub_HumanVsAi/',   // 👈 repo name with slashes
})
