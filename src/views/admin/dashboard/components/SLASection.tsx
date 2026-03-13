import { FC } from "react";
import { Gauge } from "lucide-react";

interface SLASectionProps {
  value: number | undefined;
  isLoading: boolean;
}

const SLASection: FC<SLASectionProps> = ({ value = 0, isLoading }) => {
  const percentage = Math.round(value);
  
  // Karena r=16, keliling total adalah ~100.
  // Kita ingin setengah lingkaran penuh (180 deg) mewakili 100%.
  // Maka strokeValue maksimal adalah 50.
  const strokeValue = (percentage * 50) / 100;

  const getSLAStatus = (val: number) => {
    if (val >= 90) return { label: "Excellent", color: "text-emerald-500" };
    if (val >= 75) return { label: "Good", color: "text-blue-500" };
    if (val >= 50) return { label: "Average", color: "text-yellow-500" };
    return { label: "Poor", color: "text-red-500" };
  };

  const status = getSLAStatus(percentage);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col h-full shadow-sm font-inter overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-600/10 rounded-lg text-yellow-600">
            <Gauge size={16} />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">SLA</h3>
        </div>
        <span className={`text-[12px] font-black px-1.5 py-0.5 rounded bg-gray-800 ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative pt-4">
        {isLoading ? (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-gray-700" />
          </div>
        ) : (
          <div className="relative w-64 h-36 overflow-hidden flex justify-center">
            {/* SVG Speedometer */}
            {/* Rotasi -180 agar titik 0 dimulai dari kiri bawah secara horizontal */}
            <svg className="w-64 h-64 transform -rotate-180" viewBox="0 0 36 36">
              {/* Background Track */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-gray-800"
                strokeWidth="3"
                strokeDasharray="50 100" // Setengah lingkaran
                strokeLinecap="round"
              />
              {/* Progress Value */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-yellow-600 transition-all duration-1000 ease-out"
                strokeWidth="3"
                strokeDasharray={`${strokeValue} 100`}
                strokeLinecap="round"
              />
            </svg>

            {/* Pointer / Jarum */}
            {/* Logic: (percentage * 1.8) memetakan 0-100 ke 0-180 derajat. 
                Dikurangi 90 agar jarum tegak lurus saat 50% */}
            <div 
              className="absolute bottom-0 w-1 h-20 bg-gradient-to-t from-yellow-600 to-transparent origin-bottom transition-transform duration-1000 ease-out shadow-[0_0_10px_rgba(202,138,4,0.5)]"
              style={{ 
                transform: `rotate(${(percentage * 1.8) - 90}deg)`,
                left: 'calc(50% - 2px)'
              }}
            />

            {/* Angka Persentase */}
            <div className="absolute bottom-0 flex flex-col items-center">
              <span className="text-4xl font-black text-white leading-none">{percentage}%</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Efficiency</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Markers */}
      <div className="flex justify-between mt-4 px-4 text-[9px] font-bold text-gray-600">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

const Loader2 = ({ className }: { className: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
);

export default SLASection;