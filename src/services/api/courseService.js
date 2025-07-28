import coursesData from "@/services/mockData/courses.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const courseService = {
  async getAll() {
    await delay(300)
    return [...coursesData]
  },

  async getById(id) {
    await delay(250)
    const course = coursesData.find(course => course.Id === id)
    if (!course) {
      throw new Error("Course not found")
    }
    return { ...course }
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
  }
}