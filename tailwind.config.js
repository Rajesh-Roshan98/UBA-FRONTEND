module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,                      // mx-auto
      padding: {
        DEFAULT: '1rem',                 // px-4
        sm: '1.5rem',                    // sm:px-6
        lg: '2rem',                      // lg:px-8
      },
      screens: {
        sm: '100%',
        md: '100%',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',                 // 👈 expands on large monitors
      },
    },
    extend: {},
  },
  plugins: [],
};
