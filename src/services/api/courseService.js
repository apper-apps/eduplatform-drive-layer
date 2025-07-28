import coursesData from "@/services/mockData/courses.json";
import { progressService } from "@/services/api/progressService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const courseService = {
  async getAll() {
    await delay(300)
    return [...coursesData]
  },

  // Real-time search function (synchronous for immediate results)
  search(courses, searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return courses
    }

    const term = searchTerm.toLowerCase().trim()
    
    return courses.filter(course => {
      // Search in title
      if (course.title && course.title.toLowerCase().includes(term)) {
        return true
      }
      
      // Search in description
      if (course.description && course.description.toLowerCase().includes(term)) {
        return true
      }
      
      // Search in category
      if (course.category && course.category.toLowerCase().includes(term)) {
        return true
      }
      
      // Search in instructor name
      if (course.instructor && course.instructor.toLowerCase().includes(term)) {
        return true
      }
return false
    })
  }
};