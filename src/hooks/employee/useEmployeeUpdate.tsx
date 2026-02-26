import { useMutation } from "@tanstack/react-query"
import Api from "../../services/api"
import { AxiosError } from "axios"

export interface EmployeeUpdateRequest {
  id: number
  name: string
  department_id: number
}

export interface ValidationErrors {
  name?: string[]
  department_id?: string[]
}

export interface ErrorResponse {
  errors?: ValidationErrors
  message?: string
}

const useUpdateEmployee = () => {
  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    EmployeeUpdateRequest
  >({
    mutationFn: async ({ id, ...data }: EmployeeUpdateRequest) => {
      const response = await Api.put(`/api/employees/${id}`, data)
      return response.data
    }
  })
}

export default useUpdateEmployee