const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock notes data storage
let notesData = [
  {
    Id: 1,
    courseId: 1,
    lessonId: 1,
    title: "Key Concepts",
    content: "Remember to focus on component lifecycle and state management patterns.",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    lastUpdated: new Date(Date.now() - 86400000).toISOString()
  },
  {
    Id: 2,
    courseId: 1,
    lessonId: 1,
    title: "Important Resources",
    content: "Check the React documentation for hooks best practices. The useEffect dependency array is crucial.",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    lastUpdated: new Date(Date.now() - 3600000).toISOString()
  }
]

let nextId = 3

export const notesService = {
  async getAll() {
    await delay(200)
    return [...notesData]
  },

  async getById(id) {
    await delay(150)
    if (!Number.isInteger(id)) {
      throw new Error("Invalid note ID")
    }
    
    const note = notesData.find(note => note.Id === id)
    if (!note) {
      throw new Error("Note not found")
    }
    return { ...note }
  },

  async getByLesson(courseId, lessonId) {
    await delay(200)
    if (!Number.isInteger(courseId) || !Number.isInteger(lessonId)) {
      throw new Error("Invalid course or lesson ID")
    }
    
    return notesData
      .filter(note => note.courseId === courseId && note.lessonId === lessonId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(note => ({ ...note }))
  },

  async getByCourse(courseId) {
    await delay(200)
    if (!Number.isInteger(courseId)) {
      throw new Error("Invalid course ID")
    }
    
    return notesData
      .filter(note => note.courseId === courseId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(note => ({ ...note }))
  },

  async create(noteData) {
    await delay(250)
    if (!noteData.courseId || !noteData.lessonId || !noteData.title || !noteData.content) {
      throw new Error("Missing required note data")
    }

    const newNote = {
      Id: nextId++,
      courseId: noteData.courseId,
      lessonId: noteData.lessonId,
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
    
    notesData.push(newNote)
    return { ...newNote }
  },

  async update(id, updates) {
    await delay(200)
    if (!Number.isInteger(id)) {
      throw new Error("Invalid note ID")
    }
    
    const index = notesData.findIndex(note => note.Id === id)
    if (index === -1) {
      throw new Error("Note not found")
    }
    
    const updatedNote = {
      ...notesData[index],
      ...updates,
      Id: notesData[index].Id, // Preserve original ID
      timestamp: notesData[index].timestamp, // Preserve creation time
      lastUpdated: new Date().toISOString()
    }
    
    if (updatedNote.title) {
      updatedNote.title = updatedNote.title.trim()
    }
    if (updatedNote.content) {
      updatedNote.content = updatedNote.content.trim()
    }
    
    notesData[index] = updatedNote
    return { ...updatedNote }
  },

  async delete(id) {
    await delay(200)
    if (!Number.isInteger(id)) {
      throw new Error("Invalid note ID")
    }
    
    const index = notesData.findIndex(note => note.Id === id)
    if (index === -1) {
      throw new Error("Note not found")
    }
    
    const deletedNote = notesData.splice(index, 1)[0]
    return { ...deletedNote }
  },

  async search(query, courseId = null, lessonId = null) {
    await delay(200)
    if (!query || typeof query !== 'string') {
      return []
    }
    
    const searchTerm = query.toLowerCase().trim()
    let filteredNotes = [...notesData]
    
    if (courseId) {
      filteredNotes = filteredNotes.filter(note => note.courseId === courseId)
    }
    
    if (lessonId) {
      filteredNotes = filteredNotes.filter(note => note.lessonId === lessonId)
    }
    
    return filteredNotes
      .filter(note => 
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(note => ({ ...note }))
  }
}