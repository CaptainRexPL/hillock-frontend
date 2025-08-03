import { defineStore } from 'pinia'
import axios from '../api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },
  actions: {
    setTokens({ accessToken, refreshToken }) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },
    clearTokens() {
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      this.user = null
    },
    async login({ email, password }) {
      const res = await axios.post('/api/account/login', { email, password })
      this.setTokens({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      })
      this.user = res.data.user
      return res
    },
    async logout(router) {
      this.clearTokens()
      if (router && router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    },
    async refreshTokenAction() {
      if (!this.refreshToken) throw new Error('No refresh token')
      try {
        const res = await axios.post('/api/account/refreshToken', {
          refreshToken: this.refreshToken,
        })
        this.setTokens({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken || this.refreshToken,
        })
        return res.data.accessToken
      } catch (e) {
        this.clearTokens()
        throw e
      }
    },
  },
})
