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
  // tambahkan field lain kalau ada
}

interface ApiErrorResponse {
  message?: string
}

const useUserById = (id: number | null, enabled: boolean = true) => {
  return useQuery<UserDetail, AxiosError<ApiErrorResponse>>({
    queryKey: ["user", id],
    queryFn: async () => {
      const token = Cookies.get("token")

      const response = await Api.get(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    },
    enabled: !!id && enabled, // hanya fetch kalau ada id
  })
}

export default useUserById