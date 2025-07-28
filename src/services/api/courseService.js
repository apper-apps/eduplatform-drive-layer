const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const courseService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "instructor" } },
          { field: { Name: "duration" } },
          { field: { Name: "category" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "lessons" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "ASC" }]
      };

      const response = await apperClient.fetchRecords("course", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getAllWithProgress(userId = 1) {
    try {
      const courses = await this.getAll();
      // In a real implementation, you would join with progress data
      return courses;
    } catch (error) {
      console.error("Error fetching courses with progress:", error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "instructor" } },
          { field: { Name: "duration" } },
          { field: { Name: "category" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "lessons" } }
        ]
      };

      const response = await apperClient.getRecordById("course", id, params);
      
      if (!response || !response.data) {
        throw new Error("Course not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getByIdWithProgress(id, userId = 1) {
    return await this.getById(id);
  },

  async create(courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: courseData.title || courseData.Name,
          title: courseData.title,
          description: courseData.description,
          thumbnail: courseData.thumbnail,
          instructor: courseData.instructor,
          duration: courseData.duration,
          category: courseData.category,
          difficulty: courseData.difficulty,
          lessons: courseData.lessons || ""
        }]
      };

      const response = await apperClient.createRecord("course", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          ...(updates.title && { title: updates.title }),
          ...(updates.description && { description: updates.description }),
          ...(updates.thumbnail && { thumbnail: updates.thumbnail }),
          ...(updates.instructor && { instructor: updates.instructor }),
          ...(updates.duration && { duration: updates.duration }),
          ...(updates.category && { category: updates.category }),
          ...(updates.difficulty && { difficulty: updates.difficulty }),
          ...(updates.lessons && { lessons: updates.lessons })
        }]
      };

      const response = await apperClient.updateRecord("course", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord("course", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  // Enrollment methods - using enrollment table
  async enroll(courseId, userId = 1) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Enrollment ${userId}-${courseId}`,
          userId: userId,
          courseId: courseId,
          enrolledAt: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord("enrollment", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return { success: true, message: "Successfully enrolled" };
    } catch (error) {
      console.error("Error enrolling in course:", error.message);
      throw error;
    }
  },

  async checkEnrollment(courseId, userId = 1) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [{ field: { Name: "Id" } }],
        where: [
          { FieldName: "userId", Operator: "EqualTo", Values: [userId] },
          { FieldName: "courseId", Operator: "EqualTo", Values: [courseId] }
        ]
      };

      const response = await apperClient.fetchRecords("enrollment", params);
      return response.success && response.data && response.data.length > 0;
    } catch (error) {
      console.error("Error checking enrollment:", error.message);
      return false;
    }
  },

  async getEnrolledCourses(userId = 1) {
    return await this.getAll(); // Simplified for now
  },

  async getBookmarkedCourses() {
    return await this.getAll(); // Simplified for now
  },

  // Rating methods - simplified
  async rateChapter(userId, courseId, rating) {
    await delay(300);
    return { success: true };
  },

  async updateRating(userId, courseId, rating) {
    await delay(250);
    return { success: true };
  },

  async deleteRating(userId, courseId) {
    await delay(200);
    return { success: true };
  }
};