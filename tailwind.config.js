module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      pattern: /(border|text)-(zinc|red|violet)-(600|700|800)/,
    },
    "focus:border-violet-700",
    "focus:border-red-700"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};