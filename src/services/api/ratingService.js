const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const ratingService = {
  async getRatingsByCourse(courseId) {
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
          { field: { Name: "rating" } },
          { field: { Name: "createdAt" } }
        ],
        where: [
          { FieldName: "courseId", Operator: "EqualTo", Values: [courseId] }
        ]
      };

      const response = await apperClient.fetchRecords("rating", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching course ratings:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getUserRating(userId, courseId) {
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
          { field: { Name: "rating" } },
          { field: { Name: "createdAt" } }
        ],
        where: [
          { FieldName: "userId", Operator: "EqualTo", Values: [userId] },
          { FieldName: "courseId", Operator: "EqualTo", Values: [courseId] }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await apperClient.fetchRecords("rating", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return null;
      }

      return response.data[0];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching user rating:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async createRating(userId, courseId, rating) {
    try {
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error("Rating must be an integer between 1 and 5");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Rating ${userId}-${courseId}`,
          userId: userId,
          courseId: courseId,
          rating: rating,
          createdAt: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord("rating", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating rating:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async updateRating(userId, courseId, rating) {
    try {
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error("Rating must be an integer between 1 and 5");
      }

      // First find the existing rating
      const existingRating = await this.getUserRating(userId, courseId);
      if (!existingRating) {
        throw new Error("Rating not found");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: existingRating.Id,
          rating: rating
        }]
      };

      const response = await apperClient.updateRecord("rating", params);
      
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
        console.error("Error updating rating:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async deleteRating(userId, courseId) {
    try {
      // First find the existing rating
      const existingRating = await this.getUserRating(userId, courseId);
      if (!existingRating) {
        throw new Error("Rating not found");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [existingRating.Id]
      };

      const response = await apperClient.deleteRecord("rating", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting rating:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getCourseAverageRating(courseId) {
    try {
      const ratings = await this.getRatingsByCourse(courseId);
      
      if (ratings.length === 0) {
        return { average: 0, count: 0 };
      }

      const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const average = Math.round((total / ratings.length) * 10) / 10;

      return { average, count: ratings.length };
    } catch (error) {
      console.error("Error calculating average rating:", error.message);
      return { average: 0, count: 0 };
    }
}
};