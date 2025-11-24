<template>
  <div class="min-h-screen bg-light-gray dark:bg-background-dark text-deep-blue dark:text-white transition-colors duration-300">
    <router-view />
    <footer class="w-full bg-light-gray py-8 dark:bg-background-dark/50 font-display">
      <div class="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 text-center">
        <div class="flex flex-wrap items-center justify-center gap-6">
          <router-link to="/" class="text-base font-normal text-gray-600 hover:text-bright-blue dark:text-gray-300 dark:hover:text-bright-blue transition-colors">Home</router-link>
          <router-link to="/about" class="text-base font-normal text-gray-600 hover:text-bright-blue dark:text-gray-300 dark:hover:text-bright-blue transition-colors">About</router-link>
          <router-link to="/privacy" class="text-base font-normal text-gray-600 hover:text-bright-blue dark:text-gray-300 dark:hover:text-bright-blue transition-colors">Privacy Policy</router-link>
          <router-link to="/contact" class="text-base font-normal text-gray-600 hover:text-bright-blue dark:text-gray-300 dark:hover:text-bright-blue transition-colors">Contact</router-link>
        </div>
        <p class="text-base font-normal text-gray-500 dark:text-gray-400">© {{ new Date().getFullYear() }} WeatherApp. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// Check for dark mode preference
onMounted(() => {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

:root {
  --primary: #0fabff;
  --background-light: #f5f7f8;
  --background-dark: #0f1c23;
  --deep-blue: #072374;
  --bright-blue: #17abff;
  --light-gray: #ece7e7;
}

.dark {
  --text-primary: #ffffff;
  --text-secondary: #d1d5db;
  --bg-primary: #0f1c23;
  --bg-secondary: #1a2a32;
}

.font-display {
  font-family: 'Space Grotesk', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--light-gray);
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-track {
  background: var(--background-dark);
}

::-webkit-scrollbar-thumb {
  background: var(--bright-blue);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Base styles live in src/index.css */
</style>