import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || window.__API_BASE_URL__ || window.location.origin

export const api = axios.create({
  baseURL,
  withCredentials: true,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err)
  }
)
