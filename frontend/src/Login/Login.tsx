import React, { lazy, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate()
  

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 

  const handleLogin = () => {
    if (username && password){
      navigate(`/screen?username=${username}&password=${password}`);
    }
    else {
      alert("Fill the details")
    }
  }
    
  return (
    <div className='flex h-screen w-screen justify-center items-center bg-[url(src/assets/images/Homebg.avif)] bg-cover animate-slide-down blur-none z-0'>
      <div className='flex flex-col p-7 bg-white h-72 w-fit rounded-md items-center justify-center shadow-2xl shadow-gray-800 animate-bounce-twice z-10 opacity-90'>
        <h1 className='text-center font-mono font-bold text-2xl'>Login</h1>
          <div className='flex flex-col m-4 px-4 z-30'>
              <div className='flex m-4 z-40'>
                <input 
                    className='p-1 px-2 rounded-md min-w-80 shadow-xl border-slate-500 border-b-2 border-l-2 z-50' 
                    type="text" 
                    placeholder='username' 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className='flex m-4'>                                                             
                <input 
                    className='p-1 px-2 rounded-md min-w-80 shadow-xl border-slate-500 border-b-2 border-l-2' 
                    type="password"  
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}    
                />
              </div>
          </div>
          <div className='flex justify-center items-center'>
              <button 
                  className='shadow-lg px-6 bg-blue-700 hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-700 py-2 rounded-md text-white' 
                  type='button' 
                  onClick={handleLogin}>
                    Login
              </button>
          </div>
      </div>
    </div>
  )
}

export default Login;