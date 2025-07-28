// Mock user progress data - simulates user-specific lesson completion tracking
// Mock enrollment data - tracks which users are enrolled in which courses
const mockEnrollments = [
  { userId: 1, courseId: 1, enrolledAt: new Date('2024-01-15') },
  { userId: 1, courseId: 2, enrolledAt: new Date('2024-01-20') },
  { userId: 1, courseId: 3, enrolledAt: new Date('2024-01-10') }
]

const mockRatings = [
  { Id: 1, userId: 1, courseId: 1, rating: 5, createdAt: new Date('2024-01-20') },
  { Id: 2, userId: 2, courseId: 1, rating: 4, createdAt: new Date('2024-01-18') },
  { Id: 3, userId: 3, courseId: 1, rating: 5, createdAt: new Date('2024-01-22') },
  { Id: 4, userId: 4, courseId: 1, rating: 4, createdAt: new Date('2024-01-19') },
  { Id: 5, userId: 1, courseId: 2, rating: 4, createdAt: new Date('2024-01-25') },
  { Id: 6, userId: 2, courseId: 2, rating: 5, createdAt: new Date('2024-01-24') },
  { Id: 7, userId: 3, courseId: 2, rating: 4, createdAt: new Date('2024-01-23') },
  { Id: 8, userId: 1, courseId: 3, rating: 5, createdAt: new Date('2024-01-16') },
  { Id: 9, userId: 2, courseId: 3, rating: 4, createdAt: new Date('2024-01-17') },
  { Id: 10, userId: 3, courseId: 3, rating: 5, createdAt: new Date('2024-01-18') },
  { Id: 11, userId: 4, courseId: 3, rating: 5, createdAt: new Date('2024-01-19') },
  { Id: 12, userId: 5, courseId: 4, rating: 4, createdAt: new Date('2024-01-21') },
  { Id: 13, userId: 6, courseId: 4, rating: 5, createdAt: new Date('2024-01-22') },
  { Id: 14, userId: 7, courseId: 4, rating: 4, createdAt: new Date('2024-01-23') },
  { Id: 15, userId: 8, courseId: 5, rating: 5, createdAt: new Date('2024-01-24') },
  { Id: 16, userId: 9, courseId: 5, rating: 4, createdAt: new Date('2024-01-25') },
  { Id: 17, userId: 10, courseId: 5, rating: 4, createdAt: new Date('2024-01-26') }
]

const mockUserProgress = [
  {
    userId: 1, // Simulating current user ID
    courseId: 1,
    completedLessons: [1, 2, 3], // Lesson IDs that are completed
    lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    progressPercentage: 50
  },
  {
    userId: 1,
    courseId: 2, 
    completedLessons: [7, 8],
    lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    progressPercentage: 33
  },
  {
    userId: 1,
    courseId: 3,
    completedLessons: [13, 14, 15, 16, 17, 18],
    lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    progressPercentage: 100
  }
]

// Helper function to add delay for realistic API behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const progressService = {
  async getUserProgress(userId = 1) {
    await delay(200)
    return mockUserProgress.filter(progress => progress.userId === userId).map(p => ({ ...p }))
  },

  async getCourseProgress(userId = 1, courseId) {
    await delay(150)
    const progress = mockUserProgress.find(p => p.userId === userId && p.courseId === courseId)
    return progress ? { ...progress } : null
  },

  async updateLessonProgress(userId = 1, courseId, lessonId, completed = true) {
    await delay(250)
    let progressRecord = mockUserProgress.find(p => p.userId === userId && p.courseId === courseId)
    
    if (!progressRecord) {
      progressRecord = {
        userId,
        courseId,
        completedLessons: [],
        lastAccessed: new Date(),
        progressPercentage: 0
      }
      mockUserProgress.push(progressRecord)
    }
    
    if (completed && !progressRecord.completedLessons.includes(lessonId)) {
      progressRecord.completedLessons.push(lessonId)
    } else if (!completed) {
      progressRecord.completedLessons = progressRecord.completedLessons.filter(id => id !== lessonId)
    }
    
    progressRecord.lastAccessed = new Date()
    
    return { ...progressRecord }
  },

  async calculateCourseProgress(userId = 1, courseId, totalLessons) {
    await delay(100)
    const progress = await this.getCourseProgress(userId, courseId)
    if (!progress) return 0
    
    const completedCount = progress.completedLessons.length
    const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
    
    // Update the stored percentage
    progress.progressPercentage = percentage
    
    return percentage
  },

  async markLessonComplete(userId = 1, courseId, lessonId) {
    await delay(300)
    return await this.updateLessonProgress(userId, courseId, lessonId, true)
  },
async markLessonIncomplete(userId = 1, courseId, lessonId) {
    await delay(300)
    return await this.updateLessonProgress(userId, courseId, lessonId, false)
  },

  async getEnrolledCoursesWithProgress(userId = 1) {
    await delay(200)
    const userProgress = await this.getUserProgress(userId)
    return userProgress.map(progress => ({
      courseId: progress.courseId,
      progress: { ...progress }
    }))
  },

  // Rating management functions
  async getRatingsByCourse(courseId) {
    await delay(200)
    return mockRatings.filter(rating => rating.courseId === courseId).map(rating => ({ ...rating }))
  },

  async getUserRating(userId, courseId) {
    await delay(150)
    const rating = mockRatings.find(r => r.userId === userId && r.courseId === courseId)
    return rating ? { ...rating } : null
  },

  async createRating(userId, courseId, ratingValue) {
    await delay(300)
    
    // Check if user is enrolled
    const isEnrolled = mockEnrollments.some(e => e.userId === userId && e.courseId === courseId)
    if (!isEnrolled) {
      throw new Error("Must be enrolled in course to rate it")
    }
    
    // Check if user already rated this course
    const existingRating = mockRatings.find(r => r.userId === userId && r.courseId === courseId)
    if (existingRating) {
      throw new Error("User has already rated this course")
    }
    
    const newRating = {
      Id: Math.max(...mockRatings.map(r => r.Id), 0) + 1,
      userId,
      courseId,
      rating: ratingValue,
      createdAt: new Date()
    }
    
    mockRatings.push(newRating)
    return { ...newRating }
  },

  async updateRating(userId, courseId, ratingValue) {
    await delay(250)
    
    const ratingIndex = mockRatings.findIndex(r => r.userId === userId && r.courseId === courseId)
    if (ratingIndex === -1) {
      throw new Error("Rating not found")
    }
    
    mockRatings[ratingIndex].rating = ratingValue
    mockRatings[ratingIndex].updatedAt = new Date()
    
    return { ...mockRatings[ratingIndex] }
  },

  async deleteRating(userId, courseId) {
    await delay(200)
    
    const ratingIndex = mockRatings.findIndex(r => r.userId === userId && r.courseId === courseId)
    if (ratingIndex === -1) {
      throw new Error("Rating not found")
    }
    
    mockRatings.splice(ratingIndex, 1)
    return true
  },

  async getCourseAverageRating(courseId) {
    await delay(150)
    const courseRatings = mockRatings.filter(r => r.courseId === courseId)
    
    if (courseRatings.length === 0) {
      return { average: 0, count: 0 }
    }
    
    const total = courseRatings.reduce((sum, rating) => sum + rating.rating, 0)
    const average = Math.round((total / courseRatings.length) * 10) / 10 // Round to 1 decimal
    
    return { average, count: courseRatings.length }
  },

  // Enrollment management functions
  async enrollUser(userId = 1, courseId) {
    await delay(250)
    const existingEnrollment = mockEnrollments.find(e => e.userId === userId && e.courseId === courseId)
    
    if (existingEnrollment) {
      return { success: true, message: "Already enrolled" }
    }
    
    mockEnrollments.push({
      userId,
      courseId,
      enrolledAt: new Date()
    })
    
    return { success: true, message: "Successfully enrolled" }
  },

  async unenrollUser(userId = 1, courseId) {
    await delay(250)
    const enrollmentIndex = mockEnrollments.findIndex(e => e.userId === userId && e.courseId === courseId)
    
    if (enrollmentIndex === -1) {
      throw new Error("Not enrolled in this course")
    }
    
    mockEnrollments.splice(enrollmentIndex, 1)
    
    // Also remove progress data when unenrolling
    const progressIndex = mockUserProgress.findIndex(p => p.userId === userId && p.courseId === courseId)
    if (progressIndex !== -1) {
      mockUserProgress.splice(progressIndex, 1)
    }
    
    // Also remove ratings when unenrolling
    const ratingIndex = mockRatings.findIndex(r => r.userId === userId && r.courseId === courseId)
    if (ratingIndex !== -1) {
      mockRatings.splice(ratingIndex, 1)
    }
    
    return { success: true, message: "Successfully unenrolled" }
  },

  async isEnrolled(userId = 1, courseId) {
    await delay(150)
    return mockEnrollments.some(e => e.userId === userId && e.courseId === courseId)
  },

  async getEnrolledCourses(userId = 1) {
    await delay(200)
    return mockEnrollments
      .filter(e => e.userId === userId)
      .map(e => e.courseId)
  }
}