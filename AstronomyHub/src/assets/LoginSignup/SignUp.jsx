import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AsteroidBackground from '../../components/AsteroidBackground'
import { signup } from '../../services/api'

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await signup({ username, email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Server connection failed");
    }
  }

  return (
    <AsteroidBackground>
      <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-end pr-20">
      
      <div className="flex flex-col gap-8 items-center justify-center
                      w-[350px] md:w-[400px] rounded-xl shadow-lg">
        <h1 className="font-bold text-5xl text-white tracking-widest leading-none">SIGN UP</h1>

        {error && <p className="text-red-500 text-sm bg-red-100/10 px-4 py-2 rounded-md tracking-widest">{error}</p>}

        <input
          className="w-96 px-4 py-2 mask-r-from-4 bg-amber-500 rounded-md text-black placeholder:text-gray-700"
          type="text"
          placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          className="w-96 px-4 py-2 mask-r-from-5 bg-amber-500 rounded-md text-black placeholder:text-gray-700"
          type="email"
          placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-96 px-4 py-2 mask-r-from-6 bg-amber-500 rounded-md text-black placeholder:text-gray-700"
          type="password"
          placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className='cursor-pointer bg-white text-black px-10 py-2 rounded-full font-bold hover:bg-amber-500 transition-colors'>SIGN UP</button>

        <a className='underline text-blue-400 hover:text-blue-300 transition-colors' href="/login">Already have an account? Login</a>
      </div>

      </form>
    </AsteroidBackground>
  )
}
