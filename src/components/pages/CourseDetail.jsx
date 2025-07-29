import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import LessonItem from "@/components/molecules/LessonItem"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import StarRating from "@/components/atoms/StarRating"
import { courseService } from "@/services/api/courseService"
import { toast } from "react-toastify"
const CourseDetail = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [userRating, setUserRating] = useState(null)
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)
const loadCourse = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await courseService.getByIdWithProgress(parseInt(courseId))
      setCourse(data)
      setUserRating(data.userRating)
      // Check actual enrollment status
      const enrollmentStatus = await courseService.checkEnrollment(parseInt(courseId))
      setIsEnrolled(enrollmentStatus)
    } catch (err) {
      setError("Failed to load course details. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadCourse()
  }, [courseId])
const handleRatingSubmit = async (rating) => {
    if (!isEnrolled) {
      toast.error("You must be enrolled to rate this course.")
      return
    }

    try {
      setIsSubmittingRating(true)
      
      if (userRating) {
        // Update existing rating
        await courseService.updateRating(1, parseInt(courseId), rating)
        toast.success("Rating updated successfully!")
      } else {
        // Create new rating
        await courseService.rateChapter(1, parseInt(courseId), rating)
        toast.success("Rating submitted successfully!")
      }
      
      setUserRating(rating)
      // Reload course to get updated average rating
      const updatedCourse = await courseService.getByIdWithProgress(parseInt(courseId))
      setCourse(prev => ({
        ...prev,
        averageRating: updatedCourse.averageRating,
        ratingCount: updatedCourse.ratingCount
      }))
      
    } catch (err) {
      toast.error(err.message || "Failed to submit rating. Please try again.")
    } finally {
      setIsSubmittingRating(false)
    }
  }

  const handleDeleteRating = async () => {
    if (!userRating) return

    try {
      setIsSubmittingRating(true)
      await courseService.deleteRating(1, parseInt(courseId))
      setUserRating(null)
      toast.success("Rating removed successfully!")
      
      // Reload course to get updated average rating
      const updatedCourse = await courseService.getByIdWithProgress(parseInt(courseId))
      setCourse(prev => ({
        ...prev,
        averageRating: updatedCourse.averageRating,
        ratingCount: updatedCourse.ratingCount
      }))
      
    } catch (err) {
      toast.error("Failed to remove rating. Please try again.")
    } finally {
      setIsSubmittingRating(false)
    }
  }
const handleEnrollment = async () => {
if (isEnrolled) {
      toast.success("Continuing your learning journey!")
      
      // Parse lessons data safely - handle both string and array formats
      let lessonsArray = [];
      if (course.lessons) {
        if (typeof course.lessons === 'string') {
          try {
            lessonsArray = JSON.parse(course.lessons);
          } catch (e) {
            console.error('Failed to parse lessons data:', e);
            lessonsArray = [];
          }
        } else if (Array.isArray(course.lessons)) {
          lessonsArray = course.lessons;
        }
      }
      
      // Navigate to first lesson if available
      if (lessonsArray && lessonsArray.length > 0 && lessonsArray[0]?.Id) {
        navigate(`/course/${courseId}/lesson/${lessonsArray[0].Id}`)
      } else {
        navigate(`/course/${courseId}`)
      }
    } else {
      try {
        await courseService.enroll(parseInt(courseId))
        setIsEnrolled(true)
        toast.success("Successfully enrolled in the course!")
      } catch (err) {
        toast.error("Failed to enroll in course. Please try again.")
      }
    }
  }

const handleUnenroll = async () => {
    try {
      await courseService.unenroll(parseInt(courseId))
      setIsEnrolled(false)
      setUserRating(null) // Clear user rating when unenrolling
      toast.success("Successfully unenrolled from the course.")
      // Reload course to get updated rating data
      loadCourse()
    } catch (err) {
      toast.error("Failed to unenroll from course. Please try again.")
    }
  }
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Loading type="course-detail" />
      </div>
    )
  }
  
  if (error || !course) {
    return (
      <div className="max-w-7xl mx-auto">
        <Error 
          message={error || "Course not found"} 
          onRetry={loadCourse} 
        />
      </div>
    )
  }
  
  const difficultyColors = {
    "Beginner": "success",
    "Intermediate": "warning", 
    "Advanced": "error"
  }
  
  const completedLessons = course.lessons?.filter(lesson => lesson.completed).length || 0
  const totalLessons = course.lessons?.length || 0
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <button 
          onClick={() => navigate("/courses")}
          className="hover:text-primary-600 transition-colors duration-200"
        >
          Courses
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-gray-900">{course.title}</span>
      </nav>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl overflow-hidden shadow-2xl mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 lg:p-12 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Badge 
                variant={difficultyColors[course.difficulty] || "default"}
                className="bg-white/20 text-white border-white/30"
              >
                {course.difficulty}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                {course.category}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-display font-bold mb-4">
              {course.title}
            </h1>
            
            <p className="text-primary-100 text-lg mb-6 leading-relaxed">
              {course.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <ApperIcon name="User" size={20} className="text-primary-200 mr-2" />
                <div>
                  <p className="text-primary-100 text-sm">Instructor</p>
                  <p className="font-semibold">{course.instructor}</p>
                </div>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Clock" size={20} className="text-primary-200 mr-2" />
                <div>
                  <p className="text-primary-100 text-sm">Duration</p>
                  <p className="font-semibold">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center">
                <ApperIcon name="BookOpen" size={20} className="text-primary-200 mr-2" />
                <div>
                  <p className="text-primary-100 text-sm">Lessons</p>
                  <p className="font-semibold">{totalLessons} lessons</p>
                </div>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Users" size={20} className="text-primary-200 mr-2" />
                <div>
                  <p className="text-primary-100 text-sm">Students</p>
                  <p className="font-semibold">1,250+</p>
                </div>
              </div>
            </div>
            
            {isEnrolled && (
              <div className="mb-6">
                <p className="text-primary-100 text-sm mb-2">Your Progress</p>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-primary-100 mt-1">
                  {completedLessons} of {totalLessons} lessons completed ({Math.round(progressPercentage)}%)
                </p>
              </div>
            )}
            
<div className="flex gap-3">
              <Button
                onClick={handleEnrollment}
                className="bg-white text-primary-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold px-8 py-3"
              >
                <ApperIcon 
                  name={isEnrolled ? "Play" : "Plus"} 
                  size={20} 
                  className="mr-2" 
                />
                {isEnrolled ? "Continue Learning" : "Enroll Now"}
              </Button>
              {isEnrolled && (
                <Button
                  onClick={handleUnenroll}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold px-6 py-3"
                >
                  <ApperIcon 
                    name="UserMinus" 
                    size={20} 
                    className="mr-2" 
                  />
                  Unenroll
                </Button>
              )}
            </div>
          </div>
<div className="relative">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Course Rating Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Rating</h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Average Rating Display */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-3 mb-2">
              <StarRating rating={course.averageRating || 0} size={20} />
              <span className="text-2xl font-bold text-gray-900">
                {course.averageRating > 0 ? `${course.averageRating}/5` : 'No ratings'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {course.ratingCount > 0 
                ? `Based on ${course.ratingCount} review${course.ratingCount !== 1 ? 's' : ''}`
                : 'Be the first to rate this course'
              }
            </p>
          </div>

          {/* User Rating Section */}
          {isEnrolled && (
            <div className="flex flex-col gap-3 sm:border-l sm:pl-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  {userRating ? 'Your Rating' : 'Rate this course'}
                </h4>
                <StarRating 
                  rating={userRating || 0}
                  interactive={!isSubmittingRating}
                  onRatingChange={handleRatingSubmit}  
                  size={18}
                />
              </div>
              {userRating && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteRating}
                  disabled={isSubmittingRating}
                  className="w-fit text-red-600 border-red-300 hover:bg-red-50"
                >
                  Remove Rating
                </Button>
              )}
            </div>
          )}
          
          {!isEnrolled && (
            <div className="sm:border-l sm:pl-6">
              <p className="text-sm text-gray-500">
                Enroll in this course to rate it
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
              Course Content
            </h2>
            
            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-3">
                {course.lessons.map((lesson) => (
                  <LessonItem
                    key={lesson.Id}
                    lesson={lesson}
                    courseId={courseId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="BookOpen" size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Course content is being prepared.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Course Stats</h3>
            <div className="space-y-4">
<div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ApperIcon name="Users" size={16} className="text-gray-500 mr-2" />
                  <span className="text-gray-600">Enrolled Students</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {course.ratingCount > 0 ? `${course.ratingCount}+` : '0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ApperIcon name="Users" size={16} className="text-primary-600 mr-2" />
                  <span className="text-gray-600">Enrolled</span>
                </div>
                <span className="font-semibold text-gray-900">1,250+</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ApperIcon name="Award" size={16} className="text-emerald-600 mr-2" />
                  <span className="text-gray-600">Certificate</span>
                </div>
                <span className="font-semibold text-gray-900">Yes</span>
              </div>
            </div>
          </div>
          
          {/* What You'll Learn */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
            <h3 className="font-display font-semibold text-gray-900 mb-4">What You'll Learn</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <ApperIcon name="Check" size={16} className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Master the fundamentals and advanced concepts</span>
              </li>
              <li className="flex items-start">
                <ApperIcon name="Check" size={16} className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Build real-world projects and applications</span>
              </li>
              <li className="flex items-start">
                <ApperIcon name="Check" size={16} className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Understand best practices and industry standards</span>
              </li>
              <li className="flex items-start">
                <ApperIcon name="Check" size={16} className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Prepare for career advancement opportunities</span>
              </li>
            </ul>
          </div>
          
          {/* Share Course */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200 p-6">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Share this course</h3>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="flex-1">
                <ApperIcon name="Share2" size={16} className="mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <ApperIcon name="Heart" size={16} className="mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail