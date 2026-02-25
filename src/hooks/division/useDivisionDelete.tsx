import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

const useDivisionDelete = (branchId: string) => {
    return useMutation({
        mutationFn: async (divisionId: number) => {
            const token = Cookies.get('token')

            const response = await Api.delete(
                `/api/branches/${branchId}/divisions/${divisionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            return response.data
        }
    })
}

export default useDivisionDelete