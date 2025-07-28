import React, { useEffect, useState } from "react";
import VideoPlayer from "@/components/molecules/VideoPlayer";
import Quiz from "@/components/molecules/Quiz";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { courseService } from "@/services/api/courseService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";

const LessonViewer = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
const loadCourseAndLesson = async () => {
    try {
      setLoading(true)
      setError("")
      const courseData = await courseService.getById(parseInt(courseId))
      setCourse(courseData)
      
      const lesson = courseData.lessons?.find(l => l.Id === parseInt(lessonId))
      if (!lesson) {
        setError("Lesson not found")
        return
      }
      
      // Ensure lesson has a type, default to 'video' for backward compatibility
      const lessonWithType = {
        ...lesson,
        type: lesson.type || 'video'
      }
      
      setCurrentLesson(lessonWithType)
    } catch (err) {
      setError("Failed to load lesson content. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadCourseAndLesson()
  }, [courseId, lessonId])
  
const handleMarkComplete = () => {
    if (currentLesson && !currentLesson.completed) {
      // Update lesson completion status
      const updatedLesson = { ...currentLesson, completed: true }
      setCurrentLesson(updatedLesson)
      
      // Update course lessons
      const updatedLessons = course.lessons.map(lesson => 
        lesson.Id === currentLesson.Id ? updatedLesson : lesson
      )
      setCourse({ ...course, lessons: updatedLessons })
      
      // Show appropriate completion message based on lesson type
      const completionMessage = currentLesson.type === 'quiz' 
        ? "Quiz completed successfully!" 
        : "Lesson marked as complete!";
      toast.success(completionMessage);
    }
  }
  
  const handleNextLesson = () => {
    const currentIndex = course.lessons.findIndex(l => l.Id === currentLesson.Id)
    if (currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1]
      navigate(`/course/${courseId}/lesson/${nextLesson.Id}`)
    } else {
      toast.success("Congratulations! You've completed the course!")
      navigate(`/course/${courseId}`)
    }
  }
  
  const handlePreviousLesson = () => {
    const currentIndex = course.lessons.findIndex(l => l.Id === currentLesson.Id)
    if (currentIndex > 0) {
      const previousLesson = course.lessons[currentIndex - 1]
      navigate(`/course/${courseId}/lesson/${previousLesson.Id}`)
    }
  }
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Loading type="lesson" />
      </div>
    )
  }
  
  if (error || !course || !currentLesson) {
    return (
      <div className="max-w-7xl mx-auto">
        <Error 
          message={error || "Lesson not found"} 
          onRetry={loadCourseAndLesson} 
        />
      </div>
    )
  }
  
  const currentIndex = course.lessons.findIndex(l => l.Id === currentLesson.Id)
  const progress = ((currentIndex + 1) / course.lessons.length) * 100
  const isLastLesson = currentIndex === course.lessons.length - 1
  const isFirstLesson = currentIndex === 0
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb & Progress */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <button 
            onClick={() => navigate("/courses")}
            className="hover:text-primary-600 transition-colors duration-200"
          >
            Courses
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <button 
            onClick={() => navigate(`/course/${courseId}`)}
            className="hover:text-primary-600 transition-colors duration-200"
          >
            {course.title}
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-gray-900">{currentLesson.title}</span>
        </nav>
        
        {/* Progress Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Course Progress</span>
            <span className="text-sm text-gray-500">
              Lesson {currentIndex + 1} of {course.lessons.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
<div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Lesson Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-display font-bold mb-2">
                    {currentLesson.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-primary-100">
                    <div className="flex items-center">
                      <ApperIcon name="Clock" size={16} className="mr-1" />
                      <span>{currentLesson.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="BookOpen" size={16} className="mr-1" />
                      <span>Lesson {currentLesson.order}</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon 
                        name={currentLesson.type === 'video' ? 'Play' : currentLesson.type === 'text' ? 'FileText' : 'HelpCircle'} 
                        size={16} 
                        className="mr-1" 
                      />
                      <span className="capitalize">{currentLesson.type || 'Video'} Lesson</span>
                    </div>
                  </div>
                </div>
                
                {currentLesson.completed && (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white shadow-lg">
                    <ApperIcon name="Check" size={24} />
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Content Based on Lesson Type */}
            {currentLesson.type === 'video' && (
              <VideoPlayer 
                lessonTitle={currentLesson?.title}
                className="rounded-lg shadow-sm"
              />
            )}

{currentLesson.type === 'quiz' && (
              <Quiz 
                lesson={currentLesson} 
                onComplete={handleMarkComplete}
              />
            )}
            
            {/* Lesson Content */}
            <div className="p-8">
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    {currentLesson.content || `Welcome to "${currentLesson.title}". In this lesson, we'll explore key concepts and practical applications that will help you master this important topic.`}
                  </p>
                  
                  {currentLesson.type !== 'quiz' && (
                    <>
                      <p>
                        This comprehensive lesson covers fundamental principles and provides hands-on examples to reinforce your learning. By the end of this lesson, you'll have a solid understanding of the core concepts and be ready to apply them in real-world scenarios.
                      </p>
                      
                      <h3 className="text-xl font-display font-semibold text-gray-900 mt-8 mb-4">
                        Key Learning Objectives
                      </h3>
                      
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <ApperIcon name="CheckCircle" size={16} className="text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                          <span>Understand the fundamental concepts and terminology</span>
                        </li>
                        <li className="flex items-start">
                          <ApperIcon name="CheckCircle" size={16} className="text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                          <span>Learn practical applications and best practices</span>
                        </li>
                        <li className="flex items-start">
                          <ApperIcon name="CheckCircle" size={16} className="text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                          <span>Apply knowledge through hands-on exercises</span>
                        </li>
                        <li className="flex items-start">
                          <ApperIcon name="CheckCircle" size={16} className="text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                          <span>Prepare for the next lesson in the sequence</span>
                        </li>
                      </ul>
                      
                      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-200 mt-8">
                        <div className="flex items-start">
                          <ApperIcon name="Lightbulb" size={20} className="text-primary-600 mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Pro Tip</h4>
                            <p className="text-gray-700">
                              {currentLesson.type === 'text' 
                                ? 'Take your time reading through the content and make notes of key concepts. Text-based lessons allow you to learn at your own pace.'
                                : 'Take notes as you progress through the lesson and don\'t hesitate to pause and replay sections that need more attention. Learning at your own pace is key to mastering new concepts.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {currentLesson.type === 'quiz' && (
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6 border border-emerald-200 mt-8">
                      <div className="flex items-start">
                        <ApperIcon name="Target" size={20} className="text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Quiz Instructions</h4>
                          <p className="text-gray-700">
                            Answer all questions to the best of your ability. This quiz will help reinforce the concepts you've learned in previous lessons. Take your time and think through each answer carefully.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePreviousLesson}
              disabled={isFirstLesson}
              className="flex items-center"
            >
              <ApperIcon name="ChevronLeft" size={20} className="mr-2" />
              Previous Lesson
            </Button>
            
            <div className="flex items-center space-x-3">
              {!currentLesson.completed && (
                <Button
                  variant="success"
                  onClick={handleMarkComplete}
                >
                  <ApperIcon name="Check" size={20} className="mr-2" />
                  Mark Complete
                </Button>
              )}
              
              <Button onClick={handleNextLesson}>
                {isLastLesson ? "Finish Course" : "Next Lesson"}
                {!isLastLesson && <ApperIcon name="ChevronRight" size={20} className="ml-2" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Sidebar - Lesson List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 sticky top-6">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Course Lessons</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {course.lessons.map((lesson, index) => (
                <button
                  key={lesson.Id}
                  onClick={() => navigate(`/course/${courseId}/lesson/${lesson.Id}`)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    lesson.Id === currentLesson.Id
                      ? "bg-gradient-to-r from-primary-100 to-primary-50 border border-primary-300 text-primary-700"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mr-3 ${
                        lesson.Id === currentLesson.Id
                          ? "bg-primary-200 text-primary-700"
                          : "bg-gray-200 text-gray-600"
                      }`}>
                        {lesson.order}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${
                          lesson.Id === currentLesson.Id ? "text-primary-700" : "text-gray-900"
                        }`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-500">{lesson.duration}</p>
                      </div>
                    </div>
                    
                    {lesson.completed && (
                      <ApperIcon name="CheckCircle" size={16} className="text-emerald-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonViewer