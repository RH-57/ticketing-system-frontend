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
  errors?: ValidationErrors
}

const useEmployeeCreate = () => {
  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    EmployeeCreateRequest
  >({
    mutationFn: async (data) => {
      const response = await Api.post("/api/employees", data)
      return response.data
    },
  })
}

export default useEmployeeCreate