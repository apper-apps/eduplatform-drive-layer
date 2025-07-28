import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CourseCard from "@/components/molecules/CourseCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"
import { bookmarkService } from "@/services/api/bookmarkService"
import { toast } from "react-toastify"

const Bookmarked = () => {
  const [bookmarkedCourses, setBookmarkedCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("title")
  const navigate = useNavigate()
  
  const loadBookmarkedCourses = async () => {
    try {
      setLoading(true)
      setError("")
      const courses = await courseService.getBookmarkedCourses()
      setBookmarkedCourses(courses)
    } catch (err) {
      setError("Failed to load bookmarked courses. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookmarkedCourses()
  }, [])

  const handleRemoveBookmark = async (courseId) => {
    try {
      await bookmarkService.removeBookmark(courseId)
      setBookmarkedCourses(prev => prev.filter(course => course.Id !== courseId))
      toast.success("Course removed from bookmarks")
    } catch (error) {
      toast.error("Failed to remove bookmark. Please try again.")
    }
  }

  const handleClearAllBookmarks = async () => {
    if (bookmarkedCourses.length === 0) return
    
    if (window.confirm("Are you sure you want to remove all bookmarks? This action cannot be undone.")) {
      try {
        // Remove all bookmarks
        await Promise.all(
          bookmarkedCourses.map(course => bookmarkService.removeBookmark(course.Id))
        )
        setBookmarkedCourses([])
        toast.success("All bookmarks cleared successfully")
      } catch (error) {
        toast.error("Failed to clear bookmarks. Please try again.")
      }
    }
  }

  // Filter and sort courses
  const filteredAndSortedCourses = bookmarkedCourses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "category":
          return a.category.localeCompare(b.category)
        case "duration":
          const aDuration = parseInt(a.duration.replace(/[^\d]/g, "")) || 0
          const bDuration = parseInt(b.duration.replace(/[^\d]/g, "")) || 0
          return aDuration - bDuration
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0)
        default:
          return 0
      }
    })

  const categories = ["all", ...new Set(bookmarkedCourses.map(course => course.category))]

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
        <Error message={error} onRetry={loadBookmarkedCourses} />
      </div>
    )
  }

  if (bookmarkedCourses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <Empty
          title="No bookmarked courses yet"
          description="Save courses to your favorites by clicking the heart icon on any course card. Your bookmarked courses will appear here for easy access."
          actionText="Browse Courses"
          onAction={() => navigate("/courses")}
          icon="Heart"
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
              My
              <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent ml-2">
                Bookmarked
              </span>
              <span className="ml-2">Courses</span>
            </h1>
            <p className="text-lg text-gray-600">
              Your saved courses for quick access and future learning.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/courses")}
              className="hidden sm:flex"
            >
              <ApperIcon name="Plus" size={20} className="mr-2" />
              Find More Courses
            </Button>
            {bookmarkedCourses.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearAllBookmarks}
                className="hidden sm:flex text-red-600 border-red-200 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={20} className="mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-1">Total Bookmarks</p>
              <p className="text-3xl font-display font-bold">{bookmarkedCourses.length}</p>
            </div>
            <ApperIcon name="Heart" size={32} className="text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">Categories</p>
              <p className="text-3xl font-display font-bold">{categories.length - 1}</p>
            </div>
            <ApperIcon name="Grid3X3" size={32} className="text-primary-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Avg. Rating</p>
              <p className="text-3xl font-display font-bold">
                {bookmarkedCourses.length > 0 
                  ? (bookmarkedCourses.reduce((sum, course) => sum + (course.averageRating || 0), 0) / bookmarkedCourses.length).toFixed(1)
                  : "0"
                }
              </p>
            </div>
            <ApperIcon name="Star" size={32} className="text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search bookmarked courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="title">Sort by Title</option>
              <option value="category">Sort by Category</option>
              <option value="duration">Sort by Duration</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-display font-semibold text-gray-900">
            {filteredAndSortedCourses.length} Course{filteredAndSortedCourses.length !== 1 ? "s" : ""}
          </h2>
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center">
              <ApperIcon name="Search" size={14} className="mr-1" />
              "{searchQuery}"
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="primary" className="flex items-center">
              <ApperIcon name="Filter" size={14} className="mr-1" />
              {selectedCategory}
            </Badge>
          )}
        </div>
        
        {(searchQuery || selectedCategory !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <ApperIcon name="X" size={16} className="mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Course Grid */}
      {filteredAndSortedCourses.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-4">
            No bookmarked courses match your current search and filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourses.map((course) => (
            <div key={course.Id} className="relative group">
              <CourseCard course={course} />
              <button
                onClick={() => handleRemoveBookmark(course.Id)}
                className="absolute top-4 left-4 p-2 rounded-full bg-red-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                title="Remove from bookmarks"
              >
                <ApperIcon name="X" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="mt-12 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8 border border-red-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white mb-4">
            <ApperIcon name="Heart" size={32} />
          </div>
          <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2">
            Love Learning?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Discover more amazing courses to add to your favorites. Explore new topics and expand your knowledge.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => navigate("/courses")}>
              <ApperIcon name="Search" size={20} className="mr-2" />
              Explore More Courses
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

export default Bookmarked