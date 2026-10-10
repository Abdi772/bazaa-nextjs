/** @type {import('tailwindcss').Config} */

/* Theme-aware colors read their RGB channels from CSS variables
   (defined in app/globals.css), so every utility such as bg-surface,
   text-fg or border-line follows light/dark automatically and still
   supports opacity, e.g. bg-surface/95. */
const v = (name) => `rgb(var(--rgb-${name}) / <alpha-value>)`;

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        /* ---- Fixed brand colors (same in light and dark) ---- */
        ink: '#1B1A2E',      // deep navy: header, hero, dark panels
        paper: '#F3EFE7',    // warm cream: text on dark panels
        white: '#FFFFFF',
        amber: '#D8891F',    // primary brand
        amberDeep: '#B96F16',// hover state for amber buttons
        green: '#2F7A4F',
        danger: '#B94A48',
        whatsapp: '#15803D', // WhatsApp buttons (white text: 5:1 contrast)

        /* ---- Theme-aware colors ---- */
        fg: v('fg'),                 // main text
        muted: v('muted'),           // secondary text
        mutedLight: v('muted-light'),
        surface: v('surface'),       // cards
        surfaceSoft: v('surface-soft'),
        panel: v('panel'),           // inset panels inside cards
        line: v('line'),             // borders / dividers
        inverse: v('inverse'),       // solid chip/avatar background (navy in light, cream in dark)
        onInverse: v('on-inverse'),  // text on inverse

        amberSoft: v('amber-soft'),
        amberText: v('amber-text'),  // amber used as readable text
        greenSoft: v('green-soft'),
        greenText: v('green-text'),
        dangerSoft: v('danger-soft'),
        dangerText: v('danger-text'),
      },

      fontFamily: {
        serif: ['var(--font-display)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        bazaa: '14px',
        card: '16px',
      },

      boxShadow: {
        card: 'var(--bazaa-shadow-sm)',
        soft: 'var(--bazaa-shadow-md)',
      },
    },
  },

  plugins: [],
};
