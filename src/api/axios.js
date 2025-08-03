import axios from 'axios'
import JSONbig from 'json-bigint'
import { useAuthStore } from '../stores/useAuthStore'

const instance = axios.create({
  baseURL: 'https://hillock.live',
  transformResponse: [
    (data) => {
      try {
        return JSONbig.parse(data)
      } catch {
        return data
      }
    },
  ],
})

// Add the token to headers
instance.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const auth = useAuthStore()
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // queue reqests while we're refreshing the token
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            return instance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await auth.refreshTokenAction()
        originalRequest.headers.Authorization = 'Bearer ' + newToken
        processQueue(null, newToken)
        return instance(originalRequest)
      } catch (err) {
        processQueue(err, null)
        auth.clearTokens()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default instance
