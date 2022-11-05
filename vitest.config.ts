import { defineConfig } from 'vite'
import { alias } from './alias'

export default defineConfig({
  root: '.',
  esbuild: {
    tsconfigRaw: '{}'
  },
  resolve: {
    alias
  },

  test: {
    globals: true,
    deps: {
      inline: [/nuxt/, /@pinia/]
    },
    setupFiles: ['.nuxt/imports.d.ts']
  }
})
