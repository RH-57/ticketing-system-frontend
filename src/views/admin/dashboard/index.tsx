import { FC, useEffect } from "react";
import { useAuthUser } from "../../../hooks/auth/useAuthUser";
import useDashboardStats from "../../../hooks/dashboard/useDashboardStats";
import useTickets from "../../../hooks/ticket/useTicket";
import StatsSection from "./components/StatsSection";
import TaskSection from "./components/TaskSection";
import SLASection from "./components/SLASection";
import TicketChart from "./components/TicketChart";

const Dashboard: FC = () => {
  const user = useAuthUser();
  const { data: stats, isLoading: statsLoading, isError } = useDashboardStats();
  const { data: tickets, isLoading: ticketsLoading } = useTickets();

  useEffect(() => {
    document.title = "Dashboard - Ticketing System";
  }, []);

  return (
    <div className="space-y-4 pb-6 font-inter">
      {/* Welcome Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Welcome back, <span className="text-yellow-600 font-semibold">{user?.name}</span>!
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="space-y-2">
        
        {/* BARIS 1: Stats & Chart Bersebelahan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-2">

            <StatsSection stats={stats} isLoading={statsLoading} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="h-[248px]">
                <TaskSection tickets={tickets} isLoading={ticketsLoading} />
              </div>

              <div className="h-[248px]">
                <SLASection value={stats?.sla} isLoading={statsLoading} />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="h-full">
            <TicketChart data={stats?.monthly_trend} isLoading={statsLoading} />
          </div>

        </div>

      </div>

      {isError && (
        <p className="text-red-500 text-[10px] italic text-center">
          Failed to load dashboard data. Please try refreshing the page.
        </p>
      )}
    </div>
  );
};

export default Dashboard;