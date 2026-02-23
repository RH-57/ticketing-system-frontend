import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

export interface Branch {
    id: number
    code: string
    name: string
}

const useBranches = () => {
    return useQuery<Branch[], Error>({
        queryKey: ['branches'],

        queryFn: async () => {
            const token = Cookies.get('token')

            const response = await Api.get('/api/branches', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            return response.data.data as Branch[]
        }
    })
}

export default useBranches