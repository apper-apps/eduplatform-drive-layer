const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const progressService = {
  async getUserProgress(userId = 1) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "userId" } },
          { field: { Name: "courseId" } },
          { field: { Name: "completedLessons" } },
          { field: { Name: "lastAccessed" } },
          { field: { Name: "progressPercentage" } }
        ],
        where: [
          { FieldName: "userId", Operator: "EqualTo", Values: [userId] }
        ]
      };

      const response = await apperClient.fetchRecords("progress", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching user progress:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getCourseProgress(userId = 1, courseId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "userId" } },
          { field: { Name: "courseId" } },
          { field: { Name: "completedLessons" } },
          { field: { Name: "lastAccessed" } },
          { field: { Name: "progressPercentage" } }
        ],
        where: [
          { FieldName: "userId", Operator: "EqualTo", Values: [userId] },
          { FieldName: "courseId", Operator: "EqualTo", Values: [courseId] }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await apperClient.fetchRecords("progress", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return null;
      }

      return response.data[0];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching course progress:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async updateLessonProgress(userId = 1, courseId, lessonId, completed = true) {
    try {
      let progressRecord = await this.getCourseProgress(userId, courseId);
      
      if (!progressRecord) {
        // Create new progress record
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        const createParams = {
          records: [{
            Name: `Progress ${userId}-${courseId}`,
            userId: userId,
            courseId: courseId,
            completedLessons: completed ? lessonId.toString() : "",
            lastAccessed: new Date().toISOString(),
            progressPercentage: 0
          }]
        };

        const createResponse = await apperClient.createRecord("progress", createParams);
        
        if (createResponse.success && createResponse.results) {
          const successfulRecords = createResponse.results.filter(result => result.success);
          return successfulRecords.length > 0 ? successfulRecords[0].data : null;
        }
      } else {
        // Update existing progress record
        const completedLessonsArray = progressRecord.completedLessons ? 
          progressRecord.completedLessons.split(',').map(id => parseInt(id)) : [];
        
        if (completed && !completedLessonsArray.includes(lessonId)) {
          completedLessonsArray.push(lessonId);
        } else if (!completed) {
          const index = completedLessonsArray.indexOf(lessonId);
          if (index > -1) {
            completedLessonsArray.splice(index, 1);
          }
        }

        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        const updateParams = {
          records: [{
            Id: progressRecord.Id,
            completedLessons: completedLessonsArray.join(','),
            lastAccessed: new Date().toISOString()
          }]
        };

        const updateResponse = await apperClient.updateRecord("progress", updateParams);
        
        if (updateResponse.success && updateResponse.results) {
          const successfulUpdates = updateResponse.results.filter(result => result.success);
          return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating lesson progress:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async calculateCourseProgress(userId = 1, courseId, totalLessons) {
    try {
      const progress = await this.getCourseProgress(userId, courseId);
      if (!progress) return 0;
      
      const completedLessonsArray = progress.completedLessons ? 
        progress.completedLessons.split(',').map(id => parseInt(id)) : [];
      const completedCount = completedLessonsArray.length;
      const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      
      // Update the stored percentage
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateParams = {
        records: [{
          Id: progress.Id,
          progressPercentage: percentage
        }]
      };

      await apperClient.updateRecord("progress", updateParams);
      
      return percentage;
    } catch (error) {
      console.error("Error calculating course progress:", error.message);
      return 0;
    }
  },

  async markLessonComplete(userId = 1, courseId, lessonId) {
    return await this.updateLessonProgress(userId, courseId, lessonId, true);
  },

  async markLessonIncomplete(userId = 1, courseId, lessonId) {
    return await this.updateLessonProgress(userId, courseId, lessonId, false);
  },

  async getEnrolledCoursesWithProgress(userId = 1) {
    try {
      const userProgress = await this.getUserProgress(userId);
      return userProgress.map(progress => ({
        courseId: progress.courseId,
        progress: progress
      }));
    } catch (error) {
      console.error("Error fetching enrolled courses with progress:", error.message);
      return [];
    }
  },

  // Enrollment management functions
  async enrollUser(userId = 1, courseId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Check if already enrolled
      const isAlreadyEnrolled = await this.isEnrolled(userId, courseId);
      if (isAlreadyEnrolled) {
        return { success: true, message: "Already enrolled" };
      }

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
      console.error("Error enrolling user:", error.message);
      throw error;
    }
  },

  async unenrollUser(userId = 1, courseId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Find enrollment record
      const findParams = {
        fields: [{ field: { Name: "Id" } }],
        where: [
          { FieldName: "userId", Operator: "EqualTo", Values: [userId] },
          { FieldName: "courseId", Operator: "EqualTo", Values: [courseId] }
        ]
      };

      const findResponse = await apperClient.fetchRecords("enrollment", findParams);
      
      if (!findResponse.success || !findResponse.data || findResponse.data.length === 0) {
        throw new Error("Not enrolled in this course");
      }

      const enrollmentId = findResponse.data[0].Id;

      // Delete enrollment
      const deleteParams = {
        RecordIds: [enrollmentId]
      };

      const deleteResponse = await apperClient.deleteRecord("enrollment", deleteParams);
      
      if (!deleteResponse.success) {
        throw new Error(deleteResponse.message);
      }

      return { success: true, message: "Successfully unenrolled" };
    } catch (error) {
      console.error("Error unenrolling user:", error.message);
      throw error;
    }
  },

  async isEnrolled(userId = 1, courseId) {
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
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await apperClient.fetchRecords("enrollment", params);
      return response.success && response.data && response.data.length > 0;
    } catch (error) {
      console.error("Error checking enrollment:", error.message);
      return false;
    }
  },

  async getEnrolledCourses(userId = 1) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "courseId" } }
        ],
        where: [
          { FieldName: "userId", Operator: "EqualTo", Values: [userId] }
        ]
      };

      const response = await apperClient.fetchRecords("enrollment", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(enrollment => enrollment.courseId);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error.message);
      return [];
    }
  },

  async getEnrolledCourseIds(userId = 1) {
    return await this.getEnrolledCourses(userId);
  }
};