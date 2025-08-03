import axios from './axios'

export const inviteApi = {
  getAll() {
    return axios.get('/api/invites')
  },
  getById(id) {
    return axios.get(`/api/invites/${id}`)
  },
  getByCode(inviteCode) {
    return axios.get(`/api/invites/code/${inviteCode}`)
  },
  create(invite) {
    return axios.post('/api/invites', invite)
  },
  update(id, invite) {
    return axios.put(`/api/invites/${id}`, invite)
  },
  delete(id) {
    return axios.delete(`/api/invites/${id}`)
  },
}
