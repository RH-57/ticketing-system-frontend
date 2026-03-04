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

interface UpdateItemPayload {
  id: number
  name: string
  categoryId: string
  subCategoryId: string
}

const useItemUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation<
    Item,
    AxiosError<ErrorResponse>,   // ✅ FIX DI SINI
    UpdateItemPayload
  >({
    mutationFn: async ({ id, name, categoryId, subCategoryId }) => {
      const response = await Api.put(
        `/api/categories/${categoryId}/sub-categories/${subCategoryId}/items/${id}`,
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

export default useItemUpdate