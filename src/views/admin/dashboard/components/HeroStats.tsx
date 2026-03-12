import { FC } from "react";
import { Ticket, Calendar, AlertCircle, CheckCircle, Gauge, Loader2 } from "lucide-react";
import { DashboardStats } from "../../../../hooks/dashboard/useDashboardStats";

interface HeroStatsProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

const HeroStats: FC<HeroStatsProps> = ({ stats, isLoading }) => {
  const percentage = Math.round(stats?.sla || 0);
  const strokeValue = (percentage * 50) / 100;

  const getSLAStatus = (val: number) => {
    if (val >= 90) return { label: "Excellent", color: "text-emerald-500" };
    if (val >= 75) return { label: "Good", color: "text-blue-500" };
    if (val >= 50) return { label: "Average", color: "text-yellow-500" };
    return { label: "Poor", color: "text-red-500" };
  };

  const status = getSLAStatus(percentage);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Top Part: SLA Gauge (Header) */}
      <div className="p-6 border-b border-gray-800/50 bg-gradient-to-b from-gray-800/20 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-600/10 rounded-lg text-yellow-600">
              <Gauge size={20} />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">System Performance</h3>
          </div>
          <span className={`text-[10px] font-black px-2 py-1 rounded-md bg-gray-800 ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center relative py-2">
          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin text-gray-700 my-4" />
          ) : (
            <>
              <div className="relative w-48 h-24 overflow-hidden flex justify-center">
                <svg className="w-48 h-48 transform -rotate-180" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-800" strokeWidth="3" strokeDasharray="50 100" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-yellow-600 transition-all duration-1000 ease-out" strokeWidth="3" strokeDasharray={`${strokeValue} 100`} strokeLinecap="round" />
                </svg>
                <div 
                  className="absolute bottom-0 w-1 h-14 bg-gradient-to-t from-yellow-600 to-transparent origin-bottom transition-transform duration-1000 ease-out"
                  style={{ transform: `rotate(${(percentage * 1.8) - 90}deg)`, left: 'calc(50% - 2px)' }}
                />
                <div className="absolute bottom-0 flex flex-col items-center">
                  <span className="text-3xl font-black text-white">{percentage}%</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">SLA Score</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Part: Stats Grid */}
      <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-3 bg-gray-900/50">
        <StatItem title="Total Tickets" value={stats?.total_tickets} loading={isLoading} icon={<Ticket size={16} />} color="text-blue-400" />
        <StatItem title="This Year" value={stats?.tickets_this_year} loading={isLoading} icon={<Calendar size={16} />} color="text-yellow-500" />
        <StatItem title="Open" value={stats?.open_tickets} loading={isLoading} icon={<AlertCircle size={16} />} color="text-red-400" />
        <StatItem title="Resolved" value={stats?.resolved_tickets} loading={isLoading} icon={<CheckCircle size={16} />} color="text-green-400" />
      </div>
    </div>
  );
};

interface StatItemProps {
  title: string;
  value: number | undefined;
  loading: boolean;
  icon: React.ReactNode;
  color: string;
}

const StatItem: FC<StatItemProps> = ({ title, value, loading, icon, color }) => (
  <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-800/50 flex flex-col gap-2">
    <div className="flex items-center gap-2 text-gray-500">
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-wider">{title}</span>
    </div>
    {loading ? (
      <div className="h-6 w-10 bg-gray-800 animate-pulse rounded" />
    ) : (
      <span className={`text-xl font-bold ${color}`}>
        {value?.toLocaleString() || 0}
      </span>
    )}
  </div>
);

export default HeroStats;