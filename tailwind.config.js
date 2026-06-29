/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",   // soft indigo
        secondary: "#22D3EE", // soft cyan
        accent: "#F472B6",    // soft pink (for highlights)
        bgsoft: "#F8FAFC",
      },
      backgroundImage: {
        "soft-gradient":
          "linear-gradient(135deg, #DDE3FD 0%, #BFEFF7 50%, #FBD7E9 100%)",
      },
    },
  },
  plugins: [],
};