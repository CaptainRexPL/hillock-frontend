import axios from './axios'

export const profileApi = {
  get(params) {
    return axios.get('/api/profile/', { params })
  },
  update(data) {
    return axios.put('/api/profile/', data)
  },
  updateById(id, data) {
    return axios.put(`/api/profile/${id}`, data)
  },
  getLeaderboard(limit) {
    return axios.get('/api/profile/leaderboard', { params: { limit } })
  },
  getMe() {
    return axios.get('/api/profile/me')
  },
  addRole(id, data) {
    return axios.post(`/api/profile/role/${id}`, data)
  },
  removeRole(id, data) {
    return axios.delete(`/api/profile/role/${id}`, { data })
  },
}
