import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

// Interface ini disesuaikan persis dengan TicketDetailResponse dari struct Golang-mu
export interface TicketDetail {
    id: number;
    ticket_number: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    employee: {
        id: number;
        name: string;
    };
    created_by: {
        id: number;
        email: string;
    };
    branch: string;
    division: string;
    department: string;
    created_at: string;
}

const useTicketDetail = (ticket_number: string) => {
    return useQuery<TicketDetail, Error>({
        // Gunakan array dengan id agar React Query membedakan cache setiap tiket
        queryKey: ['ticket', ticket_number],

        queryFn: async () => {
            const token = Cookies.get('token');

            const response = await Api.get(`/api/tickets/${ticket_number}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.data as TicketDetail;
        },
        
        // Fitur ini mencegah React Query menembak API jika id bernilai 0, null, atau undefined
        // Sangat berguna karena saat modal edit ditutup, ID biasanya diset kembali ke null/0
        enabled: !!ticket_number && ticket_number !== "",
        staleTime: 0, 
    });
}

export default useTicketDetail;