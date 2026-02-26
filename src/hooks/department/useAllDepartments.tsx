// hooks/department/useAllDepartments.ts
import { useQuery } from "@tanstack/react-query"
import Api from "../../services/api"
import Cookies from "js-cookie"

export interface Division {
  id: number
  name: string
}

export interface Department {
  id: number
  name: string
  division: Division
}

const useAllDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const token = Cookies.get("token")

      const res = await Api.get("/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      })

      return res.data.data as Department[]
    },
  })
}

export default useAllDepartments