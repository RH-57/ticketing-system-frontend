import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";
import { AxiosError } from "axios";

export interface ErrorResponse {
  message?: string;
}

const useSubCategoryDelete = (categoryId: string) => {
  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    number
  >({
    mutationFn: async (id: number) => {
      const response = await Api.delete(
        `/api/categories/${categoryId}/sub-categories/${id}`
      );

      return response.data;
    },
  });
};

export default useSubCategoryDelete;