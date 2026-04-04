/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Royal Maroon - Primary
        maroon: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ec7a96',
          500: '#df4d73',
          600: '#c9305a',
          700: '#a82347',
          800: '#8b2040',
          900: '#751e3a',
          950: '#800020', // Classic maroon
        },
        // Royal Gold - Secondary
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4af37', // Classic gold
          600: '#b8960c',
          700: '#92700c',
          800: '#78590c',
          900: '#65500d',
          950: '#433503',
        },
        // Cream/Ivory for backgrounds
        cream: {
          50: '#fffdf7',
          100: '#fff9eb',
          200: '#fff3d6',
          300: '#ffebb8',
          400: '#ffe08a',
          500: '#f5e6c8',
          600: '#e8d4a8',
          700: '#d4b896',
          800: '#c4a57a',
          900: '#b08c5a',
        },
        // Deep burgundy for accents
        burgundy: {
          50: '#fdf4f4',
          100: '#fbe8e8',
          200: '#f8d4d4',
          300: '#f2b0b0',
          400: '#e88080',
          500: '#d94f4f',
          600: '#c03030',
          700: '#9f2424',
          800: '#852020',
          900: '#722f37',
          950: '#4a1c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        decorative: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #800020 0%, #722F37 50%, #4a1c1c 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)',
        'cream-gradient': 'linear-gradient(180deg, #fff9eb 0%, #fffdf7 100%)',
        'mandala-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(212, 175, 55, 0.25)',
        'maroon': '0 4px 20px rgba(128, 0, 32, 0.25)',
        'royal': '0 10px 40px rgba(128, 0, 32, 0.3)',
      },
    },
  },
  plugins: [],
}