import { FC, useState } from "react"
import { Outlet } from "react-router-dom"

import Header from "./Header"
import Sidebar from "./Sidebar"

const Layout: FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen">

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col transition-all duration-300">
        
        <Header
          onMenuClick={() => setSidebarOpen(prev => !prev)}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default Layout
