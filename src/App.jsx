import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import CourseCatalog from "@/components/pages/CourseCatalog"
import MyLearning from "@/components/pages/MyLearning"
import Browse from "@/components/pages/Browse"
import Bookmarked from "@/components/pages/Bookmarked"
import CourseDetail from "@/components/pages/CourseDetail"
import LessonViewer from "@/components/pages/LessonViewer"

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<CourseCatalog />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route path="/bookmarked" element={<Bookmarked />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route path="/course/:courseId/lesson/:lessonId" element={<LessonViewer />} />
          </Routes>
        </Layout>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  )
}

export default App