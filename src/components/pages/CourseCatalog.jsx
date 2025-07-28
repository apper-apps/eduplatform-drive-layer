import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "@/services/api/courseService";
import ApperIcon from "@/components/ApperIcon";
import CourseCard from "@/components/molecules/CourseCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Browse from "@/components/pages/Browse";
import Button from "@/components/atoms/Button";
function CourseCatalog({ searchTerm = "" }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [coursesWithProgress, setCoursesWithProgress] = useState([])
  const [filter, setFilter] = useState("all")
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()
  const loadCourses = async () => {
    try {
      setLoading(true)
      setError("")
const data = await courseService.getAllWithProgress()
      setCourses(data)
      setCoursesWithProgress(data)
    } catch (err) {
      setError("Failed to load courses. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadCourses()
  }, [])
  
// Search courses when searchTerm changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = courseService.search(courses, searchTerm)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchTerm, courses])

  const filteredCourses = searchTerm.trim() 
    ? searchResults 
    : courses.filter(course => {
        if (filter === "all") return true
        return course.category.toLowerCase() === filter.toLowerCase()
      })
  
  const categories = ["all", ...new Set(courses.map(course => course.category))]
  
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
        <Error message={error} onRetry={loadCourses} />
      </div>
    )
  }
  
  if (courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <Empty
          title="No courses available"
          description="We're working on adding amazing courses for you. Check back soon!"
          actionText="Browse Categories"
          onAction={() => navigate("/browse")}
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
              Discover Your Next
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent ml-2">
                Learning Journey
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Explore our curated collection of courses designed to help you grow and succeed.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/browse")}
              className="hidden sm:flex"
            >
              <ApperIcon name="Filter" size={20} className="mr-2" />
              Browse Categories
            </Button>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(category)}
              className="capitalize"
            >
              {category === "all" ? "All Courses" : category}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">Total Courses</p>
              <p className="text-3xl font-display font-bold">{courses.length}</p>
            </div>
            <ApperIcon name="BookOpen" size={32} className="text-primary-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 text-sm font-medium mb-1">Categories</p>
              <p className="text-3xl font-display font-bold">{categories.length - 1}</p>
            </div>
            <ApperIcon name="Grid3X3" size={32} className="text-secondary-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Active Learners</p>
              <p className="text-3xl font-display font-bold">12.5k</p>
            </div>
            <ApperIcon name="Users" size={32} className="text-emerald-200" />
          </div>
        </div>
      </div>
      
      {/* Course Grid */}
{filteredCourses.length === 0 ? (
        <Empty
          title="No courses found"
          description={
            searchTerm.trim() 
              ? `No courses found for "${searchTerm}". Try a different search term.`
              : `No courses found for "${filter}" category. Try selecting a different category.`
          }
          actionText={searchTerm.trim() ? "Clear Search" : "View All Courses"}
          onAction={() => searchTerm.trim() ? window.location.reload() : setFilter("all")}
          icon="Search"
        />
      ) : (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.Id} 
              course={course} 
              progress={course.progress}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseCatalog;