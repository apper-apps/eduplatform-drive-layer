import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
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
      
      {/* Logout button - Desktop */}
      <div className="hidden lg:block fixed top-4 right-4 z-30">
        <div className="flex items-center space-x-3 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2">
          <div className="text-sm text-gray-700">
            Welcome, {user?.firstName || user?.name || 'User'}
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200"
          >
            <ApperIcon name="LogOut" size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Logout button - Mobile */}
      <div className="lg:hidden fixed top-4 right-4 z-30">
        <button
          onClick={logout}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
          title="Logout"
        >
          <ApperIcon name="LogOut" size={20} />
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
          <main className="p-3 sm:p-4 md:p-6 pt-16 lg:pt-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
