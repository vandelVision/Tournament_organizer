import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Tournament_organizer/',
  plugins: [react(),tailwindcss()],
  server:{
    open:true
  }
})
