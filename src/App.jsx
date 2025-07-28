import { Route, Router, Routes } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "@/index.css";
import Layout from "@/components/organisms/Layout";
import CourseCatalog from "@/components/pages/CourseCatalog";
import Browse from "@/components/pages/Browse";
import CourseDetail from "@/components/pages/CourseDetail";
import MyLearning from "@/components/pages/MyLearning";
import LessonViewer from "@/components/pages/LessonViewer";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
const handleSearch = (term) => {
    setSearchTerm(term);
  };
  return (
    <Router>
      <div className="App">
        <Layout searchTerm={searchTerm} onSearch={handleSearch}>
          <Routes>
            <Route path="/" element={<CourseCatalog searchTerm={searchTerm} />} />
            <Route path="/courses" element={<CourseCatalog searchTerm={searchTerm} />} />
            <Route path="/my-learning" element={<MyLearning />} />
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
  );
}

export default App;