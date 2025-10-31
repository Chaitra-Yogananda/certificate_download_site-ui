import { api } from './api'

export async function validateUser(email, courseCode) {
  const res = await api.post('/api/certificates/validate-user', { email, courseCode })
  return res.data
}

export async function getDetails(email, courseCode, includeTemplate = false) {
  const res = await api.get('/api/certificates/details', {
    params: { email, courseCode, includeTemplate },
  })
  return res.data
}

export async function generate(email, courseCode) {
  const res = await api.post(
    '/api/certificates/generate',
    { email, courseCode },
    { responseType: 'blob' }
  )
  return res.data
}
