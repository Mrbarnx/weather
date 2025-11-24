import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HeroSection from './components/HeroSection.vue'
import About from './components/About.vue'
import Privacy from './components/Privacy.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HeroSection },
    { path: '/about', component: About },
    { path: '/privacy', component: Privacy }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')