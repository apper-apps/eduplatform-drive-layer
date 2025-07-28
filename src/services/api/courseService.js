import coursesData from "@/services/mockData/courses.json";
import { ratingService } from "@/services/api/ratingService";
import { progressService } from "@/services/api/progressService";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const courseService = {
async getAll() {
    await delay(300)
    const courses = [...coursesData]
    
    // Add rating data to each course
    const coursesWithRatings = await Promise.all(
      courses.map(async (course) => {
        const ratingData = await ratingService.getCourseAverageRating(course.Id)
        return {
          ...course,
          averageRating: ratingData.average,
          ratingCount: ratingData.count
        }
      })
    )
    
    return coursesWithRatings
  },

async getAllWithProgress(userId = 1) {
    await delay(350)
    const courses = [...coursesData]
    const userProgress = await progressService.getUserProgress(userId)
    
    // Add both progress and rating data
    const coursesWithData = await Promise.all(
      courses.map(async (course) => {
        const progress = userProgress.find(p => p.courseId === course.Id)
        const ratingData = await ratingService.getCourseAverageRating(course.Id)
        
        return {
          ...course,
          progress: progress || null,
          averageRating: ratingData.average,
          ratingCount: ratingData.count
        }
      })
    )
    
    return coursesWithData
  },

async getById(id) {
    await delay(250)
    const course = coursesData.find(course => course.Id === id)
    if (!course) {
      throw new Error("Course not found")
    }
    
    // Add rating data
    const ratingData = await ratingService.getCourseAverageRating(id)
    
    return { 
      ...course,
      averageRating: ratingData.average,
      ratingCount: ratingData.count
    }
  },

  async getByIdWithProgress(id, userId = 1) {
await delay(300)
    const course = coursesData.find(course => course.Id === id)
    if (!course) {
      throw new Error("Course not found")
    }
    
    const progress = await progressService.getCourseProgress(userId, id)
    const ratingData = await ratingService.getCourseAverageRating(id)
    const userRating = await ratingService.getUserRating(userId, id)
    
    const courseWithProgress = { 
      ...course,
      averageRating: ratingData.average,
      ratingCount: ratingData.count,
      userRating: userRating ? userRating.rating : null
    }
    
    if (progress) {
      courseWithProgress.lessons = course.lessons?.map(lesson => ({
        ...lesson,
        completed: progress.completedLessons.includes(lesson.Id)
      })) || []
      courseWithProgress.progress = progress
    }
    
    return courseWithProgress
  },

  async create(courseData) {
    await delay(400)
    const newId = Math.max(...coursesData.map(course => course.Id)) + 1
    const newCourse = {
      Id: newId,
      ...courseData,
      lessons: courseData.lessons || []
    }
    coursesData.push(newCourse)
    return { ...newCourse }
  },

  async update(id, updates) {
    await delay(350)
    const index = coursesData.findIndex(course => course.Id === id)
    if (index === -1) {
      throw new Error("Course not found")
    }
    coursesData[index] = { ...coursesData[index], ...updates }
    return { ...coursesData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = coursesData.findIndex(course => course.Id === id)
    if (index === -1) {
      throw new Error("Course not found")
    }
    const deletedCourse = coursesData.splice(index, 1)[0]
    return { ...deletedCourse }
  },

async updateLessonProgress(courseId, lessonId, completed, userId = 1) {
    await delay(200)
    const course = coursesData.find(c => c.Id === courseId)
    if (!course) {
      throw new Error("Course not found")
    }
    
    const lesson = course.lessons?.find(l => l.Id === lessonId)
    if (!lesson) {
      throw new Error("Lesson not found")
    }
    
    // Update progress service
    const progress = await progressService.updateLessonProgress(userId, courseId, lessonId, completed)
    
    // Calculate new progress percentage
    const totalLessons = course.lessons?.length || 0
    progress.progressPercentage = await progressService.calculateCourseProgress(userId, courseId, totalLessons)
    
    return progress
  },

  // Enrollment management methods
  async enroll(courseId, userId = 1) {
    await delay(300)
    const course = coursesData.find(c => c.Id === courseId)
    if (!course) {
      throw new Error("Course not found")
    }
    
    return await progressService.enrollUser(userId, courseId)
  },

  async unenroll(courseId, userId = 1) {
    await delay(300)
    const course = coursesData.find(c => c.Id === courseId)
    if (!course) {
      throw new Error("Course not found")
    }
    
    return await progressService.unenrollUser(userId, courseId)
  },

  async checkEnrollment(courseId, userId = 1) {
    await delay(200)
    return await progressService.isEnrolled(userId, courseId)
  },

  async getEnrolledCourses(userId = 1) {
    await delay(350)
    const enrolledCourseIds = await progressService.getEnrolledCourses(userId)
    const enrolledCourses = coursesData.filter(course => enrolledCourseIds.includes(course.Id))
    
    // Get progress data for enrolled courses
    const userProgress = await progressService.getUserProgress(userId)
    
    return enrolledCourses.map(course => {
      const progress = userProgress.find(p => p.courseId === course.Id)
      return {
        ...course,
        progress: progress ? progress.progressPercentage : 0,
        lastAccessed: progress ? progress.lastAccessed : new Date(),
        completedLessons: progress ? progress.completedLessons.length : 0,
        progressData: progress
}
    })
  },

  // Rating methods
  async rateChapter(userId, courseId, rating) {
    await delay(300)
    return await ratingService.createRating(userId, courseId, rating)
  },

  async updateRating(userId, courseId, rating) {
    await delay(250)
    return await ratingService.updateRating(userId, courseId, rating)
  },

  async deleteRating(userId, courseId) {
    await delay(200)
    return await ratingService.deleteRating(userId, courseId)
  }
}