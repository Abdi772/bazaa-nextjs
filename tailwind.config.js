 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        ink: '#1B1A2E',
        paper: '#FBF9F5',
        white: '#FFFFFF',

        amber: '#E8A33D',
        amberDeep: '#C77F1F',
        amberSoft: '#FFF5E3',

        line: '#E4E0D6',

        muted: '#6E6A63',
        mutedLight: '#8A857D',

        green: '#2F7A4F',
        greenSoft: '#EAF5EE',

        danger: '#B94A48',
        dangerSoft: '#FBEDEC',
      },

      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        bazaa: '14px',
        card: '16px',
      },

      boxShadow: {
        card: '0 2px 10px rgba(27, 26, 46, 0.05)',
        soft: '0 8px 24px rgba(27, 26, 46, 0.08)',
      },
    },
  },

  plugins: [],
};
