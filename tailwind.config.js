import type { Config } from 'tailwindcss'

const colors = require('tailwindcss/colors')

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nook': {
          50: '#EDF5FE',
          100: '#DBE9FD',
          200: '#B7D4FB',
          300: '#93BEF9',
          400: '#6FA9F7',
          500: '#4895EF', // Main color
          600: '#1B75E0',
          700: '#155AB0',
          800: '#0F4080',
          900: '#092650',
        },
      },
    }
  },
  plugins: [],
}

export default config 