import { defineStore } from 'pinia'
import { accountApi } from '../api/account'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    user: null,
  }),
   persist: true,
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },
  actions: {
    setTokens({ accessToken, refreshToken }) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    },
    clearTokens() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
    },
    async login({ email, password }) {
      const res = await accountApi.login({ email, password })
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
        const res = await accountApi.refreshToken({
          refreshToken: this.refreshToken
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
