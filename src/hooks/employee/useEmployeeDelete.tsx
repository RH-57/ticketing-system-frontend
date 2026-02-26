import { useMutation, useQueryClient } from "@tanstack/react-query"
import Api from "../../services/api"
import Cookies from "js-cookie"

const useDeleteEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const token = Cookies.get("token")

      const response = await Api.delete(
        `/api/employees/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return response.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    },
  })
}

export default useDeleteEmployee