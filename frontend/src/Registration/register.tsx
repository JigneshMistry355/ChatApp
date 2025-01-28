import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function RegisterUser() {

    const navigate = useNavigate()
    
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('') 
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleLogin = async () => {
        await axios.post('http://localhost:3001/userdata', {
            username : username,
            email : email,
            password : password,
            confirmPassword : confirmPassword
        })
        .then((response) => {
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error.response.data.message)
            alert(error.response.data.message)
        })
        // navigate('/')
        // console.log(`Data sent ${response}`);
    }

    return (
    <div className='flex h-screen w-screen justify-center items-center bg-slate-400'>
      <div className='flex flex-col bg-gray-300 w-fit py-4 rounded-md items-center justify-center shadow-2xl'>
        <h1 className='text-center font-mono font-bold text-2xl'>Register</h1>
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
                    className='p-1 px-2 rounded-md min-w-80 shadow-xl ' 
                    type="email" 
                    placeholder='email' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
              <div className='flex m-2'>                                                             
                <input 
                    className='p-1 px-2 rounded-md min-w-80 shadow-xl' 
                    type="password"  
                    placeholder='confirm password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}    
                />
              </div>
          </div>
          <div className='flex justify-center items-center'>
              <button 
                  className='shadow-lg px-6 bg-red-700 hover:bg-gradient-to-b hover:from-red-500 hover:to-red-700 py-2 rounded-md text-white' 
                  type='button' 
                  onClick={handleLogin}>
                    Submit
              </button>
          </div>
      </div>
    </div>
    )
}