import myAxios, { rawAxios } from './axios'

export const accountApi = {
  createAccount(data) {
    return rawAxios.post('/api/account/create', data)
  },
  login(data) {
    return myAxios.post('/api/account/login', data)
  },
  refreshToken(data) {
    return myAxios.post('/api/account/refreshToken', data)
  },
  requestPasswordReset(data) {
    return rawAxios.post('/api/account/reset/request', data)
  },
  verifyPasswordReset({ namespace, token }) {
    return rawAxios.get(`/api/account/reset/verify/${encodeURIComponent(namespace)}/${encodeURIComponent(token)}`)
  },
  performPasswordReset({ namespace, token, data }) {
    return rawAxios.post(`/api/account/reset/perform/${encodeURIComponent(namespace)}/${encodeURIComponent(token)}`, data)
  }
}
