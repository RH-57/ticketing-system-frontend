import { useMutation, useQueryClient } from "@tanstack/react-query"
import Api from "../../services/api"
import { AxiosError } from "axios"

export interface DepartmentUpdateRequest {
  name: string
}

export interface ValidationErrors {
  name?: string[]
}

export interface ErrorResponse {
  errors?: ValidationErrors
}

const useDepartmentUpdate = (
  branchId: string,
  divisionId: string,
  departmentId: string
) => {
  const queryClient = useQueryClient()

  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    DepartmentUpdateRequest
  >({
    mutationFn: async (data: DepartmentUpdateRequest) => {
      const response = await Api.put(
        `/api/branches/${branchId}/divisions/${divisionId}/departments/${departmentId}`,
        data
      )
      return response.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments", branchId, divisionId],
      })
    },
  })
}

export default useDepartmentUpdate