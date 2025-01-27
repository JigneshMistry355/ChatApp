import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate()
  

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 

  const handleLogin = () => {
    navigate(`/screen?data=${username}`)
  }
    
  return (
    <div className='flex h-screen w-screen justify-center items-center bg-slate-400'>
      <div className='flex flex-col bg-gray-300 h-72 w-fit rounded-md items-center justify-center shadow-2xl'>
        <h1 className='text-center font-mono font-bold text-2xl'>Login</h1>
          <div className='flex flex-col m-4 px-4'>
              <div className='flex m-2'>
                <input 
                    className='p-1 px-2 rounded-md min-w-80 shadow-xl ' 
                    type="text" 
                    placeholder='username' 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className='flex m-2'>                                                             
                <input 
                    className='p-1 px-2 rounded-md min-w-80 shadow-xl' 
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