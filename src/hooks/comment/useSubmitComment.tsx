import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

// Interface payload sesuai dengan struct CommentCreateRequest di backend
export interface CommentPayload {
  ticket_id: number;
  category_id: number;
  sub_category_id: number;
  item_id: number;
  type: string;
  description: string;
}

const useSubmitComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CommentPayload) => {
      const token = Cookies.get('token');
      
      const response = await Api.post('/api/comments', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    },
    onSuccess: () => {
      // Refresh list tiket di dashboard
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export default useSubmitComment;