import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"

const CourseCard = ({ course, className }) => {
  const difficultyColors = {
    "Beginner": "success",
    "Intermediate": "warning", 
    "Advanced": "error"
  }
  
  return (
    <Link 
      to={`/course/${course.Id}`}
      className={cn(
        "group block bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden",
        className
      )}
    >
      <div className="relative overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={difficultyColors[course.difficulty] || "default"}>
            {course.difficulty}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-display font-semibold text-xl text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <ApperIcon name="User" size={16} className="mr-1" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center">
            <ApperIcon name="Clock" size={16} className="mr-1" />
            <span>{course.duration}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="BookOpen" size={16} className="mr-1" />
            <span>{course.lessons?.length || 0} lessons</span>
          </div>
          
          <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-medium">
            <span className="mr-1">View Course</span>
            <ApperIcon 
              name="ArrowRight" 
              size={16} 
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard