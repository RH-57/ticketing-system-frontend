import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import api from "../../services/api"

export interface EmployeeRequest {
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
}

const useEmployeeUpdate = () => {
  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    EmployeeRequest
  >({
    mutationFn: async (data) => {
      const response = await api.put(`/api/employees/${data.id}`, data)
      return response.data
    },
  })
}

export default useEmployeeUpdate