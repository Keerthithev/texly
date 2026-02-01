module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9', // sky-500
        secondary: '#38bdf8', // sky-400
        accent: '#7dd3fc', // sky-300
        background: '#f0f9ff', // sky-50
        surface: '#ffffff',
        error: '#ef4444',
        info: '#0ea5e9',
        success: '#22c55e',
        warning: '#f59e42',
        muted: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Sinhala', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
