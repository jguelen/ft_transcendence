/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        'main-background': 'rgba(27,28,47,0.7)',
        'accent': '#00F9EC',
        'text': '#A5BAD0',
        'second-accent': '#275F99',
        'stroke': '#424354',
        'blue_darkend': 'rgba(39, 95, 153, 0.30)',
        'cyan_darkend': 'rgba(0, 249, 236, 0.30)'
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'orbitron': ['Orbitron', 'monospace'],
      },
      borderRadius: {
        'small': '18px',
        'big': '28px'
      },
      backgroundColor: {
        'main': 'rgba(27,28,47,0.7)',
        'cyan_card': 'rgba(0, 249, 236, 0.03)',
        'blue_card': 'rgba(39, 95, 153, 0.06)',
      },
      boxShadow: {
        'card': '0 0 10.2px 2px rgba(0, 249, 236, 0.3)',
        'primary': '0 0 10.2px 2px rgba(0, 249, 236, 0.8)',
        'secondary': '0 0 10.2px 2px rgba(39, 95, 153, 1)',
        'stroke': '0 0 0 1 rgba(66, 67, 84, 1)'
      },
      backdropBlur: {
        'card': '3px',
      },
      fontSize: {
        'title': '48px',
        'subtitle': '24px',
      }
    },
  },
  
  plugins: [
  ],

}
