import { FC } from "react";
import { ListTodo, Loader2, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { Ticket as ITicket } from "../../../../hooks/ticket/useTicket";

interface TaskSectionProps {
  tickets: ITicket[] | undefined;
  isLoading: boolean;
}

const TaskSection: FC<TaskSectionProps> = ({ tickets, isLoading }) => {
  const activeTasks = tickets?.filter((t) => t.status.toUpperCase() !== "CLOSED") || [];

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN": return "text-blue-400 bg-blue-500/10 ring-1 ring-blue-500/20";
      case "PROCESS": return "text-yellow-400 bg-yellow-500/10 ring-1 ring-yellow-500/20";
      case "PENDING": return "text-purple-400 bg-purple-500/10 ring-1 ring-purple-500/20";
      default: return "text-gray-400 bg-gray-500/10 ring-1 ring-gray-500/20";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "HIGH": return "bg-red-500";
      case "MEDIUM": return "bg-orange-500";
      case "LOW": return "bg-emerald-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col h-full min-h-[320px] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-yellow-600/10 rounded-lg">
            <ListTodo className="text-yellow-600" size={16} />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">Active Tasks</h3>
        </div>
        <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-yellow-600 animate-pulse"></span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {activeTasks.length} Tickets
            </span>
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto max-h-[248px] custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-600/50" />
            <p className="text-[11px] text-gray-500 font-medium animate-pulse">Syncing tasks...</p>
          </div>
        ) : activeTasks.length > 0 ? (
          <div className="divide-y divide-gray-800/50">
            {activeTasks.map((ticket) => (
              <div 
                key={ticket.id} 
                className="px-3 py-4 hover:bg-gray-800/30 transition-all duration-200 group cursor-pointer relative overflow-hidden"
              >
                {/* Left Priority Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${getPriorityStyle(ticket.priority)} opacity-70`} />

                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
                        {ticket.title}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[9px] text-yellow-600 font-bold">
                          {ticket.employee_name?.charAt(0)}
                        </div>
                        <span className="text-[11px] text-gray-400 font-medium truncate max-w-[100px]">
                          {ticket.employee_name}
                        </span>
                      </div>
                      <span className="text-gray-700">|</span>
                      <div className="flex items-center gap-1">
                        <Clock size={11} className="text-gray-600" />
                        <span className="text-[10px] font-mono text-gray-500">{ticket.ticket_number}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-tighter ${getStatusStyle(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <ChevronRight size={14} className="text-gray-700 group-hover:text-gray-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-10 text-center">
            <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="text-gray-700" size={24} />
            </div>
            <p className="text-gray-400 text-sm font-semibold">All caught up!</p>
            <p className="text-gray-600 text-[11px] mt-1">No active tickets need your attention right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSection;