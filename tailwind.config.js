 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        /* =================================================
           BAZAA CORE THEME
           ================================================= */

        ink: '#1B1A2E',

        /* Page background */
        paper: '#F3EFE7',

        /* Card / surface */
        white: '#FFFFFF',
        surface: '#FFFFFF',
        surfaceSoft: '#FAF7F0',

        /* Primary brand / buttons */
        amber: '#D8891F',
        amberDeep: '#B96F16',
        amberSoft: '#FFF0D5',

        /* Borders */
        line: '#DDD6C9',

        /* Text */
        muted: '#6E6A63',
        mutedLight: '#8A857D',

        /* Success */
        green: '#2F7A4F',
        greenSoft: '#EAF5EE',

        /* Danger */
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
