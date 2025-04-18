import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './assets/main.css'
import App from './App.vue'

// Import views
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import TodoList from './views/TodoList.vue'
import NotFound from './views/NotFound.vue'
import AuthCallback from './views/AuthCallback.vue'

// Get base URL from Vite
const base = import.meta.env.BASE_URL

// Set this to true to use local storage instead of API calls when backend is not available
window.USE_MOCK_BACKEND = true;

// Create router
const router = createRouter({
  history: createWebHistory(base),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/todos', component: TodoList, meta: { requiresAuth: true } },
    { path: '/auth/callback', component: AuthCallback },
    { path: '/:pathMatch(.*)*', component: NotFound }
  ]
})

// Route guard for protected routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

// Create Pinia store
const pinia = createPinia()

// Create app
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')

// Handle redirect from 404.html page after app is mounted
const handleRedirect = () => {
  const redirect = sessionStorage.getItem('redirect')
  if (redirect && redirect !== '' && redirect !== '/') {
    console.log('Redirecting to:', redirect)
    sessionStorage.removeItem('redirect')
    // Use router.replace instead of push to avoid adding to history
    router.replace('/' + redirect)
  }
}

// Wait a moment before handling the redirect to ensure app is fully loaded
setTimeout(handleRedirect, 100)
