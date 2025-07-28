import { NavLink } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const MobileSidebar = ({ isOpen, onClose, className }) => {
const navigationItems = [
    {
      name: "Courses",
      path: "/courses",
      icon: "BookOpen"
    },
    {
      name: "My Learning",
      path: "/my-learning", 
      icon: "User"
    },
    {
      name: "Bookmarked",
      path: "/bookmarked",
      icon: "Heart"
    },
    {
      name: "Browse",
      path: "/browse",
      icon: "Search"
    }
  ]
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 border-r border-gray-200",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg">
              <ApperIcon name="GraduationCap" size={24} />
            </div>
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent">
              EduPlatform
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>
        
        <nav className="p-6">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 shadow-sm border border-primary-200"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent hover:text-primary-700 hover:shadow-sm"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon 
                      name={item.icon} 
                      size={20} 
                      className={cn(
                        "mr-3 transition-colors duration-200",
                        isActive ? "text-primary-600" : "text-gray-500 group-hover:text-primary-600"
                      )}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 border border-primary-200">
              <div className="flex items-center mb-2">
                <ApperIcon name="Trophy" size={20} className="text-primary-600 mr-2" />
                <span className="font-semibold text-primary-700">Your Progress</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Complete more courses to unlock achievements!</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full w-3/5"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">3 of 5 courses completed</p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}

export default MobileSidebar