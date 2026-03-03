import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

export interface SubCategory {
  id: number
  name: string
  slug: string
  category_id: number
}

const useSubCategories = (categoryId: string) => {
  return useQuery<SubCategory[], Error>({
    queryKey: ["subcategories", categoryId],

    enabled: !!categoryId,

    queryFn: async () => {
      const token = Cookies.get("token");

      const response = await Api.get(
        `/api/categories/${categoryId}/sub-categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data as SubCategory[];
    },
  });
};

export default useSubCategories;