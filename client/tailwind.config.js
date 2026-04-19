/* eslint-disable no-undef */
module.exports = {
  darkMode: "class", // ✅ REQUIRED for class-based dark mode
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      transform: ["group-hover"],
      animation: {
        "spin-slow": "spin 4s linear infinite",
        "gradient-move": "gradientMove 7s ease-in-out infinite",
        twinkle: "twinkle 2s ease-in-out infinite",
      },
      keyframes: {
        gradientMove: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        twinkle: {
          "0%, 100%": { opacity: 1, scale: 1 },
          "50%": { opacity: 0.7, scale: 1.3 },
        },
      },
    },
  },
  plugins: [],
  safelist: ["transform-style-preserve-3d", "perspective"],
};
