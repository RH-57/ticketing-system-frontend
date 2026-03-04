import { useMutation, useQueryClient } from "@tanstack/react-query"
import Api from "../../services/api"

interface DeleteItemPayload {
    id: number
    categoryId: string
    subCategoryId: string
}

const useItemDelete = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, DeleteItemPayload>({
        mutationFn: async ({ id, categoryId, subCategoryId }) => {
            await Api.delete(
                `/api/categories/${categoryId}/sub-categories/${subCategoryId}/items/${id}`
            )
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["items", variables.categoryId, variables.subCategoryId],
            })
        },
    })
}

export default useItemDelete