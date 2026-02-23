import { useMutation, useQueryClient } from "@tanstack/react-query"
import Api from "../../services/api"
import Cookies from "js-cookie"

const useBranchDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const token = Cookies.get("token")

      const response = await Api.delete(`/api/branches/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] })
    },
  })
}

export default useBranchDelete