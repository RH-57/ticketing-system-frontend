import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

// Interface Payload sesuai struct backend
export interface TicketCreatePayload {
  title: string;
  description: string;
  employee_id: number;
  priority: string; // LOW, MEDIUM, HIGH
}

// Interface untuk menangkap error validasi dari backend (seperti di useUserCreate)
interface ApiErrorResponse {
  errors: Record<string, string[]>;
}

const useTicketCreate = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>, // Menambahkan penanganan error Axios
    TicketCreatePayload
  >({
    mutationFn: async (data: TicketCreatePayload) => {
      const token = Cookies.get("token");

      const response = await Api.post("/api/tickets", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },

    onSuccess: () => {
      // Invalidate cache agar tabel otomatis refresh
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export default useTicketCreate;