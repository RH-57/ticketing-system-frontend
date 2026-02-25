import { useMutation } from "@tanstack/react-query"
import Api from "../../services/api"
import { AxiosError } from "axios"

export interface DepartmentCreateRequest {
  name: string
}

export interface ValidationErrors {
  name?: string[]
}

export interface ErrorResponse {
  errors?: ValidationErrors
}

const useDepartmentCreate = (
  branchId: string,
  divisionId: string
) => {
  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    DepartmentCreateRequest
  >({
    mutationFn: async (data: DepartmentCreateRequest) => {
      const response = await Api.post(
        `/api/branches/${branchId}/divisions/${divisionId}/departments`,
        data
      )

      return response.data
    },
  })
}

export default useDepartmentCreate