import axios from './axios'

export const accountApi = {
  createAccount(data) {
    return axios.post('/api/account/create', data)
  },
  login(data) {
    return axios.post('/api/account/login', data)
  },
  refreshToken(data) {
    return axios.post('/api/account/refreshToken', data)
  },
}
