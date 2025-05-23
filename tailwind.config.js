/** @type {import('tailwindcss').Config} */

import scrollbar from 'tailwind-scrollbar'

export default {
  content: ['./views/**/*.handlebars', './src/**/*.ts'],
  plugins: [
    scrollbar
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto-fill-320': 'repeat(auto-fill, minmax(320px, 1fr))',
        'auto-fit-320': 'repeat(auto-fit, minmax(320px, 1fr))'
      }
    }
  }
}
