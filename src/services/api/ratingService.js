import { progressService } from "./progressService"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const ratingService = {
  async getRatingsByCourse(courseId) {
    await delay(200)
    // This would normally call the progressService, but since we need direct access
    // to ratings data, we'll import the function directly
    return progressService.getRatingsByCourse ? 
      await progressService.getRatingsByCourse(courseId) : []
  },

  async getUserRating(userId, courseId) {
    await delay(150)
    return progressService.getUserRating ? 
      await progressService.getUserRating(userId, courseId) : null
  },

  async createRating(userId, courseId, rating) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error("Rating must be an integer between 1 and 5")
    }
    
    await delay(300)
    return progressService.createRating ? 
      await progressService.createRating(userId, courseId, rating) : null
  },

  async updateRating(userId, courseId, rating) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error("Rating must be an integer between 1 and 5")
    }
    
    await delay(250)
    return progressService.updateRating ? 
      await progressService.updateRating(userId, courseId, rating) : null
  },

  async deleteRating(userId, courseId) {
    await delay(200)
    return progressService.deleteRating ? 
      await progressService.deleteRating(userId, courseId) : false
  },

  async getCourseAverageRating(courseId) {
    await delay(150)
    return progressService.getCourseAverageRating ? 
      await progressService.getCourseAverageRating(courseId) : { average: 0, count: 0 }
  }
}