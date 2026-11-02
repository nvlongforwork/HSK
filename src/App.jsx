import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import HskLevel from "./pages/HskLevel";
import Lesson from "./pages/Lesson";
import Section from "./pages/Section";
import ExerciseType from "./pages/ExerciseType";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hsk/:level" element={<HskLevel />} />
        <Route path="/hsk/:level/:lessonSlug" element={<Lesson />} />
        <Route path="/hsk/:level/:lessonSlug/:sectionId" element={<Section />} />
        <Route path="/hsk/:level/:lessonSlug/exercises/:exerciseId" element={<ExerciseType />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
