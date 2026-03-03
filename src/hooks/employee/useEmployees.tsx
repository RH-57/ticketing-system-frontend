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
  branch: Branch
  division: Division
  department: Department
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface PaginatedEmployeeResponse {
  success: boolean
  message: string
  data: Employee[]
  meta: PaginationMeta
}

const useEmployees = (page: number, perPage: number = 10) => {
  return useQuery<PaginatedEmployeeResponse, Error>({
    queryKey: ["employees", page, perPage],

    queryFn: async () => {
      const token = Cookies.get("token")

      const response = await Api.get(
        `/api/employees?page=${page}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return response.data
    },

    placeholderData: (previousData) => previousData,
  })
}

export default useEmployees