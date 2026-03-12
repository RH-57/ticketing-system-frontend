import { FC, useState, useEffect, FormEvent, useRef } from "react"
import useTicketDetail from "../../../hooks/ticket/useTicketDetail"
import useTicketUpdate, { TicketUpdateRequest } from "../../../hooks/ticket/useTicketUpdate"
import useEmployees, { Employee } from "../../../hooks/employee/useEmployees"
import toast from "react-hot-toast"
import { Loader2, Search, X } from "lucide-react"

interface Props {
  ticketNumber: string | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface TicketUpdateErrors {
  [key: string]: string[] | undefined
}

const EditTicketModal: FC<Props> = ({ ticketNumber, isOpen, onClose, onSuccess }) => {
  // --- FORM STATE ---
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("LOW")
  const [status, setStatus] = useState("OPEN")
  const [errors, setErrors] = useState<TicketUpdateErrors>({})

  // --- SEARCH & EMPLOYEE STATE ---
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // --- API HOOKS ---
  const updateTicket = useTicketUpdate()
  const { data: ticket, isLoading: isFetchingDetail, dataUpdatedAt } = useTicketDetail(ticketNumber || "")
  const { data: employeeResponse, isLoading: isSearching } = useEmployees(1, 10, debouncedSearch)
  const employees = employeeResponse?.data || []

  // --- LOGIC: DEBOUNCE SEARCH ---
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length >= 2) setDebouncedSearch(searchTerm)
      else setDebouncedSearch("")
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // --- LOGIC: PREFILL DATA ---
  useEffect(() => {
    if (!isOpen || !ticket) return

    setTitle(ticket.title)
    setDescription(ticket.description || "")
    setPriority(ticket.priority)
    setStatus(ticket.status)
    
    // Set selected employee dari data tiket yang di-fetch
    if (ticket.employee) {
      setSelectedEmployee(ticket.employee as unknown as Employee)
    }
    
    setErrors({})
  }, [ticket, dataUpdatedAt, isOpen])

  // --- LOGIC: CLICK OUTSIDE DROPDOWN ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!ticketNumber) return
    if (!selectedEmployee) {
      toast.error("Please select an employee")
      return
    }

    const payload: TicketUpdateRequest = {
      ticket_number: ticketNumber,
      data: {
        title,
        description,
        priority,
        status,
        employee_id: selectedEmployee.id
      }
    }

    updateTicket.mutate(payload, {
      onSuccess: () => {
        toast.success(`Ticket ${ticketNumber} updated successfully`)
        onSuccess?.()
        onClose()
      },
      onError: (error) => {
        setErrors(error?.response?.data?.errors || {})
      },
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-slideUp shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-white">Edit Ticket</h2>
          <span className="text-xs font-mono text-yellow-600 bg-yellow-600/10 px-2 py-1 rounded border border-yellow-600/20">
            {ticketNumber}
          </span>
        </div>

        {isFetchingDetail ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
            <p className="text-gray-500 text-sm italic">Fetching details...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            {/* TITLE */}
            <div>
              <label className="text-sm text-gray-400">Title <span className="text-red-500">*</span></label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className={`mt-1.5 w-full bg-gray-800 rounded-xl px-4 py-2.5 text-white outline-none transition border
                ${errors.title ? "border-red-500" : "border-gray-700 focus:ring-2 focus:ring-yellow-600"}`}
              />
              {errors.title && <p className="mt-1 text-red-500 text-xs italic">{errors.title[0]}</p>}
            </div>

            {/* EMPLOYEE SEARCH (Sama seperti Create) */}
            <div className="relative" ref={dropdownRef}>
              <label className="text-sm text-gray-400">Employee <span className="text-red-500">*</span></label>
              
              {!selectedEmployee ? (
                <div className="relative mt-1.5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setShowDropdown(true)
                    }}
                    placeholder="Search employee..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-600 transition"
                  />
                  
                  {showDropdown && searchTerm.length >= 2 && (
                    <div className="absolute z-[70] left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {isSearching ? (
                        <div className="px-4 py-4 text-sm text-gray-400 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Searching...</div>
                      ) : employees.map((emp) => (
                        <div
                          key={emp.id}
                          onClick={() => { setSelectedEmployee(emp); setShowDropdown(false); setSearchTerm(""); }}
                          className="px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800/50 last:border-0"
                        >
                          <p className="text-sm font-semibold text-white">{emp.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{emp.department?.name} | {emp.division?.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-1.5 flex items-center justify-between bg-yellow-600/5 border border-yellow-600/30 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-gray-900 text-xs font-bold">
                      {selectedEmployee.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{selectedEmployee.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{selectedEmployee.department?.name}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setSelectedEmployee(null)} className="p-1 hover:text-red-500 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm text-gray-400">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={3}
                className="mt-1.5 w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-2 focus:ring-yellow-600 transition"
              />
            </div>

            {/* STATUS & PRIORITY */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1.5 w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white outline-none">
                  <option value="OPEN">OPEN</option>
                  <option value="PROCESS">PROCESS</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="mt-1.5 w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white outline-none">
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-xl py-2.5 transition">Cancel</button>
              <button type="submit" disabled={updateTicket.isPending} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-gray-900 rounded-xl py-2.5 font-bold transition disabled:opacity-50">
                {updateTicket.isPending ? "Updating..." : "Update Ticket"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default EditTicketModal