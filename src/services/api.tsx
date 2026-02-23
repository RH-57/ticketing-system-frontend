import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig
} from 'axios'
import Cookies from 'js-cookie'

interface RefreshResponse {
  access_token: string
}

const Api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
})

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
*/

Api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('token')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  }
)

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR (AUTO REFRESH)
|--------------------------------------------------------------------------
*/

let isRefreshing = false

let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else if (token) {
      promise.resolve(token)
    }
  })

  failedQueue = []
}

Api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return Api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {

        const response = await axios.post<RefreshResponse>(
          'http://localhost:3000/api/refresh',
          {},
          { withCredentials: true }
        )

        const newToken = response.data.access_token

        Cookies.set('token', newToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }

        processQueue(null, newToken)

        return Api(originalRequest)

      } catch (err) {

        processQueue(err, null)

        Cookies.remove('token')
        Cookies.remove('user')

        window.location.href = '/login'

        return Promise.reject(err)

      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default Api