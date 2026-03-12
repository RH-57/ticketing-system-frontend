import { FC } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface TicketChartProps {
  data: { month: string; total: number }[] | undefined;
  isLoading: boolean;
}

const TicketChart: FC<TicketChartProps> = ({ data, isLoading }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Ticket Trends</h3>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Current Year Activity</p>
          </div>
        </div>
      </div>

      <div className="h-[250px] w-full">
        {isLoading ? (
          <div className="w-full h-full bg-gray-800/20 animate-pulse rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ca8a04" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 10 }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#ca8a04' }}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#ca8a04" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TicketChart;