import { useMutation } from "@tanstack/react-query"
import Api from "../../services/api"
import { AxiosError } from "axios"

export interface ValidationErrors {
  current_password?: string[]
  new_password?: string[]
  confirm_password?: string[]
}

export interface ErrorResponse {
  message: string
  errors?: ValidationErrors
}

interface Payload {
  current_password: string
  new_password: string
  confirm_password: string
}

const useChangePassword = () => {
  return useMutation<void, AxiosError<ErrorResponse>, Payload>({
    mutationFn: async (data) => {
      await Api.put("/api/users/change-password", data)
    },
  })
}

export default useChangePassword