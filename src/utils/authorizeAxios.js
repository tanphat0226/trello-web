import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { refreshTokenAPI } from '~/apis'

// How can I use the Redux store in non-component files?
// (Inject Store) https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
let axiosReduxStore
export const injectStore = (store) => {
  axiosReduxStore = store
}

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

// Khởi tạo promise cho việc gọi api refresh token
// Dùng để khi nào gọi api refresh token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó
// https://www.thedutchlab.com/insights/using-axios-interceptors-for-refreshing-your-api-token
let refreshTokenPromise = null

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

    // Handle auto refresh token
    // Case 1: If receive 401 error from server
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }

    // Case 2: If receive 410 error from server
    // - GONE serves to automatically refresh tokens
    const originalRequests = error.config

    if (error.response?.status === 410 && !originalRequests._retry) {
      // Assign _retry value = true in wait time,  Ensure call only once to refresh token in same time
      originalRequests._retry = true

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // Đồng thời accessToken exits in httpOnly cookie (provide by server)
            return data?.accessToken
          })
          .catch(() => {
            // If receive any error from refresh token, logout user
            axiosReduxStore.dispatch(logoutUserAPI(false))
          })
          .finally(() => {
            // Wether api refresh token success or not always reassign refreshTokenPromise = null
            refreshTokenPromise = null
          })
      }

      // Need return case refreshTokenPromise to run successfully and handle more here
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then((accessToken) => {
        // Step 1: If want to save new accessToken to localStorage or some other place, do it here
        // authorizeAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        // Step 2: Return axios instance combine with originalRequest for call api error again
        return authorizeAxiosInstance(originalRequests)
      })
    }

    // Handle centralize error message from any API returned error
    let errorMessage = error?.message
    if (error?.response?.data?.message) {
      errorMessage = error?.response?.data?.message
    }

    // Use toastify to display error message on screen. Except 410 code - GONE serves to automatically refresh tokens
    if (error?.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default authorizeAxiosInstance
