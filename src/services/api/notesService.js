const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const notesService = {
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
          { field: { Name: "courseId" } },
          { field: { Name: "lessonId" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "lastUpdated" } }
        ],
        orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("note", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      if (!Number.isInteger(id)) {
        throw new Error("Invalid note ID");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "courseId" } },
          { field: { Name: "lessonId" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "lastUpdated" } }
        ]
      };

      const response = await apperClient.getRecordById("note", id, params);
      
      if (!response || !response.data) {
        throw new Error("Note not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching note with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getByLesson(courseId, lessonId) {
    try {
      if (!Number.isInteger(courseId) || !Number.isInteger(lessonId)) {
        throw new Error("Invalid course or lesson ID");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "courseId" } },
          { field: { Name: "lessonId" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "lastUpdated" } }
        ],
        where: [
          { FieldName: "courseId", Operator: "EqualTo", Values: [courseId] },
          { FieldName: "lessonId", Operator: "EqualTo", Values: [lessonId] }
        ],
        orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("note", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching lesson notes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByCourse(courseId) {
    try {
      if (!Number.isInteger(courseId)) {
        throw new Error("Invalid course ID");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "courseId" } },
          { field: { Name: "lessonId" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "lastUpdated" } }
        ],
        where: [
          { FieldName: "courseId", Operator: "EqualTo", Values: [courseId] }
        ],
        orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("note", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching course notes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(noteData) {
    try {
      if (!noteData.courseId || !noteData.lessonId || !noteData.title || !noteData.content) {
        throw new Error("Missing required note data");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: noteData.title.trim(),
          courseId: noteData.courseId,
          lessonId: noteData.lessonId,
          title: noteData.title.trim(),
          content: noteData.content.trim(),
          timestamp: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord("note", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create note ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating note:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, updates) {
    try {
      if (!Number.isInteger(id)) {
        throw new Error("Invalid note ID");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          ...(updates.title && { title: updates.title.trim() }),
          ...(updates.content && { content: updates.content.trim() }),
          lastUpdated: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord("note", params);
      
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
        console.error("Error updating note:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      if (!Number.isInteger(id)) {
        throw new Error("Invalid note ID");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord("note", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting note:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async search(query, courseId = null, lessonId = null) {
    try {
      if (!query || typeof query !== 'string') {
        return [];
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const whereConditions = [
        { FieldName: "title", Operator: "Contains", Values: [query.trim()] },
        { FieldName: "content", Operator: "Contains", Values: [query.trim()] }
      ];

      if (courseId) {
        whereConditions.push({ FieldName: "courseId", Operator: "EqualTo", Values: [courseId] });
      }

      if (lessonId) {
        whereConditions.push({ FieldName: "lessonId", Operator: "EqualTo", Values: [lessonId] });
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "courseId" } },
          { field: { Name: "lessonId" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "lastUpdated" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [{
            conditions: whereConditions.slice(0, 2),
            operator: "OR"
          }]
        }],
        orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("note", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching notes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};