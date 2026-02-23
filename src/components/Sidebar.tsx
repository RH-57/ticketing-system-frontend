import { Home, User } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { useAuthUser } from "../hooks/auth/useAuthUser"
import { Link } from "react-router-dom"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const Sidebar: FC<SidebarProps> = ({ open, onClose }) => {
  const user = useAuthUser()
  const [isHovered, setIsHovered] = useState(false)

  const isExpanded = open || isHovered

  useEffect(() => {
    document.title = "Dashboard - Ticketing System"
  }, [])

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed lg:relative
          z-50
          bg-gray-900 border-r border-gray-800
          h-screen
          transition-all duration-300 ease-in-out
          flex flex-col
          ${
            isExpanded
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full lg:w-20 lg:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div
          className={`
            h-16 border-b border-gray-800 flex items-center
            ${isExpanded ? "px-4 justify-start" : "justify-center"}
          `}
        >
          <div className="bg-yellow-600 text-gray-100 font-bold w-8 h-8 flex items-center justify-center rounded-lg">
            IT
          </div>

          {isExpanded && (
            <span className="ml-2 text-lg font-semibold">
              Ticketing-System
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 text-sm">
          <Link
            to="/admin/dashboard"
            onClick={onClose}
            className={`flex items-center ${
              isExpanded ? "gap-3 px-4" : "justify-center"
            } py-2 rounded-lg hover:bg-gray-700`}
          >
            <Home className="w-6 h-6" />
            {isExpanded && <span>Dashboard</span>}
          </Link>

          <Link
            to="/admin/users"
            onClick={onClose}
            className={`flex items-center ${
              isExpanded ? "gap-3 px-4" : "justify-center"
            } py-2 rounded-lg hover:bg-gray-700`}
          >
            <User className="w-6 h-6" />
            {isExpanded && <span>User Management</span>}
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className={`flex items-center ${isExpanded ? "gap-3" : "justify-center"}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-400 text-gray-900 flex items-center justify-center font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {isExpanded && (
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
