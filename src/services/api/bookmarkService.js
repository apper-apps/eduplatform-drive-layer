// Mock bookmark data - stored as array of course IDs
let bookmarkedCourseIds = [1, 3] // Sample bookmarked courses

// Simulate API delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const bookmarkService = {
  async getAll() {
    await delay(200)
    return [...bookmarkedCourseIds]
  },

  async toggle(courseId) {
    await delay(250)
    
    if (typeof courseId !== 'number') {
      throw new Error('Course ID must be a number')
    }

    const index = bookmarkedCourseIds.indexOf(courseId)
    let isBookmarked = false
    
    if (index === -1) {
      // Add bookmark
      bookmarkedCourseIds.push(courseId)
      isBookmarked = true
    } else {
      // Remove bookmark
      bookmarkedCourseIds.splice(index, 1)
      isBookmarked = false
    }
    
    return { 
      courseId, 
      isBookmarked,
      message: isBookmarked ? 'Course bookmarked successfully' : 'Course removed from bookmarks'
    }
  },

  async isBookmarked(courseId) {
    await delay(100)
    return bookmarkedCourseIds.includes(courseId)
  },

  async getBookmarkedCourses() {
    await delay(200)
    return [...bookmarkedCourseIds]
  },

  async removeBookmark(courseId) {
    await delay(200)
    
    if (typeof courseId !== 'number') {
      throw new Error('Course ID must be a number')
    }

    const index = bookmarkedCourseIds.indexOf(courseId)
    if (index !== -1) {
      bookmarkedCourseIds.splice(index, 1)
      return { courseId, message: 'Course removed from bookmarks' }
    }
    
    throw new Error('Course not found in bookmarks')
  }
}