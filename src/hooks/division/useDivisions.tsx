import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

export interface Division {
    id: number
    code: string
    name: string
    branch_id: number
}

const useDivisions = (branchId: string) => {
    return useQuery<Division[], Error>({
        queryKey: ['divisions', branchId],

        enabled: !!branchId,

        queryFn: async () => {
            const token = Cookies.get('token')

            const response = await Api.get(`/api/branches/${branchId}/divisions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            return response.data.data as Division[]
        }
    })
}

export default useDivisions