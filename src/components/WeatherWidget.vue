<template>
  <div class="relative group">
    <!-- 3D Card Container -->
    <div class="relative transform-style-preserve-3d transition-transform duration-500 group-hover:rotate-y-12 group-hover:rotate-x-12">
      <!-- Card Front -->
      <div class="relative bg-gradient-to-br from-blue-500/20 to-purple-600/30 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10 overflow-hidden transform-style-preserve-3d">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden opacity-20">
          <div class="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-blue-400 to-purple-600 animate-spin-slow"></div>
        </div>
        
        <!-- Search Bar -->
        <div class="relative z-10 mb-8 transform-style-preserve-3d">
          <div class="flex items-center bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="searchByCity"
              placeholder="Search for a city..."
              class="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-white/60 px-4 py-3 text-lg"
            />
            <button
              @click="searchByCity"
              class="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition-opacity"
              :disabled="loading"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="relative z-10 transform-style-preserve-3d">
          <div class="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Fetching Weather Data</h3>
            <p class="text-white/60">Please wait while we get the latest updates...</p>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div>
                  <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                  <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>
              <div class="space-y-2 text-right">
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="relative z-10 transform-style-preserve-3d">
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
            <div class="text-red-500 dark:text-red-400 text-5xl mb-4">⚠️</div>
            <p class="text-red-700 dark:text-red-300 font-medium mb-4">{{ error }}</p>
            <button 
              @click="fetchWeather" 
              class="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>

        <!-- Weather Data -->
        <div v-else-if="weatherData" class="relative z-10 transform-style-preserve-3d">
          <!-- Current Weather -->
          <div class="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/10 shadow-xl">
            <!-- Location and Date -->
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                {{ weatherData.name }}, {{ weatherData.sys.country }}
                <button 
                  @click="refreshWeather"
                  class="ml-2 p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Refresh"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                  </svg>
                </button>
              </h2>
              <p class="text-gray-500 dark:text-gray-400">{{ currentDate }}</p>
            </div>

            <!-- Current Weather -->
            <div class="flex flex-col md:flex-row items-center justify-between mb-6">
              <div class="text-center md:text-left mb-4 md:mb-0">
                <h2 class="text-3xl font-bold text-white">{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
                <p class="text-white/70">{{ formatDate() }}</p>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  {{ Math.round(weatherData.main.temp) }}°C
                </div>
                <div class="text-6xl">
                  {{ getWeatherIcon(weatherData.weather[0].main) }}
                </div>
              </div>
            </div>
            <div class="text-center py-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <p class="text-xl font-medium text-white capitalize">{{ weatherData.weather[0].description }}</p>
            </div>

            <!-- Weather Stats -->
            <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="(stat, index) in weatherStats" :key="index" 
                   class="p-4 rounded-xl backdrop-blur-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300">
                <div class="flex items-center space-x-2">
                  <span class="text-blue-300">{{ stat.icon }}</span>
                  <span class="text-sm font-medium text-white/70">{{ stat.label }}</span>
                </div>
                <div class="mt-2 text-xl font-bold text-white">{{ stat.value }}</div>
              </div>
            </div>
          </div>

          <!-- 5-Day Forecast -->
          <div class="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-8 shadow-xl">
            <h3 class="text-lg font-semibold text-white mb-4">5-Day Forecast</h3>
            <div class="space-y-3">
              <div v-for="day in forecast" :key="day.dt" 
                   class="flex items-center justify-between p-3 rounded-lg transition-colors duration-200"
                   :class="darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
                <span class="text-gray-600 dark:text-gray-300 w-24">{{ day.day }}</span>
                <div class="flex-1 px-4">
                  <WeatherIcon :condition="day.weather[0].main" :time="'day'" class="h-8 w-8" />
                </div>
                <div class="w-20 text-right">
                  <span class="text-gray-800 dark:text-white font-medium">
                    {{ Math.round(day.temp.max) }}° / {{ Math.round(day.temp.min) }}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Card Back (3D Effect) -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-2xl transform translate-z-[-20px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import gsap from 'gsap';

// Weather Icons Component
const WeatherIcon = {
  props: ['condition', 'time', 'class'],
  template: `
    <span :class="['inline-block', $props.class]">
      <template v-if="condition === 'Clear'">
        <span v-if="time === 'night'">🌙</span>
        <span v-else>☀️</span>
      </template>
      <span v-else-if="condition === 'Clouds'">☁️</span>
      <span v-else-if="condition === 'Rain'">🌧️</span>
      <span v-else-if="condition === 'Drizzle'">🌦️</span>
      <span v-else-if="condition === 'Thunderstorm'">⛈️</span>
      <span v-else-if="condition === 'Snow'">❄️</span>
      <span v-else>🌤️</span>
    </span>
  `
};

const weatherData = ref(null);
const loading = ref(true);
const error = ref(null);
const currentDate = ref('');
const searchQuery = ref('');
const darkMode = ref(false);
const forecast = ref([
  { dt: 1, day: 'Mon', temp: { max: 22, min: 15 }, weather: [{ main: 'Clear' }] },
  { dt: 2, day: 'Tue', temp: { max: 24, min: 16 }, weather: [{ main: 'Clouds' }] },
  { dt: 3, day: 'Wed', temp: { max: 20, min: 14 }, weather: [{ main: 'Rain' }] },
  { dt: 4, day: 'Thu', temp: { max: 18, min: 12 }, weather: [{ main: 'Drizzle' }] },
  { dt: 5, day: 'Fri', temp: { max: 21, min: 13 }, weather: [{ main: 'Clear' }] },
]);

// Check for saved theme preference
onMounted(() => {
  formatDate();
  checkDarkModePreference();
  if (navigator.geolocation) {
    fetchWeather();
  } else {
    error.value = 'Geolocation is not supported by your browser';
    loading.value = false;
  }
});

// Get current time of day for weather icons
const getTimeOfDay = () => {
  const hours = new Date().getHours();
  return hours >= 6 && hours < 18 ? 'day' : 'night';
};

// Refresh weather data
const refreshWeather = () => {
  if (navigator.geolocation) {
    fetchWeather();
  }
};

// Toggle dark mode
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  if (darkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'disabled');
  }
};

// Check for saved dark mode preference
const checkDarkModePreference = () => {
  const savedPreference = localStorage.getItem('darkMode');
  if (savedPreference === 'enabled' || 
      (!savedPreference && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    darkMode.value = true;
    document.documentElement.classList.add('dark');
  }
};

// Format date
const formatDate = () => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  currentDate.value = new Date().toLocaleDateString('en-US', options);
};

// Get weather icon based on condition
const getWeatherIcon = (condition) => {
  const icons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Smoke: '💨',
    Haze: '🌫️',
    Dust: '💨',
    Fog: '🌫️',
    Sand: '💨',
    Ash: '🌋',
    Squall: '💨',
    Tornado: '🌪️'
  };
  
  return icons[condition] || '🌡️';
};

// Weather stats with icons
const weatherStats = computed(() => {
  if (!weatherData.value) return [];
  
  return [
    { 
      label: 'Feels Like', 
      value: `${Math.round(weatherData.value.main.feels_like)}°C`,
      icon: '🌡️'
    },
    { 
      label: 'Humidity', 
      value: `${weatherData.value.main.humidity}%`,
      icon: '💧'
    },
    { 
      label: 'Wind', 
      value: `${Math.round(weatherData.value.wind.speed * 3.6)} km/h`,
      icon: '💨'
    },
    { 
      label: 'Pressure', 
      value: `${weatherData.value.main.pressure} hPa`,
      icon: '📊'
    },
  ];
});

// Fetch weather by coordinates
const fetchWeather = async (lat, lon) => {
  try {
    loading.value = true;
    error.value = null;
    
    let url = `${import.meta.env.VITE_WEATHER_API_BASE_URL}/weather?`;
    if (lat && lon) {
      url += `lat=${lat}&lon=${lon}`;
    } else if (searchQuery.value) {
      url += `q=${encodeURIComponent(searchQuery.value)}`;
    } else {
      const position = await getCurrentPosition();
      url += `lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
    }
    
    url += `&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    weatherData.value = await response.json();
    searchQuery.value = '';
  } catch (err) {
    console.error('Error fetching weather data:', err);
    error.value = 'Failed to load weather data. Please check the city name or your connection.';
  } finally {
    loading.value = false;
  }
};

// Get current position
const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// Search weather by city
const searchByCity = () => {
  if (searchQuery.value.trim()) {
    fetchWeather();
  }
};
</script>

<style>
/* 3D Transform Preserve */
.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

/* Custom Animations */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

/* Glassmorphism Effect */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>