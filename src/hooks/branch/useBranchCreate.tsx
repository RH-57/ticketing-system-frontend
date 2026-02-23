import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import api from "../../services/api"

export interface BranchRequest {
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

const useBranchCreate = () => {
  return useMutation<
    unknown,                        // success response type
    AxiosError<ErrorResponse>,      // error type
    BranchRequest                   // request body type
  >({
    mutationFn: async (data: BranchRequest) => {
      const response = await api.post("/api/branches", data)
      return response.data
    },
  })
}

export default useBranchCreate