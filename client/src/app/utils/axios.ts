import axios from 'axios'

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000'
      : window.location.host,
  withCredentials: true,
})

export default instance
