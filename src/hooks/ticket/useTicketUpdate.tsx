import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

// 1. Definisikan interface request yang bersih (mengikuti pola UserUpdateRequest)
export interface TicketUpdateRequest {
  ticket_number: string;
  data: {
    title: string;
    description: string;
    employee_id?: number;
    status: string;
    priority: string;
  };
}

interface ApiErrorResponse {
  errors: Record<string, string[]>;
}

const useTicketUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown, 
    AxiosError<ApiErrorResponse>, 
    TicketUpdateRequest
  >({
    // mutationFn menerima payload tunggal
    mutationFn: async (payload: TicketUpdateRequest) => {
      const token = Cookies.get("token");

      const response = await Api.put(
        `/api/tickets/${payload.ticket_number}`, 
        payload.data, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },

    // Invalidate queries agar data di tabel & modal detail sinkron
    onSuccess: (_, variables) => {
      // Refresh list utama
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      
      // Refresh cache spesifik untuk ticket ini
      queryClient.invalidateQueries({ 
        queryKey: ["ticket", variables.ticket_number] 
      });
    },
  });
};

export default useTicketUpdate;