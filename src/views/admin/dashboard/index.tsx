import { FC, useEffect } from "react";
import { useAuthUser } from "../../../hooks/auth/useAuthUser";
import useDashboardStats from "../../../hooks/dashboard/useDashboardStats";
import useTickets from "../../../hooks/ticket/useTicket";
import StatsSection from "./components/StatsSection";
import TaskSection from "./components/TaskSection"; // Import komponen baru
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Left Column: Statistics */}
        <div className="lg:col-span-1 space-y-2 items-start"> 
            <section>
                <StatsSection stats={stats} isLoading={statsLoading} />
            </section>
            
            <section>
              <TaskSection tickets={tickets} isLoading={ticketsLoading} />
            </section>
        </div>

        <div className="lg:col-span-1">
          <SLASection value={stats?.sla} isLoading={statsLoading} />
        </div>

        {/* Right Column: Chart */}
        <div className="lg:col-span-2 space-y-2 items-start">
            <TicketChart data={stats?.monthly_trend} isLoading={statsLoading} />
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