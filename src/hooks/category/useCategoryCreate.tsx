import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Api from "../../services/api";

export interface CategoryRequest {
    name: string
}

export interface ValidationErrors {
    name?: string[]
    slug?: string[]
}

export interface ErrorResponse {
    errors?: ValidationErrors
}

const useCategoryCreate = () => {
    return useMutation<
        unknown,
        AxiosError<ErrorResponse>,
        CategoryRequest
    >({
        mutationFn: async (data: CategoryRequest) => {
            const response = await Api.post("/api/categories", data)
            return response.data
        }
    })
}

export default useCategoryCreate