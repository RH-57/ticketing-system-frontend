import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

const useTicketDelete = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        // mutationFn menerima ID tiket yang akan dihapus
        mutationFn: async (ticket_number: string) => {
            const token = Cookies.get('token');

            // Memanggil endpoint DELETE backend
            await Api.delete(`/api/tickets/${ticket_number}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        
        // Otomatis refresh data tabel setelah berhasil dihapus
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
        }
    });
}

export default useTicketDelete;