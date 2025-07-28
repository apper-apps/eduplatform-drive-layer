import { Link } from "react-router-dom"
import { useState } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"

const CourseCard = ({ course, className, progress = null }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  
  const difficultyColors = {
    "Beginner": "success",
    "Intermediate": "warning", 
    "Advanced": "error"
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  // Fallback placeholder based on course category
  const getCategoryIcon = (category) => {
const iconMap = {
      "Programming": "Code",
      "Business": "Briefcase",
      "Design": "Palette", 
      "Arts": "Camera",
      "Science": "Atom"
    }
    return iconMap[category] || "BookOpen"
  }
  
  return (
    <Link 
      to={`/course/${course.Id}`}
      className={cn(
        "group block bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden",
        className
      )}
    >
<div className="relative overflow-hidden bg-gray-100">
        {!imageError ? (
          <>
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className={cn(
                "w-full h-48 object-cover group-hover:scale-105 transition-all duration-300",
                imageLoading && "opacity-0"
              )}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Image" size={24} className="text-gray-400" />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                <ApperIcon 
                  name={getCategoryIcon(course.category)} 
                  size={24} 
                  className="text-gray-500" 
                />
              </div>
              <p className="text-xs text-gray-500 font-medium">{course.category}</p>
            </div>
          </div>
        )}
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
        
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <ApperIcon name={getCategoryIcon(course.category)} size={12} />
            {course.category}
          </Badge>
        </div>
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
        
<div className="space-y-3">
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
          
          {progress && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Progress</span>
                <span className="text-gray-700 font-semibold">{progress.progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress.progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{progress.completedLessons?.length || 0} of {course.lessons?.length || 0} completed</span>
                {progress.lastAccessed && (
                  <span>
                    Last: {Math.floor((Date.now() - new Date(progress.lastAccessed)) / (1000 * 60 * 60 * 24))}d ago
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CourseCard