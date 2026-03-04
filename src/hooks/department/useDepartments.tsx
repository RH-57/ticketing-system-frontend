import { useQuery } from "@tanstack/react-query"
import Api from "../../services/api"

export interface Department {
  id: number
  name: string
  division_id: number
}

const useDepartments = (branchId?: string, divisionId?: string) => {
  return useQuery<Department[], Error>({
    queryKey: ["departments", branchId, divisionId],

    enabled: !!branchId && !!divisionId,

    queryFn: async () => {
      const response = await Api.get(
        `/api/branches/${branchId}/divisions/${divisionId}/departments`,
      )

      return response.data.data
    },
  })
}

export default useDepartments