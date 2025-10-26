import React, { useState } from 'react';
import './loginSignup.css';

export const LoginSignup = () => {

  const [action, setAction] = useState("Sign Up");
  return (
    
    <div className='container'>
      <div className='header'>
        <div className='text'>{action}</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
        {action === "Login" ? <div></div> :<div className='input'>
          <input type='text' placeholder='Username' />
        </div>}
        
        <div className='input'>
          <input type='email' placeholder='Email' />
        </div>
        <div className='input'>
          <input type='password' placeholder='Enter Password' />
        </div>
      </div>
      {action === "Sign Up" ? <div></div> :
      <div className="forgot-pass">Forgot password? <a href='#'>Click here</a></div> 
      }
      <div className="submit-container">
        <div className={action ==="login"?"submit gray":"submit"} onClick={ () => {
          setAction("Sign Up")
        }}
        >Sign Up
        </div>
        <div className={action ==="Sign Up"?"submit gray":"submit"} onClick={ ()=> {
          setAction("Login")
        }}
        >Login</div>
      </div>
    </div>
  )
}
