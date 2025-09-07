/** @type {import('tailwindcss').Config} */
export default {
  // Spécifie les fichiers à analyser pour trouver les classes Tailwind utilisées
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
      },
      boxShadow: {
        'card': '0 0 10.2px 2px rgba(0, 249, 236, 0.3)',
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
    // Ajoutez ici des plugins Tailwind si nécessaire
    // Par exemple: require('@tailwindcss/forms'),
  ],
  
  // Options supplémentaires
  darkMode: 'class', // Permet le mode sombre via la classe 'dark'
}
