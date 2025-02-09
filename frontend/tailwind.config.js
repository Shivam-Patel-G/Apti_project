export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust this to your project's structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    import('@tailwindcss/forms'), // Use import instead of require
  ],
};
