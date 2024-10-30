import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'

//  Khởi tạo đối tượng Axios (authorizeAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizeAxiosInstance = axios.create()

// Maximum waiting time of 1 request: recommended 10 minutes
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: Allow axios automatically send cookies with requests to the server (for save JWT token to httpOnly cookie)
authorizeAxiosInstance.defaults.withCredentials = true

// Config Axios Interceptor (https://axios-http.com/docs/interceptors)
// Add a request interceptor
authorizeAxiosInstance.interceptors.request.use(
  (config) => {
    // Click spam blocking techniques
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
authorizeAxiosInstance.interceptors.response.use(
  (response) => {
    // Click spam blocking techniques
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Each http status code not 2xx will trigger this function
    // Click spam blocking techniques
    interceptorLoadingElements(false)

    // Handle centralize error message from any API returned error
    let errorResponse = error?.message

    if (error?.response?.data?.message) {
      errorResponse = error?.response?.data?.message
    }

    // Use toastify to display error message on screen. Except 410 code - GONE serves to automatically refresh tokens
    if (error?.response?.status !== 410) {
      toast.error(errorResponse)
    }

    return Promise.reject(error)
  }
)

export default authorizeAxiosInstance
