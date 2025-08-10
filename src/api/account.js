import myAxios, { rawAxios } from './axios'

export const accountApi = {
  createAccount(data) {
    return rawAxios.post('/account/create', data)
  },
  login(data) {
    return myAxios.post('/account/login', data)
  },
  refreshToken(data) {
    return myAxios.post('/account/refreshToken', data)
  },
  requestPasswordReset(data) {
    return rawAxios.post('/account/reset/request', data)
  },
  verifyPasswordReset({ namespace, token }) {
    return rawAxios.get(`/account/reset/verify/${encodeURIComponent(namespace)}/${encodeURIComponent(token)}`)
  },
  performPasswordReset({ namespace, token, data }) {
    return rawAxios.post(`/account/reset/perform/${encodeURIComponent(namespace)}/${encodeURIComponent(token)}`, data)
  }
}
