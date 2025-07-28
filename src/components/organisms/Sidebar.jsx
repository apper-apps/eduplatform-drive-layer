import { NavLink } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Sidebar = ({ className }) => {
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
<aside className={cn("hidden lg:block w-60 bg-white border-r border-gray-200 shadow-sm", className)}>
      <nav className="p-4 lg:p-6">
        <div className="space-y-1 lg:space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 lg:px-4 lg:py-3 text-sm font-medium rounded-lg transition-all duration-200 group min-h-[44px]",
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
                      "mr-3 transition-colors duration-200 flex-shrink-0",
                      isActive ? "text-primary-600" : "text-gray-500 group-hover:text-primary-600"
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
        
        <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-3 lg:p-4 border border-primary-200">
            <div className="flex items-center mb-2">
              <ApperIcon name="Trophy" size={18} className="text-primary-600 mr-2 flex-shrink-0" />
              <span className="font-semibold text-primary-700 text-sm lg:text-base">Your Progress</span>
            </div>
            <p className="text-xs lg:text-sm text-gray-600 mb-3">Complete more courses to unlock achievements!</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full w-3/5"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">3 of 5 courses completed</p>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar