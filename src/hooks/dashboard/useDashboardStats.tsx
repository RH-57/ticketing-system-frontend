import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

export interface MonthlyTrend {
    month: string;
    total: number;
}

// Interface sesuai dengan DashboardStatsResponse di backend
export interface DashboardStats {
    total_tickets: number;
    tickets_this_year: number;
    open_tickets: number;
    resolved_tickets: number;
    sla: number;
    monthly_trend: MonthlyTrend[];
}

const useDashboardStats = () => {
    return useQuery<DashboardStats, Error>({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const token = Cookies.get('token');
            const response = await Api.get('/api/dashboard/stats', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Mengambil field 'data' dari SuccessResponse backend
            return response.data.data;
        },
        // Statistik dashboard sebaiknya di-refresh setiap kali user kembali ke tab
        staleTime: 1000 * 60 * 5, // 5 menit
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: false,
    });
};

export default useDashboardStats;