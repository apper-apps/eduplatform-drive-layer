import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  className, 
  title = "No items found", 
  description = "There are no items to display at the moment.",
  actionText = "Explore Courses",
  onAction,
  icon = "BookOpen"
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] text-center p-8", className)}>
      <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full p-8 mb-6">
        <ApperIcon 
          name={icon} 
          size={64} 
          className="text-primary-600"
        />
      </div>
      
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 text-lg mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <ApperIcon name="Search" size={20} className="mr-2" />
          {actionText}
        </Button>
      )}
    </div>
  )
}

export default Empty