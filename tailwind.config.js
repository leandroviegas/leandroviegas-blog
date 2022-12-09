module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      pattern: /(border|text)-(zinc|red|indigo|violet)-(600|700|800)/,
    },
    "focus:border-indigo-700",
    "focus:border-red-700"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};