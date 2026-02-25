import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";
import { AxiosError } from "axios";

export interface DivisionUpdateRequest {
    id: number
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

const useDivisionUpdate = (branchId: string) => {
  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,   // ✅ ERROR TYPE DISET DI SINI
    DivisionUpdateRequest
  >({
    mutationFn: async (data) => {
      const response = await Api.put(
        `/api/branches/${branchId}/divisions/${data.id}`,
        data
      )
      return response.data
    }
  })
}

export default useDivisionUpdate