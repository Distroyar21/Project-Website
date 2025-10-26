import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css'
import { LoginSignup } from './assets/LoginSignup/loginSignup'
import HomePage from './assets/HomePage/HomePage' 

function HomeWithLogin() {
  const navigate = useNavigate();
  return <HomePage onLoginClick={() => navigate('/login')} />
}


function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeWithLogin />} />
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
    </Router>
  )
}

export default App