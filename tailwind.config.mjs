/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Exact custom palette requested in specification
        soft_mint: '#ADED92',
        neon_green: '#46EC67',
        aqua_cyan: '#12EDAB',
        deep_ocean: '#1E7D94',
        // Kebab-case aliases
        'soft-mint': '#ADED92',
        'neon-green': '#46EC67',
        'aqua-cyan': '#12EDAB',
        'deep-ocean': '#1E7D94',
        // Board & paper themes
        paper: {
          light: '#FDFBF7',
          warm: '#F7F4EB',
          dark: '#0F172A',
          blackboard: '#111827',
        },
      },
      fontFamily: {
        kids: ['Fredoka', 'Quicksand', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'chunky': '0 6px 0px 0px rgba(30, 125, 148, 0.35)',
        'chunky-sm': '0 3px 0px 0px rgba(30, 125, 148, 0.35)',
        'chunky-dark': '0 6px 0px 0px rgba(0, 0, 0, 0.5)',
        'glow-neon': '0 0 15px rgba(70, 236, 103, 0.75)',
        'glow-aqua': '0 0 15px rgba(18, 237, 171, 0.75)',
      },
      animation: {
        'bounce-slight': 'bounceSlight 2s infinite ease-in-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        bounceSlight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
};
