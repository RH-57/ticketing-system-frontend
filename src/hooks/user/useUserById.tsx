import { useQuery } from "@tanstack/react-query"
import Api from "../../services/api"
import Cookies from "js-cookie"
import { AxiosError } from "axios"

export interface UserDetail {
  id: number
  name: string
  username: string
  email: string
  role: string
  is_active: boolean
}

interface ApiResponse {
  success: boolean
  message: string
  data: UserDetail
}

interface ApiErrorResponse {
  message?: string
}

const useUserById = (id: number | null, enabled: boolean = true) => {
  return useQuery<UserDetail, AxiosError<ApiErrorResponse>>({
    queryKey: ["user", id],
    queryFn: async () => {
      const token = Cookies.get("token")

      const response = await Api.get<ApiResponse>(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // 🔥 INI YANG PENTING
      return response.data.data
    },
    enabled: !!id && enabled,
  })
}

export default useUserById