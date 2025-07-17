/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'space-blue': '#0a0a0f',
        'electric-cyan': '#00ffff',
        'holographic-pink': '#ff00ff',
        'warm-white': '#f8f8f8',
        'lab-green': '#00ff88',
        'energy-purple': '#8844ff'
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'particle-float': 'particle-float 4s ease-in-out infinite',
        'hologram': 'hologram 2s ease-in-out infinite'
      },
      keyframes: {
        'pulse-glow': {
          '0%': { 
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
            transform: 'scale(1)'
          },
          '100%': { 
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.8)',
            transform: 'scale(1.05)'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        },
        'particle-float': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.7'
          },
          '50%': { 
            transform: 'translateY(-30px) rotate(180deg)',
            opacity: '1'
          }
        },
        'hologram': {
          '0%, 100%': { 
            opacity: '0.8',
            filter: 'hue-rotate(0deg)'
          },
          '50%': { 
            opacity: '1',
            filter: 'hue-rotate(90deg)'
          }
        }
      },
      backdropBlur: {
        'xs': '2px'
      }
    }
  },
  plugins: []
};