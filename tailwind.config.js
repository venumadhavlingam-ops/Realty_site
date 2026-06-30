/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // primary: '#0F172A',
        // accent: '#D4AF37',
        // background: '#F8FAFC',
        // success: '#22C55E'
        primary: '#0B1220',   // Deep Midnight Blue/Black from the logo background
        accent: '#C5A059',    // Luxurious Architectural Gold from the icon elements
        success: '#10B981',   // Clean emerald green for WhatsApp/Available actions
        background: '#F9FAFB' // Crisp light background for listing cards
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(15, 23, 42, 0.1)',
      }
    },
  },
  plugins: [],
}