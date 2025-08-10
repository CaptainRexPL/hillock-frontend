import axios from './axios'

export const profileApi = {
  get(params) {
    return axios.get('/profile/', { params })
  },
  update(data) {
    return axios.put('/profile/', data)
  },
  updateById(id, data) {
    return axios.put(`/profile/${id}`, data)
  },
  getLeaderboard(limit) {
    return axios.get('/profile/leaderboard', { params: { limit } })
  },
  getMe() {
    return axios.get('/profile/me')
  },
  addRole(id, data) {
    return axios.post(`/profile/role/${id}`, data)
  },
  removeRole(id, data) {
    return axios.delete(`/profile/role/${id}`, { data })
  },
}
