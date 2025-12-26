import { defineStore } from 'pinia'
import { accountApi } from '../api/account'
import { profileApi } from '../api/profile'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    user: null,
  }),
  persist: {
    pick: ['accessToken', 'refreshToken']
  },
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
    async getMe() {
      try {
        const res = await profileApi.getMe()
        this.user = res.data
        return res
      } catch (e) {
        this.user = null
        throw e
      }
    },
    async updateProfile(data) {
      const payload = {}
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
          payload[key] = data[key]
        }
      }

      try {
        const res = await profileApi.update(payload)

        if (res.data?.success === true && res.data?.user) {
          this.user = { ...this.user, ...res.data.user }
        }

        return res
      } catch (err) {
        console.error('Profile update failed', err)
        throw err
      }
    },
    async unlinkDiscordAccount() {
      try {
        const res = await profileApi.unlink()
        if (res.status === 204) {
          console.log('Unlinked discord account')
          return true
        }
      } catch (err) {
        console.error('Profile unlink failed', err)
        throw err
      }
    }
  },
})
