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
        "primary": "#0f62fe",
        "primary-dim": "#4589ff",
        "primary-fixed": "#78a9ff",
        "primary-fixed-dim": "#4589ff",
        "primary-container": "#d0e2ff",

        "secondary": "#6f6f6f",
        "secondary-dim": "#525252",
        "secondary-fixed": "#e0e0e0",
        "secondary-fixed-dim": "#c6c6c6",
        "secondary-container": "#393939",

        "tertiary": "#f9f9f9",
        "tertiary-dim": "#ebebeb",
        "tertiary-fixed": "#ffffff",
        "tertiary-fixed-dim": "#f0f1f1",
        "tertiary-container": "#ebebeb",

        "error": "#ff716c",
        "error-dim": "#d7383b",
        "error-container": "#9f0519",

        "surface": "#0b1220",
        "surface-dim": "#0b1220",
        "surface-bright": "#1a2538",
        "surface-container-lowest": "#000000",
        "surface-container-low": "#101b2d",
        "surface-container": "#142238",
        "surface-container-high": "#1a2a42",
        "surface-container-highest": "#223552",

        "background": "#070d18",
        "on-background": "#f4f4f4",

        "on-surface": "#f4f4f4",
        "on-surface-variant": "#ffffff",

        "on-primary": "#ffffff",
        "on-primary-fixed": "#ffffff",
        "on-primary-fixed-variant": "#ffffff",
        "on-primary-container": "#ffffff",

        "on-secondary": "#ffffff",
        "on-secondary-fixed": "#ffffff",
        "on-secondary-fixed-variant": "#ffffff",
        "on-secondary-container": "#ffffff",

        "on-tertiary": "#ffffff",
        "on-tertiary-fixed": "#ffffff",
        "on-tertiary-fixed-variant": "#ffffff",
        "on-tertiary-container": "#ffffff",

        "on-error": "#ffffff",
        "on-error-container": "#ffffff",

        "outline": "#8d8d8d",
        "outline-variant": "#34445f",

        "inverse-surface": "#f9f9ff",
        "inverse-on-surface": "#4e5565",
        "inverse-primary": "#78a9ff",

        "surface-tint": "#0f62fe",
      },
      fontFamily: {
        "headline": ["IBM Plex Sans", "sans-serif"],
        "body": ["IBM Plex Sans", "sans-serif"],
        "label": ["IBM Plex Sans", "sans-serif"],
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
            textShadow: "0 0 5px rgba(15, 98, 254, 0.2)",
          },
          "50%": {
            textShadow: "0 0 20px rgba(15, 98, 254, 0.6)",
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
            boxShadow: "0 0 10px rgba(15, 98, 254, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(15, 98, 254, 0.6)",
          },
        },
      },
    },
  },
  plugins: [],
}
