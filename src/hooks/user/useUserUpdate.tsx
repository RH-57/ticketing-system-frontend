import { useMutation, useQueryClient } from "@tanstack/react-query"
import Api from "../../services/api"
import Cookies from "js-cookie"
import { AxiosError } from "axios"

export interface UserUpdateRequest {
  id: number
  name: string
  username: string
  email: string
  role: string
  is_active: boolean
  password?: string // optional kalau tidak selalu diubah
}

interface ApiErrorResponse {
  errors?: Record<string, string>
  message?: string
}

const useUserUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    UserUpdateRequest
  >({
    mutationFn: async ({ id, ...data }) => {
      const token = Cookies.get("token")

      const response = await Api.put(`/api/users/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    },

    onSuccess: (_, variables) => {
      // invalidate list users
      queryClient.invalidateQueries({ queryKey: ["users"] })

      // invalidate detail user
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] })
    },
  })
}

export default useUserUpdate