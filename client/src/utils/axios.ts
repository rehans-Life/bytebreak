import axios from 'axios'

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YzBkMmQ2NTNiYWQ3ODNiNWRjNDFiYyIsImlhdCI6MTcwNzE0MzQxMCwiZXhwIjoxNzE0OTE5NDEwfQ.CziyQEfXC4LCzisbhN9UkRyINLMeX-98tRmTeX5yfKM"


const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000'
      : window.location.host,
  withCredentials: true,
  headers: {
    "Authorization": `Bearer ${token}`
  }
})

export default instance
