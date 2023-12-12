import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteSvgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [react(), viteSvgr()],
  // base: './'
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  }
})
