/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B1A2E',
        paper: '#FBF9F5',
        amber: '#E8A33D',
        amberDeep: '#C77F1F',
        line: '#E4E0D6',
        muted: '#6E6A63',
        green: '#2F7A4F',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
};
