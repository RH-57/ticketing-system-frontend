import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

export interface Category {
    id: number
    name: string
    slug: string
}

const useCategories = () => {
    return useQuery<Category[], Error>({
        queryKey: ['categories'],
        queryFn: async () => {
            const token = Cookies.get('token')

            const response = await Api.get('/api/categories', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            return response.data.data as Category[]
        }
    })
}

export default useCategories