import { FC, useEffect, useState } from "react"
import { Plus, Ticket, CheckCircle2, Pencil, Trash2, ArrowLeft, AlertCircle, LoaderCircleIcon, Eye } from "lucide-react"
import useTickets, { Ticket as ITicket } from "../../../hooks/ticket/useTicket"
// Asumsi kamu memiliki hook dan modal ini, jika belum bisa dibuat menyusul dengan pola yang sama
import useTicketDelete from "../../../hooks/ticket/useTicketDelete" 
import CreateTicketModal from "./create"
import EditTicketModal from "./edit"
import ActionDropdown from "../../../components/ActionDropdown"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useNavigate } from "react-router"

const TicketPage: FC = () => {
  const { data: tickets, isLoading, isError, error } = useTickets()
  const queryClient = useQueryClient()
  
  // Asumsi hook delete ticket sudah dibuat mirip seperti useUserDelete
  const deleteTicket = useTicketDelete() 

  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [editingTicketNumber, setEditingTicketNumber] = useState<string | null>(null)

  // Hitung statistik tiket
  const totalTickets = tickets?.length || 0
  const openTickets = tickets?.filter((ticket: ITicket) => ticket.status === "OPEN").length || 0
  const closedTickets = tickets?.filter((ticket: ITicket) => ticket.status === "CLOSED").length || 0
  const pendingTickets = tickets?.filter((ticket: ITicket) => ticket.status === "PENDING").length || 0

  useEffect(() => {
    document.title = "Ticket Management - Ticketing System"
  }, [])

  const handleUpdate = (ticket: ITicket) => {
    setEditingTicketNumber(ticket.ticket_number)
  }

  const handleDelete = (ticket_number: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return

    const toastId = toast.loading("Deleting ticket...")

    deleteTicket.mutate(ticket_number, {
      onSuccess: () => toast.success("Ticket deleted successfully", { id: toastId }),
      onError: () => toast.error("Failed to delete ticket", { id: toastId }),
    })
  }

  // Helper untuk warna status
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN": return "bg-blue-500/20 text-blue-400"
      case "PROCESS": return "bg-yellow-500/20 text-yellow-400"
      case "PENDING": return "bg-purple-500/20 text-purple-400"
      case "CLOSED": return "bg-green-500/20 text-green-400"
      default: return "bg-gray-500/20 text-gray-400"
    }
  }

  // Helper untuk warna prioritas
  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "LOW": return "text-gray-400"
      case "MEDIUM": return "text-yellow-400"
      case "HIGH": return "text-orange-400"
      case "CRITICAL": return "text-red-400 font-bold"
      default: return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-400 mb-2"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Ticket Management</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Manage support tickets and track their resolution progress
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition w-full sm:w-auto text-white font-medium"
        >
          <Plus size={16} />
          Create Ticket
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Total Tickets</p>
            <h2 className="text-2xl font-bold text-white mt-1">{totalTickets}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Ticket className="text-blue-400" size={20} />
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Open Tickets</p>
            <h2 className="text-2xl font-bold text-white mt-1">{openTickets}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <AlertCircle className="text-yellow-400" size={20} />
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Resolved</p>
            <h2 className="text-2xl font-bold text-white mt-1">{closedTickets}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="text-green-400" size={20} />
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Pending</p>
            <h2 className="text-2xl font-bold text-white mt-1">{pendingTickets}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <LoaderCircleIcon className="text-green-400" size={20} />
          </div>
        </div>
      </div>

      {/* DATA */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 sm:p-6">

        {isLoading && <p className="text-gray-400">Loading tickets...</p>}
        {isError && <p className="text-red-500">{error?.message || "Something went wrong"}</p>}

        {!isLoading && !isError && (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto pb-5">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs uppercase bg-gray-800">
                  <tr>
                    <th className="px-6 py-3">Ticket ID</th>
                    <th className="px-6 py-3">Details</th>
                    <th className="px-6 py-3">Employee</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Created By</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets?.map((ticket: ITicket) => (
                    <tr key={ticket.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-yellow-500">{ticket.ticket_number}</span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-white font-medium line-clamp-1">{ticket.title}</p>
                        <p className={`text-xs mt-1 ${getPriorityColor(ticket.priority)}`}>
                          Priority: {ticket.priority}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-gray-300">{ticket.employee_name}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-gray-300 text-xs">
                          {typeof ticket.created_by === 'object' 
                            ? ticket.created_by?.name || ticket.created_by?.name 
                            : ticket.created_by || "-"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <ActionDropdown
                          items={[
                            { label: "Show", icon: Eye, onClick: () => handleUpdate(ticket) },
                            { label: "Delete", icon: Trash2, danger: true, onClick: () => handleDelete(ticket.ticket_number) },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tickets?.length === 0 && (
                <div className="text-center py-8 text-gray-500">No tickets found.</div>
              )}
            </div>

            {/* MOBILE CARD LIST */}
            <div className="space-y-3 md:hidden">
              {tickets?.map((ticket: ITicket) => (
                <div key={ticket.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-white font-semibold leading-tight">{ticket.title}</p>
                      <p className="text-yellow-500 font-mono text-xs mt-1">{ticket.ticket_number}</p>
                    </div>

                    <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{ticket.employee_name}</span>
                    <span className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-700">
                    <button
                      onClick={() => handleUpdate(ticket)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 text-blue-400 py-2 rounded-lg active:scale-95 transition-transform"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(ticket.ticket_number)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 text-red-400 py-2 rounded-lg active:scale-95 transition-transform"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {tickets?.length === 0 && (
                <div className="text-center py-6 text-gray-500">No tickets found.</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Asumsi komponen modal dibuat dengan pola yang sama seperti di UserPage */}
      <CreateTicketModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["tickets"] })}
      />

      <EditTicketModal
        ticketNumber={editingTicketNumber}
        isOpen={editingTicketNumber !== null}
        onClose={() => setEditingTicketNumber(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["tickets"] })}
      />
    </div>
  )
}

export default TicketPage