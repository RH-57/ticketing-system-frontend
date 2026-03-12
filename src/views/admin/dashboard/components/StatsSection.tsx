import { FC } from "react";
import { Ticket, Calendar, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { DashboardStats } from "../../../../hooks/dashboard/useDashboardStats";

interface StatsSectionProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

const StatsSection: FC<StatsSectionProps> = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      <StatCard
        title="Total Tickets"
        value={stats?.total_tickets}
        loading={isLoading}
        icon={<Ticket size={18} />}
        colorClass="bg-blue-500/10 border-blue-500/20 text-blue-400"
      />
      <StatCard
        title="This Year"
        value={stats?.tickets_this_year}
        loading={isLoading}
        icon={<Calendar size={18} />}
        colorClass="bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
      />
      <StatCard
        title="Open"
        value={stats?.open_tickets}
        loading={isLoading}
        icon={<AlertCircle size={18} />}
        colorClass="bg-red-500/10 border-red-500/20 text-red-400"
      />
      <StatCard
        title="Resolved"
        value={stats?.resolved_tickets}
        loading={isLoading}
        icon={<CheckCircle size={18} />}
        colorClass="bg-green-500/10 border-green-500/20 text-green-400"
      />
    </div>
  );
};

// --- INTERNAL STAT CARD ---
interface StatCardProps {
  title: string;
  value?: number;
  loading: boolean;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, loading, icon, colorClass }) => (
  <div className={`p-4 rounded-xl border bg-gray-900 flex flex-col justify-between transition-all hover:border-gray-600 ${colorClass}`}>
    <div className="flex items-center justify-between mb-3">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter opacity-80">{title}</p>
      <div className="p-1.5 rounded-lg bg-gray-800/40">{icon}</div>
    </div>
    <div>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-700" />
      ) : (
        <h2 className="text-xl font-bold text-white tracking-tight leading-none">
          {value?.toLocaleString() || 0}
        </h2>
      )}
    </div>
  </div>
);

export default StatsSection;