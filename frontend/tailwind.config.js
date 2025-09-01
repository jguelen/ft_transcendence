/** @type {import('tailwindcss').Config} */
export default {
  // Spécifie les fichiers à analyser pour trouver les classes Tailwind utilisées
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  
  theme: {
    extend: {
      // Étendre ou personnaliser le thème Tailwind par défaut
      colors: {
        // Exemple: Ajoutez vos couleurs personnalisées
        'primary': '#3B82F6',      // Un bleu pour les éléments primaires
        'primary-dark': '#2563EB', // Version plus foncée pour hover
        'secondary': '#10B981',    // Un vert pour les éléments secondaires
        'accent': '#F59E0B',       // Une couleur d'accent
        'background': '#F3F4F6',   // Couleur de fond
      },
      fontFamily: {
        // Exemple: Configurez des polices personnalisées
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      // Vous pouvez aussi personnaliser d'autres aspects comme:
      // borderRadius, spacing, fontSize, etc.
    },
  },
  
  plugins: [
    // Ajoutez ici des plugins Tailwind si nécessaire
    // Par exemple: require('@tailwindcss/forms'),
  ],
  
  // Options supplémentaires
  darkMode: 'class', // Permet le mode sombre via la classe 'dark'
}
