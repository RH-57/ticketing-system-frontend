import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import Api from "../../services/api"

interface ErrorResponse {
  message?: string
}

const useCategoryDelete = () => {
  const queryClient = useQueryClient()

  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    number
  >({
    mutationFn: async (id: number) => {
      const response = await Api.delete(`/api/categories/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export default useCategoryDelete