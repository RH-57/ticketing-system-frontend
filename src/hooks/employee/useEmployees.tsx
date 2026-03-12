import { useQuery, keepPreviousData } from "@tanstack/react-query"
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

// Tambahkan parameter 'search' ke dalam hook
const useEmployees = (page: number = 1, perPage: number = 10, search: string = "") => {
  return useQuery<PaginatedEmployeeResponse, Error>({
    // Tambahkan 'search' ke queryKey agar React Query fetch ulang saat user mengetik
    queryKey: ["employees", page, perPage, search],

    queryFn: async () => {
      const token = Cookies.get("token")

      const response = await Api.get("/api/employees", {
        params: {
          page: page,
          per_page: perPage,
          search: search, // Mengirim query string ?search=... ke backend
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    },

    // placeholderData diganti menjadi keepPreviousData (syntax Tanstack Query v5)
    // Ini berguna agar UI tidak "flicker" saat berpindah halaman atau mencari
    placeholderData: keepPreviousData, 
    
    // Opsional: Jika sedang di modal ticket, jangan fetch kalau modal belum terbuka
    enabled: true, 
  })
}

export default useEmployees