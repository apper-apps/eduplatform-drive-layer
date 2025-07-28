import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CourseCard from "@/components/molecules/CourseCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"

const MyLearning = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  
const loadEnrolledCourses = async () => {
    try {
      setLoading(true)
      setError("")
      // Get courses with actual progress data
      const coursesWithProgress = await courseService.getAllWithProgress(1)
      // Filter to only enrolled courses (those with progress data)
      const enrolled = coursesWithProgress
        .filter(course => course.progress && course.progress.completedLessons.length > 0)
        .map(course => ({
          ...course,
          progress: course.progress.progressPercentage,
          lastAccessed: course.progress.lastAccessed,
          completedLessons: course.progress.completedLessons.length,
          progressData: course.progress
        }))
      setEnrolledCourses(enrolled)
    } catch (err) {
      setError("Failed to load your learning progress. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadEnrolledCourses()
  }, [])
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-8 w-48 rounded-lg mb-4 animate-pulse"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-96 rounded animate-pulse"></div>
        </div>
        <Loading />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <Error message={error} onRetry={loadEnrolledCourses} />
      </div>
    )
  }
  
  if (enrolledCourses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <Empty
          title="Start your learning journey"
          description="You haven't enrolled in any courses yet. Explore our course catalog to find something that interests you!"
          actionText="Browse Courses"
          onAction={() => navigate("/courses")}
          icon="BookOpen"
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
              My Learning
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent ml-2">
                Progress
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Continue where you left off and track your learning progress.
            </p>
          </div>
          
          <Button
            onClick={() => navigate("/courses")}
            className="hidden sm:flex"
          >
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Find New Courses
          </Button>
        </div>
      </div>
      
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="BookOpen" size={24} className="text-primary-200" />
            <Badge variant="default" className="bg-white/20 text-white border-white/30">
              Active
            </Badge>
          </div>
          <p className="text-3xl font-display font-bold mb-1">{enrolledCourses.length}</p>
          <p className="text-primary-100 text-sm">Enrolled Courses</p>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="CheckCircle" size={24} className="text-emerald-200" />
            <Badge variant="success" className="bg-white/20 text-white border-white/30">
              Complete
            </Badge>
          </div>
          <p className="text-3xl font-display font-bold mb-1">
            {enrolledCourses.filter(c => c.progress === 100).length}
          </p>
          <p className="text-emerald-100 text-sm">Completed</p>
        </div>
        
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="Clock" size={24} className="text-secondary-200" />
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Hours
            </Badge>
          </div>
          <p className="text-3xl font-display font-bold mb-1">42</p>
          <p className="text-secondary-100 text-sm">Total Hours</p>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="Trophy" size={24} className="text-yellow-200" />
            <Badge variant="warning" className="bg-white/20 text-white border-white/30">
              Streak
            </Badge>
          </div>
          <p className="text-3xl font-display font-bold mb-1">7</p>
          <p className="text-yellow-100 text-sm">Day Streak</p>
        </div>
      </div>
      
      {/* Continue Learning Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">Continue Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{enrolledCourses.map((course) => (
            <div key={course.Id} className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <CourseCard course={course} progress={course.progressData} className="shadow-none border-none hover:shadow-none hover:translate-y-0" />
              
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <ApperIcon name="Clock" size={16} className="mr-2" />
                      <span>Last accessed {Math.floor((Date.now() - new Date(course.lastAccessed)) / (1000 * 60 * 60 * 24))} days ago</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="CheckCircle" size={16} className="mr-2" />
                      <span>{course.completedLessons} of {course.lessons?.length || 0} completed</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">{course.progress}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      // Navigate to next incomplete lesson or first lesson
                      const nextLessonId = course.lessons?.find(lesson => 
                        !course.progressData.completedLessons.includes(lesson.Id)
                      )?.Id || course.lessons?.[0]?.Id
                      
                      if (nextLessonId) {
                        navigate(`/course/${course.Id}/lesson/${nextLessonId}`)
                      } else {
                        navigate(`/course/${course.Id}`)
                      }
                    }}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <ApperIcon name="Play" size={18} />
                    <span>Continue Learning</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8 border border-primary-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full text-white mb-4">
            <ApperIcon name="Lightbulb" size={32} />
          </div>
          <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2">
            Ready for more?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Based on your learning progress, we recommend exploring these new courses to expand your skills.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => navigate("/courses")}>
              <ApperIcon name="Search" size={20} className="mr-2" />
              Explore Courses
            </Button>
            <Button variant="outline" onClick={() => navigate("/browse")}>
              <ApperIcon name="Filter" size={20} className="mr-2" />
              Browse by Category
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyLearning