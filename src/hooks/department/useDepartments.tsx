import { useQuery } from "@tanstack/react-query"
import Api from "../../services/api"
import Cookies from "js-cookie"

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
      const token = Cookies.get("token")

      const response = await Api.get(
        `/api/branches/${branchId}/divisions/${divisionId}/departments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return response.data.data
    },
  })
}

export default useDepartments