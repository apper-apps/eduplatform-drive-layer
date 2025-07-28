import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const LessonItem = ({ lesson, courseId, isActive = false, className }) => {
  return (
    <Link
      to={`/course/${courseId}/lesson/${lesson.Id}`}
      className={cn(
        "flex items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md hover:border-primary-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent group",
        isActive 
          ? "bg-gradient-to-r from-primary-100 to-primary-50 border-primary-300 shadow-md" 
          : "bg-white border-gray-200 hover:border-primary-300",
        className
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 font-semibold text-sm mr-4 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-200">
        {lesson.order}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "font-medium text-gray-900 group-hover:text-primary-700 transition-colors duration-200",
          isActive && "text-primary-700"
        )}>
          {lesson.title}
        </h4>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <ApperIcon name="Clock" size={14} className="mr-1" />
          <span>{lesson.duration}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {lesson.completed && (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <ApperIcon name="Check" size={14} />
          </div>
        )}
        <ApperIcon 
          name="Play" 
          size={16} 
          className={cn(
            "text-gray-400 group-hover:text-primary-600 transition-colors duration-200",
            isActive && "text-primary-600"
          )}
        />
      </div>
    </Link>
  )
}

export default LessonItem