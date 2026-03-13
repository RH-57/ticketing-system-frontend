import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api"; // Sesuaikan path jika berbeda
import Cookies from "js-cookie";

// Interface untuk data yang akan dikirim ke backend
interface UpdateStatusPayload {
  ticket_number: string;
  status: string;
}

const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticket_number, status }: UpdateStatusPayload) => {
      const token = Cookies.get('token');
      
      const response = await Api.put(`/api/tickets/${ticket_number}/status`, 
        { status }, // Request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    },
    
    // onSuccess akan dipanggil otomatis jika API mengembalikan response sukses (200 OK)
    onSuccess: (_, variables) => {
      // 1. Refresh data list tiket di TaskSection
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      
      // 2. Refresh data detail tiket yang sedang dibuka di Modal
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.ticket_number] });
    },
  });
};

export default useUpdateTicketStatus;