import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";

export interface Item {
    id: number
    name: string
    subCategoryId: number
}

const useItems = (categoryId?: string, subCategoryId?: string) => {
    return useQuery<Item[], Error>({
        queryKey: ["items", categoryId, subCategoryId],
        enabled: !!categoryId && !!subCategoryId,
        queryFn: async () => {
            const response = await Api.get(
                `/api/categories/${categoryId}/sub-categories/${subCategoryId}/items`,
            )

            return response.data.data
        },
    })
}

export default useItems