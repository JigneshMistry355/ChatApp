import { transform } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes:{
          'ping-once':{
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(2)', opacity: '1' },
        },
          'bounce-twice':{
            '0%': {transform: 'translateY(0)'},
            '25%': {transform: 'translateY(-100%)'},
            '50%': {transform: 'translateY(0)'},
            '75%': {transform: 'translateY(-25%)'},
            '100%': {transform: 'translateY(0)'},
          },
          'slide-down':{
            '0%': {transform: 'translateY(-100%)'},
            '10%': {transform: 'translateY(-90%)'},
            '20%': {transform: 'translateY(-80%)'},
            '30%': {transform: 'translateY(-70%)'},
            '40%': {transform: 'translateY(-60%)'},
            '50%': {transform: 'translateY(-50%)'},
            '60%': {transform: 'translateY(-40%)'},
            '70%': {transform: 'translateY(-30%)'},
            '80%': {transform: 'translateY(-20%)'},
            '90%': {transform: 'translateY(-10%)'},
            '100%': {transform: 'translateY(0%)'},
          }
      },
      animation:{
        'ping-once': 'ping-once 0.6s ease-out forwards',
        'bounce-twice': 'bounce-twice 2s ease-out 1',
        'slide-down': 'slide-down 0.6s ease-out 1',
      },
    },
  },
  plugins: [],
}

