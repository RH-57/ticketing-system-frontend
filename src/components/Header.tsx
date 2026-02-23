import { LogOut, Menu, Search, Settings} from "lucide-react"
import { FC, useState, useEffect, useRef } from "react"
import { useAuthUser } from "../hooks/auth/useAuthUser"
import { useLogout } from "../hooks/auth/useLogout"
import { useNavigate } from "react-router-dom"

interface HeaderProps {
  onMenuClick: () => void
}

const Header: FC<HeaderProps> = ({ onMenuClick }) => {
  const user = useAuthUser()
  const [open, setOpen] = useState(false)
  const logout = useLogout()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

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
      
      <div className="flex items-center gap-4">
        
        {/* HAMBURGER FIXED */}
        <button
          onClick={onMenuClick}
          className=" text-gray-600"
        >
          <Menu className="w-6 h-6 text-yellow-600" />
        </button>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-600 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 w-64"
          />
        </div>
      </div>

      <div ref={dropdownRef} className="flex items-center gap-6 relative">
        
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 rounded-lg px-2 py-1"
          onClick={() => setOpen(!open)}
        >
          <div className="w-10 h-10 rounded-full 
                          bg-gradient-to-br from-yellow-600 to-yellow-400 
                          text-gray-900 
                          flex items-center justify-center font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <span className="hidden md:block text-sm font-medium">
            {user?.name}
          </span>
        </div>

        {open && (
          <div className="absolute right-0 top-12 w-44 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">

            <button
              onClick={() => {
                navigate("/admin/settings")
                setOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-700 text-left"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>

            <div className="border-t border-gray-700"></div>

            <button
              onClick={() => {
                logout()
                setOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-700 text-left"
            >
              <LogOut className="text-yellow-600 w-4 h-4" />
              Logout
            </button>

          </div>
        )}
      </div>
    </header>
  )
}

export default Header
