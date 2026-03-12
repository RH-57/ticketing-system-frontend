import { FC, useState, FormEvent, useEffect, useRef } from "react"
import useTicketCreate from "../../../hooks/ticket/useTicketCreate"
import useEmployees, { Employee } from "../../../hooks/employee/useEmployees"
import toast from "react-hot-toast"
import { Search, X, Loader2 } from "lucide-react"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface ValidationErrors {
  [key: string]: string[]
}

const CreateTicketModal: FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  // --- FORM STATE ---
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("LOW")
  const [errors, setErrors] = useState<ValidationErrors>({})

  // --- SEARCH & DEBOUNCE STATE ---
  const [searchTerm, setSearchTerm] = useState("") // Apa yang diketik user
  const [debouncedSearch, setDebouncedSearch] = useState("") // Apa yang dikirim ke API
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // --- LOGIC: DEBOUNCE ---
  // Menunggu user berhenti mengetik selama 500ms sebelum trigger API
  useEffect(() => {
    const handler = setTimeout(() => {
      // Hanya cari jika minimal 2 karakter untuk efisiensi
      if (searchTerm.length >= 2) {
        setDebouncedSearch(searchTerm)
      } else {
        setDebouncedSearch("")
      }
    }, 500)

    return () => clearTimeout(handler)
  }, [searchTerm])

  // --- API HOOKS ---
  const { data: employeeResponse, isLoading: isSearching } = useEmployees(1, 10, debouncedSearch)
  const employees = employeeResponse?.data || []
  const { mutate, isPending } = useTicketCreate()

  // --- EVENT HANDLERS ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const storeTicket = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!selectedEmployee) {
      toast.error("Please select an employee first")
      return
    }

    mutate(
      {
        title,
        description,
        employee_id: selectedEmployee.id,
        priority
      },
      {
        onSuccess: () => {
          toast.success("Ticket created successfully")
          onSuccess?.()
          handleClose()
        },
        onError: (error) => {
          setErrors(error?.response?.data?.errors || {})
        }
      }
    )
  }

  const handleClose = () => {
    setTitle("")
    setDescription("")
    setPriority("LOW")
    setSelectedEmployee(null)
    setSearchTerm("")
    setDebouncedSearch("")
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal Container */}
      <div className="relative w-full sm:max-w-lg bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-6 animate-slideUp overflow-visible shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-5">Create Ticket</h2>

        <form onSubmit={storeTicket} className="space-y-5">
          
          {/* TITLE INPUT */}
          <div>
            <label className="text-sm text-gray-400">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1.5 w-full bg-gray-800 rounded-lg px-4 py-2.5 text-white outline-none transition border
                ${errors.title ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-gray-700 focus:ring-2 focus:ring-yellow-600"}`}
              placeholder="What is the issue?"
            />
            {errors.title && <p className="mt-1 text-red-500 text-[11px] italic">{errors.title[0]}</p>}
          </div>

          {/* EMPLOYEE AUTOCOMPLETE SEARCH */}
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
                  onFocus={() => { if (searchTerm.length >= 2) setShowDropdown(true) }}
                  placeholder="Type name (min. 2 chars)..."
                  className={`w-full bg-gray-800 border rounded-lg pl-10 pr-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-600 transition
                    ${errors.employee_id ? "border-red-500" : "border-gray-700"}`}
                />
                
                {/* DROPDOWN RESULTS */}
                {showDropdown && searchTerm.length >= 2 && (
                  <div className="absolute z-[70] left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden ring-1 ring-black ring-opacity-5">
                    {isSearching ? (
                      <div className="px-4 py-4 text-sm text-gray-400 flex items-center justify-center gap-2 italic">
                        <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
                        Searching for "{searchTerm}"...
                      </div>
                    ) : employees.length > 0 ? (
                      employees.map((emp) => (
                        <div
                          key={emp.id}
                          onClick={() => {
                            setSelectedEmployee(emp)
                            setShowDropdown(false)
                            setSearchTerm("")
                          }}
                          className="px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800/50 last:border-0 transition-all"
                        >
                          <p className="text-sm font-semibold text-white">{emp.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-500 uppercase font-medium">{emp.department?.name}</span>
                            <span className="text-gray-700 text-[10px]">•</span>
                            <span className="text-[10px] text-gray-500 uppercase font-medium">{emp.division?.name}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-sm text-gray-500 text-center">
                         User "{searchTerm}" not found
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* SELECTED EMPLOYEE BADGE */
              <div className="mt-1.5 flex items-center justify-between bg-yellow-600/5 border border-yellow-600/30 rounded-lg p-3 group hover:bg-yellow-600/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center text-gray-900 font-bold shadow-lg">
                    {selectedEmployee.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{selectedEmployee.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">
                       {selectedEmployee.department?.name} | {selectedEmployee.division?.name}
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => { setSelectedEmployee(null); setSearchTerm(""); }}
                  className="p-1.5 bg-gray-800 hover:bg-red-500/20 hover:text-red-500 rounded-full text-gray-500 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {errors.employee_id && <p className="mt-1 text-red-500 text-[11px] italic">{errors.employee_id[0]}</p>}
          </div>

          {/* DESCRIPTION TEXTAREA */}
          <div>
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`mt-1.5 w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none border transition
                ${errors.description ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border border-gray-700 focus:ring-2 focus:ring-yellow-600"}`}
              placeholder="Provide more details..."
            />
          </div>

          {/* PRIORITY SELECT */}
          <div>
            <label className="text-sm text-gray-400">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1.5 w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-600 outline-none cursor-pointer appearance-none"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-2.5 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-gray-900 rounded-lg py-2.5 transition disabled:opacity-50 font-bold shadow-lg shadow-yellow-600/20"
            >
              {isPending ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTicketModal