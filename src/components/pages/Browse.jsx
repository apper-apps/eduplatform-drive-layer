import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"

const Browse = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const navigate = useNavigate()
  
  const loadCourses = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await courseService.getAll()
      setCourses(data)
    } catch (err) {
      setError("Failed to load course categories. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadCourses()
  }, [])
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-8 w-48 rounded-lg mb-4 animate-pulse"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-96 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-32 w-full rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <Error message={error} onRetry={loadCourses} />
      </div>
    )
  }
  
  // Group courses by category
  const categories = courses.reduce((acc, course) => {
    const category = course.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(course)
    return acc
  }, {})
  
  const categoryStats = Object.entries(categories).map(([name, coursesInCategory]) => {
    const totalLessons = coursesInCategory.reduce((sum, course) => sum + (course.lessons?.length || 0), 0)
    const avgDuration = coursesInCategory.reduce((sum, course) => {
      const duration = parseInt(course.duration.replace(/[^\d]/g, "")) || 0
      return sum + duration
    }, 0) / coursesInCategory.length
    
    return {
      name,
      courseCount: coursesInCategory.length,
      totalLessons,
      avgDuration: Math.round(avgDuration),
      courses: coursesInCategory,
      icon: getCategoryIcon(name)
    }
  })
  
  function getCategoryIcon(category) {
    const iconMap = {
      "Technology": "Code",
      "Business": "Briefcase", 
      "Design": "Palette",
      "Marketing": "TrendingUp",
      "Data Science": "BarChart3",
      "Health": "Heart",
      "Arts": "Brush",
      "Music": "Music",
      "Language": "Globe",
      "Science": "Atom"
    }
    return iconMap[category] || "BookOpen"
  }
  
  if (Object.keys(categories).length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <Empty
          title="No categories available"
          description="We're working on organizing our courses into categories. Check back soon!"
          actionText="View All Courses"
          onAction={() => navigate("/courses")}
          icon="Grid3X3"
        />
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
              Browse by
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent ml-2">
                Category
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Discover courses organized by subject matter and skill level.
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate("/courses")}
            className="hidden sm:flex"
          >
            <ApperIcon name="Grid3X3" size={20} className="mr-2" />
            View All Courses
          </Button>
        </div>
      </div>
      
      {/* Category Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">Total Categories</p>
              <p className="text-3xl font-display font-bold">{Object.keys(categories).length}</p>
            </div>
            <ApperIcon name="Grid3X3" size={32} className="text-primary-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 text-sm font-medium mb-1">Available Courses</p>
              <p className="text-3xl font-display font-bold">{courses.length}</p>
            </div>
            <ApperIcon name="BookOpen" size={32} className="text-secondary-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Learning Paths</p>
              <p className="text-3xl font-display font-bold">{Math.floor(courses.length / 3)}</p>
            </div>
            <ApperIcon name="Route" size={32} className="text-emerald-200" />
          </div>
        </div>
      </div>
      
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryStats.map((category) => (
          <div
            key={category.name}
            className="group bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            onClick={() => {
              setSelectedCategory(category.name)
              navigate("/courses")
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-600 group-hover:from-primary-200 group-hover:to-secondary-200 transition-all duration-300">
                <ApperIcon name={category.icon} size={24} />
              </div>
              <Badge variant="primary">
                {category.courseCount} course{category.courseCount !== 1 ? "s" : ""}
              </Badge>
            </div>
            
            <h3 className="font-display font-semibold text-xl text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
              {category.name}
            </h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="PlayCircle" size={16} className="mr-2" />
                <span>{category.totalLessons} total lessons</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Clock" size={16} className="mr-2" />
                <span>~{category.avgDuration}h average duration</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {category.courses.slice(0, 3).map((course, index) => (
                  <img
                    key={course.Id}
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
                {category.courses.length > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                    +{category.courses.length - 3}
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-medium">
                <span className="mr-1">Explore</span>
                <ApperIcon 
                  name="ArrowRight" 
                  size={16} 
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Popular Learning Paths */}
      <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8 border border-primary-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full text-white mb-4">
            <ApperIcon name="Route" size={32} />
          </div>
          <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2">
            Structured Learning Paths
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow curated learning paths designed to take you from beginner to expert in your chosen field.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-primary-200 shadow-sm">
            <div className="flex items-center mb-3">
              <ApperIcon name="Code" size={20} className="text-primary-600 mr-2" />
              <h4 className="font-semibold text-gray-900">Full-Stack Developer</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Complete web development path from HTML to deployment</p>
            <Badge variant="primary" className="text-xs">6 courses</Badge>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-primary-200 shadow-sm">
            <div className="flex items-center mb-3">
              <ApperIcon name="BarChart3" size={20} className="text-secondary-600 mr-2" />
              <h4 className="font-semibold text-gray-900">Data Scientist</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Master data analysis, machine learning, and visualization</p>
            <Badge variant="secondary" className="text-xs">4 courses</Badge>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-primary-200 shadow-sm">
            <div className="flex items-center mb-3">
              <ApperIcon name="Palette" size={20} className="text-emerald-600 mr-2" />
              <h4 className="font-semibold text-gray-900">UX Designer</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Learn user research, design thinking, and prototyping</p>
            <Badge variant="success" className="text-xs">5 courses</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Browse