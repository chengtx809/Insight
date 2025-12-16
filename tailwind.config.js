/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 古书风格配色
        paper: {
          50: '#fefdfb',
          100: '#fdf8f0',
          200: '#f9edd8',
          300: '#f3dfc0',
          400: '#e8c99a',
          500: '#d4a574',
          600: '#b8865a',
          700: '#96684a',
          800: '#7a5340',
          900: '#654538',
        },
        ink: {
          50: '#f7f6f5',
          100: '#e8e4df',
          200: '#d4cdc4',
          300: '#b8ada0',
          400: '#9a8b7a',
          500: '#7d6e5d',
          600: '#5c5045',
          700: '#4a4038',
          800: '#3d352f',
          900: '#2d2722',
          950: '#1a1714',
        },
        vermilion: {
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#fececa',
          300: '#fcaaa4',
          400: '#f87a70',
          500: '#c73c33',
          600: '#a52f27',
          700: '#8a251f',
          800: '#72221d',
          900: '#5f211e',
        },
        jade: {
          50: '#f0fdf6',
          100: '#dcfce9',
          200: '#bbf7d4',
          300: '#86efb3',
          400: '#4ade87',
          500: '#2d8a5e',
          600: '#1f6b47',
          700: '#1a5639',
          800: '#19452f',
          900: '#163a28',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'SimSun', 'serif'],
        kai: ['"ZCOOL XiaoWei"', 'KaiTi', '"楷体"', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'brush-stroke': 'brushStroke 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        brushStroke: {
          '0%': { width: '0%', opacity: '0' },
          '100%': { width: '100%', opacity: '1' },
        },
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'scroll': '0 4px 20px -2px rgba(45, 39, 34, 0.15), 0 2px 8px -2px rgba(45, 39, 34, 0.1)',
        'seal': '2px 2px 4px rgba(199, 60, 51, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
