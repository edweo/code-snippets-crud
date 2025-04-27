import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ... Specify options here.
    setupFiles: ['.env.test'],
    globals: true
  }
})
