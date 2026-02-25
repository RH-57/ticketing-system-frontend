import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";
import { AxiosError } from "axios";

export interface DivisionCreateRequest {
    code: string
    name: string
}

export interface ValidationErrors {
    code?: string[]
    name?: string[]
}

export interface ErrorResponse {
    errors?: ValidationErrors
}

const useDivisionCreate = (branchId: string) => {
    return useMutation<
        unknown,
        AxiosError<ErrorResponse>,
        DivisionCreateRequest
        >({
        mutationFn: async (data: DivisionCreateRequest) => {
            const response = await Api.post(
                `/api/branches/${branchId}/divisions`,
                data
            )

            return response.data
        }
    })
}

export default useDivisionCreate