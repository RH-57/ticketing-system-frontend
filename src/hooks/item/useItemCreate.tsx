import { useMutation, useQueryClient } from "@tanstack/react-query"
import Api from "../../services/api"
import { Item } from "./useItems"
import { AxiosError } from "axios"

export interface ValidationErrors {
  name?: string[]
}

export interface ErrorResponse {
  message: string
  errors?: ValidationErrors
}

interface CreateItemPayload {
  name: string
  categoryId: string
  subCategoryId: string
}

const useItemCreate = () => {
  const queryClient = useQueryClient()

  return useMutation<
    Item,
    AxiosError<ErrorResponse>,
    CreateItemPayload
  >({
    mutationFn: async ({ name, categoryId, subCategoryId }) => {
      const response = await Api.post(
        `/api/categories/${categoryId}/sub-categories/${subCategoryId}/items`,
        { name }
      )

      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["items", variables.categoryId, variables.subCategoryId],
      })
    },
  })
}

export default useItemCreate