/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // SWIM26 Material Design 3 Colors (Dark Theme)
        "primary": "#81ecff",
        "primary-dim": "#00d4ec",
        "primary-fixed": "#00e3fd",
        "primary-fixed-dim": "#00d4ec",
        "primary-container": "#00e3fd",

        "secondary": "#bfcafd",
        "secondary-dim": "#b2bcee",
        "secondary-fixed": "#c6cfff",
        "secondary-fixed-dim": "#b7c1f4",
        "secondary-container": "#3a446f",

        "tertiary": "#f9f9f9",
        "tertiary-dim": "#ebebeb",
        "tertiary-fixed": "#ffffff",
        "tertiary-fixed-dim": "#f0f1f1",
        "tertiary-container": "#ebebeb",

        "error": "#ff716c",
        "error-dim": "#d7383b",
        "error-container": "#9f0519",

        "surface": "#070e1b",
        "surface-dim": "#070e1b",
        "surface-bright": "#222c41",
        "surface-container-lowest": "#000000",
        "surface-container-low": "#0c1322",
        "surface-container": "#11192a",
        "surface-container-high": "#172031",
        "surface-container-highest": "#1c2639",

        "background": "#070e1b",
        "on-background": "#e2e8fb",

        "on-surface": "#e2e8fb",
        "on-surface-variant": "#a5abbd",

        "on-primary": "#005762",
        "on-primary-fixed": "#003840",
        "on-primary-fixed-variant": "#005762",
        "on-primary-container": "#004d57",

        "on-secondary": "#37416c",
        "on-secondary-fixed": "#27325b",
        "on-secondary-fixed-variant": "#444e7a",
        "on-secondary-container": "#c4ceff",

        "on-tertiary": "#5e5f60",
        "on-tertiary-fixed": "#4f5051",
        "on-tertiary-fixed-variant": "#6c6d6e",
        "on-tertiary-container": "#555757",

        "on-error": "#490006",
        "on-error-container": "#ffa8a3",

        "outline": "#6f7586",
        "outline-variant": "#414857",

        "inverse-surface": "#f9f9ff",
        "inverse-on-surface": "#4e5565",
        "inverse-primary": "#006976",

        "surface-tint": "#81ecff",
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0px",
        "lg": "0px",
        "xl": "0px",
        "full": "9999px",
      },
      animation: {
        "slide-in-up": "slideInUp 0.6s ease-out",
        "slide-in-down": "slideInDown 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "glow": "glow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-scale": "pulse-scale 2s ease-in-out infinite",
        "button-glow": "button-glow 2s ease-in-out infinite",
        "skew": "skewX(-12deg)",
      },
      keyframes: {
        slideInUp: {
          "from": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "to": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideInDown: {
          "from": {
            opacity: "0",
            transform: "translateY(-30px)",
          },
          "to": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideInLeft: {
          "from": {
            opacity: "0",
            transform: "translateX(-30px)",
          },
          "to": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        slideInRight: {
          "from": {
            opacity: "0",
            transform: "translateX(30px)",
          },
          "to": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        glow: {
          "0%, 100%": {
            textShadow: "0 0 5px rgba(129, 236, 255, 0.2)",
          },
          "50%": {
            textShadow: "0 0 20px rgba(129, 236, 255, 0.6)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        "pulse-scale": {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.05)",
          },
        },
        "button-glow": {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(129, 236, 255, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(129, 236, 255, 0.6)",
          },
        },
      },
    },
  },
  plugins: [],
}
