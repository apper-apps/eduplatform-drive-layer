import { useState } from "react"
import Header from "@/components/organisms/Header"
import Sidebar from "@/components/organisms/Sidebar"
import MobileSidebar from "@/components/organisms/MobileSidebar"
import ApperIcon from "@/components/ApperIcon"

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200"
        >
          <ApperIcon name="Menu" size={24} />
        </button>
      </div>
      
      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar */}
        <MobileSidebar 
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Header />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout