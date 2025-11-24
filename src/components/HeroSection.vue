<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col items-center justify-start pt-12 px-4">
    <!-- Search Bar -->
    <div class="w-full max-w-md mb-8">
      <div class="relative">
        <input
          v-model="city"
          type="text"
          placeholder="Search for a city..."
          class="w-full px-6 py-4 rounded-full bg-white/20 backdrop-blur-md text-white text-lg placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
          :disabled="isLoading"
          @keyup.enter="searchWeather"
        >
        <button
          @click="searchWeather"
          :disabled="isLoading"
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 p-3 rounded-full transition-all disabled:opacity-50"
        >
          <svg v-if="isLoading" class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md w-full">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-white text-2xl">
      Loading weather data...
    </div>

    <!-- Weather Card -->
    <div v-else-if="weatherData" class="bg-white/20 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl">
      <div class="text-center text-white">
        <h2 class="text-4xl font-bold mb-1">{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
        <p class="text-lg opacity-90 mb-8">{{ formatDate(weatherData.dt) }}</p>
        
        <div class="flex flex-col items-center mb-8">
          <div class="text-8xl font-bold mb-2">{{ Math.round(weatherData.main.temp) }}°</div>
          <div class="text-2xl font-medium mb-2 capitalize">{{ weatherData.weather[0].description }}</div>
          <div class="text-lg opacity-90">Feels like {{ Math.round(weatherData.main.feels_like) }}°</div>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-8 text-sm">
          <div class="bg-white/20 rounded-2xl p-4 text-center">
            <div class="opacity-80 mb-1">Humidity</div>
            <div class="text-2xl font-bold">{{ weatherData.main.humidity }}%</div>
          </div>
          <div class="bg-white/20 rounded-2xl p-4 text-center">
            <div class="opacity-80 mb-1">Wind</div>
            <div class="text-2xl font-bold">{{ Math.round(weatherData.wind.speed * 3.6) }} km/h</div>
          </div>
          <div class="bg-white/20 rounded-2xl p-4 text-center">
            <div class="opacity-80 mb-1">Pressure</div>
            <div class="text-2xl font-bold">{{ weatherData.main.pressure }} hPa</div>
          </div>
          <div class="bg-white/20 rounded-2xl p-4 text-center">
            <div class="opacity-80 mb-1">Visibility</div>
            <div class="text-2xl font-bold">{{ (weatherData.visibility / 1000).toFixed(1) }} km</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Default Message -->
    <div v-else class="text-white text-center p-8">
      <h2 class="text-3xl font-bold mb-4">Weather App</h2>
      <p class="text-xl opacity-80">Search for a city to see the weather forecast</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroSection',
  data() {
    return {
      city: '',
      weatherData: null,
      isLoading: false,
      error: null,
      baseUrl: import.meta.env.VITE_WEATHER_API_BASE_URL
    }
  },
  methods: {
    async searchWeather() {
      if (!this.city.trim()) return
      
      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch(
          `${this.baseUrl}/weather?q=${encodeURIComponent(this.city)}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
        )
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch weather data')
        }
        
        this.weatherData = await response.json()
      } catch (error) {
        this.error = error.message || 'Error fetching weather data. Please try again.'
        console.error('Error:', error)
      } finally {
        this.isLoading = false
      }
    },
    formatDate(timestamp) {
      return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>