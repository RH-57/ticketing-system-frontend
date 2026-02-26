import { useQuery } from "@tanstack/react-query"
import Api from "../../services/api"
import Cookies from "js-cookie"

export interface Branch {
  id: number
  name: string
}

export interface Division {
  id: number
  name: string
}

export interface Department {
  id: number
  name: string
}

export interface Employee {
  id: number
  name: string
  branch_id: number
  division_id: number
  department_id: number
  branch: Branch
  division: Division
  department: Department
}

const useEmployees = () => {
  return useQuery<Employee[], Error>({
    queryKey: ["employees"],

    queryFn: async () => {
      const token = Cookies.get("token")

      const response = await Api.get("/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data.data as Employee[]
    },
  })
}

export default useEmployees