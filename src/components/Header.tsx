import { KeyRound, LogOut, Menu, Ticket } from "lucide-react"
import { FC, useState, useEffect, useRef } from "react"
import { useAuthUser } from "../hooks/auth/useAuthUser"
import { useLogout } from "../hooks/auth/useLogout"
import ChangePasswordModal from "../views/admin/user/changePassword"
import CreateTicketModal from "../views/admin/ticket/create"
import { useQueryClient } from "@tanstack/react-query"

interface HeaderProps {
  onMenuClick: () => void
}

const Header: FC<HeaderProps> = ({ onMenuClick }) => {
  const user = useAuthUser()
  const [open, setOpen] = useState(false)
  const [openChangePassword, setOpenChangePassword] = useState(false)
  const logout = useLogout()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [openCreateTicket, setOpenCreateTicket] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEsc)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      
      <div className="flex items-center gap-6">
        
        {/* HAMBURGER FIXED */}
        <button
          onClick={onMenuClick}
          className="text-gray-600 hover:opacity-80 transition"
        >
          <Menu className="w-6 h-6 text-yellow-600" />
        </button>

        {/* MENU TICKET (Tampilan Menu Biasa) */}
        <div 
          onClick={() => setOpenCreateTicket(true)}
          className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-colors group"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-yellow-600/10 transition-colors">
            <Ticket className="w-5 h-5 text-yellow-600" />
          </div>
          <span className="hidden md:block text-sm font-medium">Create Ticket</span>
        </div>
        
      </div>

      <div ref={dropdownRef} className="flex items-center gap-6 relative">
        
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 rounded-lg px-2 py-1 transition-colors"
          onClick={() => setOpen(!open)}
        >
          <div className="w-10 h-10 rounded-full 
                          bg-gradient-to-br from-yellow-600 to-yellow-400 
                          text-gray-900 
                          flex items-center justify-center font-semibold shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <span className="hidden md:block text-sm font-medium text-white">
            {user?.name}
          </span>
        </div>

        {open && (
          <div className="absolute right-0 top-12 w-44 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden text-white">

            <button
              onClick={() => {
                setOpenChangePassword(true)
                setOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-800 transition-colors text-left"
            >
              <KeyRound className="w-4 h-4 text-gray-400" />
              Change Password
            </button>

            <div className="border-t border-gray-800"></div>

            <button
              onClick={() => {
                logout()
                setOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-800 transition-colors text-left"
            >
              <LogOut className="text-yellow-600 w-4 h-4" />
              Logout
            </button>

          </div>
        )}
      </div>
      
      <ChangePasswordModal
        isOpen={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />

      <CreateTicketModal
        isOpen={openCreateTicket}
        onClose={() => setOpenCreateTicket(false)}
        onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            setOpenCreateTicket(false);
        }}
      />
    </header>
  )
}

export default Header