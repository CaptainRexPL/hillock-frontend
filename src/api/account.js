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
  verifyPasswordReset({ token }) {
    return rawAxios.get(`/account/reset/verify/${encodeURIComponent(token)}`)
  },
  performPasswordReset({ token, data }) {
    return rawAxios.post(`/account/reset/perform/${encodeURIComponent(token)}`, data)
  }
}
