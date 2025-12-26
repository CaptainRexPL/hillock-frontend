import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Register from '../views/Register.vue'
import RequestPasswordReset from '../views/RequestPasswordReset.vue'
import PerformPasswordReset from '../views/PerformPasswordReset.vue'
import DiscordLink from '../views/DiscordLink.vue';

const routes = [
    {
        path: '/discord-link/:token',
        name: 'linkDiscord',
        component: DiscordLink,
        meta: { requiresAuth: true }
    },
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
      path: '/reset/perform/:token',
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
    if (to.path === '/login') {
        if (auth.accessToken && !auth.user) {
            try {
                await auth.getMe()
            } catch {
                return next()
            }
        }
        if (auth.user) {
            return next({ path: '/' })

        }
    }
    if (!to.meta.requiresAuth) {
        return next()
    }
    if (!auth.accessToken) {
        return next({ path: '/login', query: { returnUrl: to.fullPath } })
    }
    if (auth.user) {
        return next()
    }
    try {
        await auth.getMe()
        return next()
    } catch {
        return next({ path: '/login', query: { returnUrl: to.fullPath } })
    }
})

export default router
