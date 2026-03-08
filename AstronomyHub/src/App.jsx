import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './assets/LoginSignup/Login';
import { SignUp } from './assets/LoginSignup/SignUp';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import VideoSearchPage from './pages/VideoSearchPage';
import ImageSearchPage from './pages/ImageSearchPage';
import NewsSearchPage from './pages/NewsSearchPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Application Routes with Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="videos" element={<VideoSearchPage />} />
          <Route path="images" element={<ImageSearchPage />} />
          <Route path="news" element={<NewsSearchPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        {/* Auth Routes without Layout */}
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
      </Routes>
    </Router>
  )
}

export default App;