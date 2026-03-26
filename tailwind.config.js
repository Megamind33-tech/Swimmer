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
        // SWIM26 Design System Colors (Aquatic Dark Theme)
        // Sports Broadcast Standard (volt yellow)
        // NOTE: this tailwind "primary" is now aligned with src/theme/tokens.ts (`colors.primary.DEFAULT`).
        "primary": "#CCFF00",
        "primary-dim": "#AADD00",
        "primary-fixed": "#DDFF33",
        "primary-fixed-dim": "#AADD00",
        "primary-container": "#0A1628",

        // Gold story is an alias of volt in this project (so we don't reintroduce a third brand color).
        "secondary": "#CCFF00",
        "secondary-dim": "#AADD00",
        "secondary-fixed": "#DDFF33",
        "secondary-fixed-dim": "#AADD00",
        "secondary-container": "#3A2A00",

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
        // Aliases matching design tokens (src/theme/tokens.ts surface palette)
        "surface-base":    "#050B14",
        "surface-low":     "#080F1C",
        "surface-mid":     "#0A1628",
        "surface-high":    "#111D2E",
        "surface-highest": "#1B2838",

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

        // Broadcast Standard Colors — SWIM26 FC26 aesthetic
        "volt":              "#CCFF00",      // High-vis accent (primary CTA fill)
        "volt-dim":          "#AADD00",      // Volt pressed / dimmed state
        "broadcast-red":     "#FF003C",      // Flat stark danger
        "broadcast-gold":    "#FFB800",      // Scoreboard gold (stats, rankings)
        "carbon":            "#0A0A0A",      // Deepest surface
        "graphite":          "#1A1A1A",      // Elevated panel
        "graphite-high":     "#222222",      // Raised element
        "broadcast-white":   "#FFFFFF",
        // Game-blue — broadcast-standard navy palette for backgrounds/rails
        "game-blue":         "#07111E",      // Game frame background
        "game-blue-mid":     "#0C1B2D",      // Card / panel surface
        "game-blue-raised":  "#10243A",      // Raised element / back-btn
        "game-blue-border":  "#1E3A57",      // Structural border
      },
      fontFamily: {
        "headline": ["IBM Plex Sans", "sans-serif"],
        "body": ["IBM Plex Sans", "sans-serif"],
        "label": ["IBM Plex Sans", "sans-serif"],
        "din": ["'Din Condensed'", "'Din Next Condensed'", "sans-serif"],
        "barlow": ["'Barlow Condensed'", "sans-serif"],
        "chakra": ["'Chakra Petch'", "sans-serif"],
        "mono": ["'JetBrains Mono'", "'Roboto Mono'", "monospace"],
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
        "slide-in-up-fast": "slideInUp 0.3s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-scale": "pulse-scale 2s ease-in-out infinite",
        "squash-stretch": "squashStretch 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "magnetic-tilt": "magneticTilt 0.3s ease-out",
        "parallax-float": "parallaxFloat 8s ease-in-out infinite",
        "ticker-scroll": "tickerScroll 40s linear infinite",
        "live-pulse": "livePulse 1.2s ease-in-out infinite",
        "water-fill": "waterFill 0.6s ease-out forwards",
        "shimmer": "shimmer 3s ease-in-out infinite",
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
        squashStretch: {
          "0%":   { transform: "scale(1)" },
          "50%":  { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        magneticTilt: {
          "from": {
            transform: "perspective(1000px) rotateX(0) rotateY(0)",
          },
          "to": {
            transform: "perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
          },
        },
        parallaxFloat: {
          "0%, 100%": {
            transform: "translateY(0px) translateX(0px)",
          },
          "25%": {
            transform: "translateY(-15px) translateX(10px)",
          },
          "50%": {
            transform: "translateY(0px) translateX(0px)",
          },
          "75%": {
            transform: "translateY(-10px) translateX(-8px)",
          },
        },
        tickerScroll: {
          "from": {
            transform: "translateX(100%)",
          },
          "to": {
            transform: "translateX(-100%)",
          },
        },
        livePulse: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.7",
            transform: "scale(1.05)",
          },
        },
        waterFill: {
          "from": {
            clipPath: "inset(100% 0 0 0)",
          },
          "to": {
            clipPath: "inset(0 0 0 0)",
          },
        },
        shimmer: {
          "0%, 100%": {
            backgroundPosition: "-1000px 0",
          },
          "50%": {
            backgroundPosition: "1000px 0",
          },
        },
      },
    },
  },
  plugins: [],
}
