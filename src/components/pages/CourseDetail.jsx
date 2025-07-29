import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { courseService } from "@/services/api/courseService";
import ApperIcon from "@/components/ApperIcon";
import LessonItem from "@/components/molecules/LessonItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import StarRating from "@/components/atoms/StarRating";
const CourseDetail = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [userRating, setUserRating] = useState(null)
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)
  
  // Content management state
  const [showAddContent, setShowAddContent] = useState(false)
  const [editingContent, setEditingContent] = useState(null)
  const [contentLoading, setContentLoading] = useState(false)
  const [contentForm, setContentForm] = useState({
    title: '',
    type: 'document',
    description: '',
    content: ''
})

const handleEditContent = (content) => {
  setEditingContent(content)
  setContentForm({
    title: content.title || '',
    type: content.type || 'document',
    description: content.description || '',
    content: content.content || ''
  })
  setShowAddContent(true)
}

const handleDeleteContent = async (contentId) => {
  if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
    return
  }
  
  try {
    const { contentService } = await import('@/services/api/contentService')
    await contentService.delete(contentId)
    
    // Update course state to remove deleted content
    setCourse(prev => ({
      ...prev,
      content: prev.content.filter(item => item.Id !== contentId)
    }))
    
    toast.success('Content deleted successfully!')
  } catch (err) {
    toast.error('Failed to delete content. Please try again.')
  }
}

const handleCloseContentModal = () => {
  setShowAddContent(false)
  setEditingContent(null)
  setContentForm({
    title: '',
    type: 'document',
    description: '',
    content: ''
  })
}

const handleContentSubmit = async (e) => {
  e.preventDefault()
  
  if (!contentForm.title.trim() || !contentForm.content.trim()) {
    toast.error('Title and content are required.')
    return
  }

  try {
    setContentLoading(true)
    const { contentService } = await import('@/services/api/contentService')
    
    const contentData = {
      ...contentForm,
      course: parseInt(courseId)
    }

    let result
    if (editingContent) {
      // Update existing content
      result = await contentService.update(editingContent.Id, contentData)
      
      // Update course state with updated content
      setCourse(prev => ({
        ...prev,
        content: prev.content.map(item => 
          item.Id === editingContent.Id ? { ...item, ...result } : item
        )
      }))
      
      toast.success('Content updated successfully!')
    } else {
      // Create new content
      result = await contentService.create(contentData)
      
      // Add new content to course state
      setCourse(prev => ({
        ...prev,
        content: [...(prev.content || []), result]
      }))
      
      toast.success('Content added successfully!')
    }
    
    handleCloseContentModal()
  } catch (err) {
    toast.error(editingContent ? 'Failed to update content.' : 'Failed to add content.')
  } finally {
    setContentLoading(false)
  }
}

const handleContentInputChange = (e) => {
  const { name, value } = e.target
  setContentForm(prev => ({
    ...prev,
    [name]: value
  }))
}
const loadCourse = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await courseService.getByIdWithProgress(parseInt(courseId))
      
      // Handle lessons field - database stores it as Text but component expects array
if (data && data.lessons) {
        if (typeof data.lessons === 'string') {
          try {
            // Try to parse as JSON first
            data.lessons = JSON.parse(data.lessons)
          } catch {
            // If not JSON, treat as comma-separated string
            data.lessons = data.lessons.split(',').map(lesson => lesson.trim()).filter(lesson => lesson)
          }
        }
      } else if (data) {
        data.lessons = []
      }

      // Load course content
      const { contentService } = await import('@/services/api/contentService');
      const courseContent = await contentService.getByCourse(courseId);
      data.content = courseContent || [];
      
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
            className="hover:text-primary-600 transition-colors duration-200">Courses
                    </button>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-gray-900">{course.title}</span>
    </nav>
    {/* Hero Section */}
    <div
        className="bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl overflow-hidden shadow-2xl mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 lg:p-12 text-white">
                <div className="flex items-center space-x-3 mb-4">
                    <Badge
                        variant={difficultyColors[course.difficulty] || "default"}
                        className="bg-white/20 text-white border-white/30">
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
                            <p className="font-semibold">{totalLessons}lessons</p>
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
                {isEnrolled && <div className="mb-6">
                    <p className="text-primary-100 text-sm mb-2">Your Progress</p>
                    <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                            style={{
                                width: `${progressPercentage}%`
                            }}></div>
                    </div>
                    <p className="text-sm text-primary-100 mt-1">
                        {completedLessons}of {totalLessons}lessons completed ({Math.round(progressPercentage)}%)
                                        </p>
                </div>}
                <div className="flex gap-3">
                    <Button
                        onClick={handleEnrollment}
                        className="bg-white text-primary-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold px-8 py-3">
                        <ApperIcon name={isEnrolled ? "Play" : "Plus"} size={20} className="mr-2" />
                        {isEnrolled ? "Continue Learning" : "Enroll Now"}
                    </Button>
                    {isEnrolled && <Button
                        onClick={handleUnenroll}
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-primary-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold px-6 py-3">
                        <ApperIcon name="UserMinus" size={20} className="mr-2" />Unenroll
                                        </Button>}
                </div>
            </div>
            <div className="relative">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover" />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
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
                        {course.averageRating > 0 ? `${course.averageRating}/5` : "No ratings"}
                    </span>
                </div>
                <p className="text-sm text-gray-600">
                    {course.ratingCount > 0 ? `Based on ${course.ratingCount} review${course.ratingCount !== 1 ? "s" : ""}` : "Be the first to rate this course"}
                </p>
            </div>
            {/* User Rating Section */}
            {isEnrolled && <div className="flex flex-col gap-3 sm:border-l sm:pl-6">
                <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                        {userRating ? "Your Rating" : "Rate this course"}
                    </h4>
                    <StarRating
                        rating={userRating || 0}
                        interactive={!isSubmittingRating}
                        onRatingChange={handleRatingSubmit}
                        size={18} />
                </div>
                {userRating && <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteRating}
                    disabled={isSubmittingRating}
                    className="w-fit text-red-600 border-red-300 hover:bg-red-50">Remove Rating
                                    </Button>}
            </div>}
            {!isEnrolled && <div className="sm:border-l sm:pl-6">
                <p className="text-sm text-gray-500">Enroll in this course to rate it
                                  </p>
            </div>}
        </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Content */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-semibold text-gray-900">Course Content
                                      </h2>
                    <Button
                        onClick={() => setShowAddContent(true)}
                        className="flex items-center space-x-2">
                        <ApperIcon name="Plus" size={16} />
                        <span>Add Content</span>
                    </Button>
                </div>
                {/* Content Items */}
                {course.content && course.content.length > 0 && <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <ApperIcon name="FileText" size={20} className="mr-2 text-primary-600" />Course Materials
                                        </h3>
                    <div className="space-y-4">
                        {course.content.map(content => <div
                            key={content.Id}
                            className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                            <div
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 font-semibold text-sm mr-4 flex-shrink-0">
                                <ApperIcon name="FileText" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">
                                            {content.title}
                                        </h4>
                                        <div className="flex items-center text-sm text-gray-500 mb-2">
                                            <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                                {content.type || "Document"}
                                            </span>
                                        </div>
                                        {content.description && <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                            {content.description}
                                        </p>}
                                        {content.content && <div
                                            className="text-gray-700 text-sm leading-relaxed max-h-20 overflow-hidden">
                                            {content.content.substring(0, 150)}
                                            {content.content.length > 150 && "..."}
                                        </div>}
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                                        <button
                                            onClick={() => handleEditContent(content)}
                                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                                            title="Edit content">
                                            <ApperIcon name="Edit2" size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteContent(content.Id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Delete content">
                                            <ApperIcon name="Trash2" size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                    </div>
                </div>}
                {/* Lessons */}
                {course.lessons && course.lessons.length > 0 && <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <ApperIcon name="Play" size={20} className="mr-2 text-primary-600" />Lessons
                                        </h3>
                    <div className="space-y-3">
                        {course.lessons.map(
                            lesson => <LessonItem key={lesson.Id} lesson={lesson} courseId={courseId} />
                        )}
                    </div>
                </div>}
                {(!course.lessons || course.lessons.length === 0) && (!course.content || course.content.length === 0) && <div className="text-center py-12">
                    <ApperIcon name="BookOpen" size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No course content available yet.</p>
                    <Button
                        onClick={() => setShowAddContent(true)}
                        variant="outline"
                        className="flex items-center space-x-2">
                        <ApperIcon name="Plus" size={16} />
                        <span>Add First Content</span>
                    </Button>
                </div>}
            </div>
            {/* Add/Edit Content Modal */}
            {(showAddContent || editingContent) && <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div
                    className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {editingContent ? "Edit Content" : "Add New Content"}
                            </h3>
                            <button
                                onClick={handleCloseContentModal}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <ApperIcon name="X" size={20} />
                            </button>
                        </div>
                    </div>
                    <form onSubmit={handleContentSubmit} className="p-6 space-y-6">
                        <div>
                            <label
                                htmlFor="content-title"
                                className="block text-sm font-semibold text-gray-700 mb-2">Title *
                                                    </label>
                            <input
                                id="content-title"
                                name="title"
                                type="text"
                                value={contentForm.title}
                                onChange={handleContentInputChange}
                                placeholder="Enter content title"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" />
                        </div>
                        <div>
                            <label
                                htmlFor="content-type"
                                className="block text-sm font-semibold text-gray-700 mb-2">Type
                                                    </label>
                            <select
                                id="content-type"
                                name="type"
                                value={contentForm.type}
                                onChange={handleContentInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
                                <option value="document">Document</option>
                                <option value="article">Article</option>
                                <option value="resource">Resource</option>
                                <option value="reference">Reference</option>
                                <option value="guide">Guide</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="content-description"
                                className="block text-sm font-semibold text-gray-700 mb-2">Description
                                                    </label>
                            <textarea
                                id="content-description"
                                name="description"
                                value={contentForm.description}
                                onChange={handleContentInputChange}
                                placeholder="Brief description of the content"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none" />
                        </div>
                        <div>
                            <label
                                htmlFor="content-body"
                                className="block text-sm font-semibold text-gray-700 mb-2">Content *
                                                    </label>
                            <textarea
                                id="content-body"
                                name="content"
                                value={contentForm.content}
                                onChange={handleContentInputChange}
                                placeholder="Enter the main content here..."
                                rows={8}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                            <Button
                                type="submit"
                                disabled={contentLoading}
                                className="flex items-center justify-center space-x-2 sm:flex-1">
                                {contentLoading ? <>
                                    <div
                                        className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span>{editingContent ? "Updating..." : "Creating..."}</span>
                                </> : <>
                                    <ApperIcon name={editingContent ? "Save" : "Plus"} size={16} />
                                    <span>{editingContent ? "Update Content" : "Add Content"}</span>
                                </>}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseContentModal}
                                disabled={contentLoading}
                                className="sm:flex-1">Cancel
                                                    </Button>
                        </div>
                    </form>
                </div>
            </div>}
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
                        {course.ratingCount > 0 ? `${course.ratingCount}+` : "0"}
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
                    <ApperIcon
                        name="Check"
                        size={16}
                        className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Master the fundamentals and advanced concepts</span>
                </li>
                <li className="flex items-start">
                    <ApperIcon
                        name="Check"
                        size={16}
                        className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Build real-world projects and applications</span>
                </li>
                <li className="flex items-start">
                    <ApperIcon
                        name="Check"
                        size={16}
                        className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Understand best practices and industry standards</span>
                </li>
                <li className="flex items-start">
                    <ApperIcon
                        name="Check"
                        size={16}
                        className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Prepare for career advancement opportunities</span>
                </li>
            </ul>
        </div>
        {/* Share Course */}
        <div
            className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200 p-6">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Share this course</h3>
            <div className="flex space-x-3">
                <Button variant="outline" size="sm" className="flex-1">
                    <ApperIcon name="Share2" size={16} className="mr-1" />Share
                                  </Button>
                <Button variant="outline" size="sm" className="flex-1">
                    <ApperIcon name="Heart" size={16} className="mr-1" />Save
                                  </Button>
            </div>
        </div>
    </div>
</div>
  )
}

export default CourseDetail