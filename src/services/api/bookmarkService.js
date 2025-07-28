function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const bookmarkService = {
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
          { field: { Name: "courseId" } }
        ]
      };

      const response = await apperClient.fetchRecords("bookmark", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(bookmark => bookmark.courseId);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching bookmarks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async toggle(courseId) {
    try {
      if (typeof courseId !== 'number') {
        throw new Error('Course ID must be a number');
      }

      const isCurrentlyBookmarked = await this.isBookmarked(courseId);
      
      if (isCurrentlyBookmarked) {
        await this.removeBookmark(courseId);
        return {
          courseId,
          isBookmarked: false,
          message: 'Course removed from bookmarks'
        };
      } else {
        await this.addBookmark(courseId);
        return {
          courseId,
          isBookmarked: true,
          message: 'Course bookmarked successfully'
        };
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error.message);
      throw error;
    }
  },

  async addBookmark(courseId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Bookmark for course ${courseId}`,
          courseId: courseId
        }]
      };

      const response = await apperClient.createRecord("bookmark", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding bookmark:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async isBookmarked(courseId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [{ field: { Name: "Id" } }],
        where: [
          { FieldName: "courseId", Operator: "EqualTo", Values: [courseId] }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await apperClient.fetchRecords("bookmark", params);
      return response.success && response.data && response.data.length > 0;
    } catch (error) {
      console.error("Error checking bookmark:", error.message);
      return false;
    }
  },

  async getBookmarkedCourses() {
    return await this.getAll();
  },

  async removeBookmark(courseId) {
    try {
      if (typeof courseId !== 'number') {
        throw new Error('Course ID must be a number');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First find the bookmark
      const findParams = {
        fields: [{ field: { Name: "Id" } }],
        where: [
          { FieldName: "courseId", Operator: "EqualTo", Values: [courseId] }
        ]
      };

      const findResponse = await apperClient.fetchRecords("bookmark", findParams);
      
      if (!findResponse.success || !findResponse.data || findResponse.data.length === 0) {
        throw new Error('Course not found in bookmarks');
      }

      const bookmarkId = findResponse.data[0].Id;

      // Delete the bookmark
      const deleteParams = {
        RecordIds: [bookmarkId]
      };

      const deleteResponse = await apperClient.deleteRecord("bookmark", deleteParams);
      
      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        throw new Error(deleteResponse.message);
      }

      return { courseId, message: 'Course removed from bookmarks' };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing bookmark:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};