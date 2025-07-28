// Mock user progress data - simulates user-specific lesson completion tracking
// Mock enrollment data - tracks which users are enrolled in which courses
const mockEnrollments = [
  { userId: 1, courseId: 1, enrolledAt: new Date('2024-01-15') },
  { userId: 1, courseId: 2, enrolledAt: new Date('2024-01-20') },
  { userId: 1, courseId: 3, enrolledAt: new Date('2024-01-10') }
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