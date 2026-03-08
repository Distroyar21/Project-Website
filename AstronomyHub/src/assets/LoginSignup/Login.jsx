import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import AsteroidBackground from '../../components/AsteroidBackground'
import { login, googleLogin } from '../../services/api'

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response) => {
    try {
      const data = await googleLogin(response.credential);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || "Google login failed");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login({ email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server connection failed");
    }
  }

  return (
    <AsteroidBackground>
      <form onSubmit={handleSubmit}
      className="min-h-screen flex items-center justify-end pr-20">
      
      <div className="flex flex-col gap-6 items-center justify-center
                      w-[350px] md:w-[400px] rounded-xl shadow-lg bg-black/40 backdrop-blur-md p-8 border border-white/10">
        <h1 className="font-bold text-5xl text-white mb-2">LOGIN</h1>

        {error && <p className="text-red-500 text-sm bg-red-100/10 px-4 py-2 rounded-md w-full text-center">{error}</p>}

        <input
          className="w-full px-4 py-3 bg-amber-500 rounded-md text-black placeholder:text-gray-700 outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
          type="email"
          placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full px-4 py-3 bg-amber-500 rounded-md text-black placeholder:text-gray-700 outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
          type="password"
          placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className='w-full cursor-pointer bg-white text-black py-3 rounded-full font-bold hover:bg-amber-500 transition-colors uppercase tracking-widest'
        type='submit'
        >LOGIN</button>

        <div className="flex items-center gap-4 w-full">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-gray-500 text-xs uppercase font-bold tracking-widest">or</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
            theme="filled_blue"
            shape="pill"
            width="100%"
          />
        </div>

        <a className='underline text-blue-400 hover:text-blue-300 transition-colors text-sm mt-2' href="/SignUp">Dont have an account?</a>
      </div>

      </form>
    </AsteroidBackground>
  )
}
