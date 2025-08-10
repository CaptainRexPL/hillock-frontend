import axios from './axios'

export const inviteApi = {
  getAll() {
    return axios.get('/invites')
  },
  getById(id) {
    return axios.get(`/invites/${id}`)
  },
  getByCode(inviteCode) {
    return axios.get(`/invites/code/${inviteCode}`)
  },
  create(invite) {
    return axios.post('/invites', invite)
  },
  update(id, invite) {
    return axios.put(`/invites/${id}`, invite)
  },
  delete(id) {
    return axios.delete(`/invites/${id}`)
  },
}
