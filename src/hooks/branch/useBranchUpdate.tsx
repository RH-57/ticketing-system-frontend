import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import api from "../../services/api"

export interface BranchRequest {
  id: number
  code: string
  name: string
}

export interface ValidationErrors {
  code?: string[]
  name?: string[]
}

export interface ErrorResponse {
  errors?: ValidationErrors
}

const useBranchUpdate = () => {
  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    BranchRequest
  >({
    mutationFn: async (data) => {
      const response = await api.put(`/api/branches/${data.id}`, data)
      return response.data
    },
  })
}

export default useBranchUpdate