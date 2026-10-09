import { copyFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/*
  Second build: the site's components as a library (src/kit), written to
  dist-kit/. The site build (vite.config.js) is untouched by this.
*/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      // The types are hand-written; ship them beside the bundle.
      name: 'copy-kit-types',
      closeBundle() {
        copyFileSync('src/kit/index.d.ts', 'dist-kit/index.d.ts')
      },
    },
  ],
  publicDir: false,
  build: {
    outDir: 'dist-kit',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/kit/index.js',
      formats: ['es'],
      fileName: () => 'index.es.js',
      cssFileName: 'kit',
    },
    rollupOptions: {
      // The host page supplies React; everything else travels in the bundle.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
})
