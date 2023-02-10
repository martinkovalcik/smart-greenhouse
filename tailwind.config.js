/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      keyframes:{
        bounce:{
          '0%, 100%': { transform: 'translateY(-3%)'},
        },
      },
      animation:{
        'spin_slow': 'spin 360s linear infinite',
        'bounce_slow': 'bounce 10s infinite;',
      },
    },
  },
  plugins: [],
}
