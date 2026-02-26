import { useMutation } from "@tanstack/react-query"
import Api from "../../services/api"
import { AxiosError } from "axios"

export interface EmployeeCreateRequest {
  name: string
  department_id: number
}

export interface ValidationErrors {
  name?: string[]
  department_id?: string[]
}

export interface ErrorResponse {
  success: boolean
  errors?: ValidationErrors
  message?: string
}

const useEmployeeCreate = () => {
  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    EmployeeCreateRequest
  >({
    mutationFn: async (data: EmployeeCreateRequest) => {
      const response = await Api.post("/api/employees", data)
      return response.data
    }
  })
}

export default useEmployeeCreate