/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // `md` is where the editorial desktop storefront takes over. It also needs some
    // height, so phones held in landscape keep the app shell.
    screens: {
      xs: "400px",
      sm: "640px",
      md: { raw: "(min-width: 768px) and (min-height: 500px)" },
      lg: { raw: "(min-width: 1024px) and (min-height: 500px)" },
      xl: { raw: "(min-width: 1280px) and (min-height: 500px)" },
      "2xl": { raw: "(min-width: 1536px) and (min-height: 500px)" },
    },
    extend: {
      colors: {
        // Legacy aliases kept so untouched markup keeps rendering sensibly.
        primary: "#262624",
        secondary: "#D9D3C4",
        surface: "#FFF6E2",
        // Storefront design tokens
        cream: {
          DEFAULT: "#FFFBF2",
          deep: "#FFF6E2",
          dim: "#F3EDE0",
        },
        ink: {
          DEFAULT: "#262624",
          soft: "#3A3936",
          line: "#141412",
        },
        muted: "#6B6A65",
        hairline: "#E4DED0",
        periwinkle: "#C5C8EC",
        cobalt: "#2F4BFF",
        ember: "#E2552D",
      },
      fontFamily: {
        body: ['"Instrument Sans"', "system-ui", "sans-serif"],
        sans: ['"Instrument Sans"', "system-ui", "sans-serif"],
        heading: ['"Newsreader"', "Georgia", "serif"],
        serif: ['"Newsreader"', "Georgia", "serif"],
        arabicHeading: ["DG Ghayaty", "Ahsing", "serif"],
      },
      fontSize: {
        eyebrow: ["12px", { lineHeight: "1.2", letterSpacing: "0.02em" }],
        "display-sm": [
          "32px",
          { lineHeight: "1.02", letterSpacing: "-0.01em" },
        ],
        display: ["44px", { lineHeight: "1", letterSpacing: "-0.015em" }],
        "display-lg": [
          "60px",
          { lineHeight: "0.95", letterSpacing: "-0.02em" },
        ],
        "display-xl": [
          "76px",
          { lineHeight: "0.92", letterSpacing: "-0.025em" },
        ],
      },
      spacing: {
        gutter: "var(--gutter)",
        header: "var(--header-h)",
      },
      transitionTimingFunction: {
        karst: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "appear-up": {
          "0%": { opacity: "0", transform: "translate3d(0, 1rem, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        appear: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        "slow-zoom": {
          "0%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "appear-up": "appear-up 0.6s ease forwards",
        appear: "appear 1.75s ease forwards",
        marquee: "marquee 28s linear infinite",
        "slow-zoom": "slow-zoom 9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
