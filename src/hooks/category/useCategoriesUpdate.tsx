import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import Api from "../../services/api"

export interface CategoryUpdateRequest {
  id: number
  name: string
}

export interface ValidationErrors {
  name?: string[]
  slug?: string[]
}

export interface ErrorResponse {
  errors?: ValidationErrors
}

const useCategoryUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    CategoryUpdateRequest
  >({
    mutationFn: async ({ id, name }) => {
      const response = await Api.put(`/api/categories/${id}`, { name })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export default useCategoryUpdate