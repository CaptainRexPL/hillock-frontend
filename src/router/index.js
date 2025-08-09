import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Register from '../views/Register.vue'
import RequestPasswordReset from '../views/RequestPasswordReset.vue'
import PerformPasswordReset from '../views/PerformPasswordReset.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }
    },
    { 
        path: '/login', 
        name: 'Login', 
        component: Login,
        meta: { requiresAuth: false } 
    },
    { 
        path: '/register', 
        name: 'Register', 
        component: Register,
        meta: { requiresAuth: false } 
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true }
    },
    {
      path: '/reset/request',
      name: 'requestReset',
      component: RequestPasswordReset,
      meta: { requiresAuth: false }
    },
    {
      path: '/reset/perform/:namespace/:token',
      name: 'performReset',
      component: PerformPasswordReset,
      meta: { requiresAuth: false }
    }
]

const router = createRouter({
        history: createWebHistory(),
        routes
    })

// Router Guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (auth.accessToken) {
    // Token is present
    return next()
  }

  if (to.meta.requiresAuth) {
    // Token is not present, but refresh is present
    if (auth.refreshToken) {
      try {
        await auth.refreshTokenAction()
        return next()
      } catch (err) {
        // Failed to refresh (in most cases, it means that the token has expired) – redirect to login
        return next({ path: '/login', query: { returnUrl: to.fullPath } })
      }
    } else {
      // Not logged in and no refresh token either
      return next({ path: '/login', query: { returnUrl: to.fullPath } })
    }
  }

  //Route does not require auth
  return next()
})

export default router
