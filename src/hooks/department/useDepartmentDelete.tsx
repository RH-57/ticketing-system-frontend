import { useMutation, useQueryClient } from "@tanstack/react-query"
import Api from "../../services/api"
import { AxiosError } from "axios"

const useDepartmentDelete = (
  branchId: string,
  divisionId: string
) => {
  const queryClient = useQueryClient()

  return useMutation<
    unknown,
    AxiosError,
    string // departmentId
  >({
    mutationFn: async (departmentId: string) => {
      const response = await Api.delete(
        `/api/branches/${branchId}/divisions/${divisionId}/departments/${departmentId}`
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

export default useDepartmentDelete