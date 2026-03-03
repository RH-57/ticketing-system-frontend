import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";
import { AxiosError } from "axios";

export interface SubCategoryUpdateRequest {
  id: number;
  name: string;
  slug: string;
}

export interface ValidationErrors {
  name?: string[];
  slug?: string[];
}

export interface ErrorResponse {
  errors?: ValidationErrors;
}

const useSubCategoryUpdate = (categoryId: string) => {
  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    SubCategoryUpdateRequest
  >({
    mutationFn: async (data) => {
      const response = await Api.put(
        `/api/categories/${categoryId}/sub-categories/${data.id}`,
        data
      );

      return response.data;
    },
  });
};

export default useSubCategoryUpdate;