import { useMutation, useQueryClient } from "@tanstack/react-query"
import Api from "../../services/api"
import Cookies from "js-cookie"
import { AxiosError } from "axios"

interface ApiErrorResponse {
  message?: string
}

const useUserDelete = () => {
  const queryClient = useQueryClient()

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    number
  >({
    mutationFn: async (id: number) => {
      const token = Cookies.get("token")

      const response = await Api.delete(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    },

    onSuccess: () => {
      // refresh list users
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export default useUserDelete