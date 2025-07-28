import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import SearchBar from "@/components/molecules/SearchBar"

const Header = ({ className }) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 shadow-sm", className)}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg">
                <ApperIcon name="GraduationCap" size={24} />
              </div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent">
                EduPlatform
              </h1>
            </div>
          </div>
          
          <div className="flex-1 max-w-lg mx-8">
            <SearchBar placeholder="Search courses, instructors, or topics..." />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent rounded-lg transition-all duration-200">
              <ApperIcon name="Bell" size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent rounded-lg transition-all duration-200">
              <ApperIcon name="Settings" size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header