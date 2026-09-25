/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211d',
        mist: '#f3f6f5',
        line: '#dfe7e3',
        brand: {
          50: '#edf9f6',
          100: '#d5f1e9',
          500: '#16856c',
          600: '#0f6c58',
          700: '#0f5749',
        },
        skybrand: '#3178c6',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 42, 34, .04), 0 12px 35px rgba(16, 42, 34, .06)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
