import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

// Interface untuk List Ticket (Sesuai dengan TicketListResponse)
export interface Ticket {
    id: number;
    ticket_number: string;
    title: string;
    priority: string;
    employee_name: string;
    created_by?: {
        id: number;
        name: string;
    };
    status: string;
}

const useTickets = () => {
    return useQuery<Ticket[], Error>({
        queryKey: ['tickets'],

        queryFn: async () => {
            const token = Cookies.get('token');

            // Asumsi endpoint backend-mu adalah '/api/tickets'
            const response = await Api.get('/api/tickets', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Mengembalikan array dari tiket
            return response.data.data as Ticket[];
        }
    });
}

export default useTickets;