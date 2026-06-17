/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#050505",
        "neon-orange": "#FF5B00",
        "neon-blue": "#00D4FF",
        "neon-purple": "#9D4EDD",
        gold: "#FFD60A",
        "glass-white": "rgba(255,255,255,0.04)",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "monospace"],
        inter: ["var(--font-inter)", "sans-serif"],
        space: ["var(--font-space)", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse at center, rgba(255,91,0,0.15) 0%, transparent 60%)",
      },
      backgroundSize: {
        grid: "60px 60px",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "scan-line": "scanLine 8s linear infinite",
        "sound-wave": "soundWave 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.5)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        soundWave: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      boxShadow: {
        "neon-orange": "0 0 20px rgba(255,91,0,0.5), 0 0 60px rgba(255,91,0,0.2)",
        "neon-blue": "0 0 20px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2)",
        "neon-purple": "0 0 20px rgba(157,78,221,0.5), 0 0 60px rgba(157,78,221,0.2)",
        "neon-gold": "0 0 20px rgba(255,214,10,0.5), 0 0 60px rgba(255,214,10,0.2)",
        glass: "0 8px 32px 0 rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};
