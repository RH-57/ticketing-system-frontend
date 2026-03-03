import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";
import { AxiosError } from "axios";

export interface SubCategoryCreateRequest {
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

const useSubCategoryCreate = (categoryId: string) => {
  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    SubCategoryCreateRequest
  >({
    mutationFn: async (data: SubCategoryCreateRequest) => {
      const response = await Api.post(
        `/api/categories/${categoryId}/sub-categories`,
        data
      );

      return response.data;
    },
  });
};

export default useSubCategoryCreate;