import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../Header/header'

export default function RegisterUser() {

    // const navigate = useNavigate()
    
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [preferred_language, set_preferred_language] = useState('')
    const [password, setPassword] = useState('') 
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleLogin = async () => {
        await axios.post('http://localhost:3001/userdata', {
            username : username,
            email : email,
            preferred_language: preferred_language,
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
      <>

    <div className='fixed h-screen w-screen justify-center items-center bg-[url(/public/assets/images/register-now.jpg)] bg-cover opacity-80 blur-sm z-0'></div>

    <div className='flex flex-col h-screen'>
      <div className='flex h-1/6 bg-black/70 items-center justify-center z-10 shadow-2xl'>
        <Header />
      </div>
      <div className='flex flex-row flex-grow h-5/6'>
        <div className='flex w-1/2'>
          
        </div>
        <div className='flex flex-grow justify-center items-center w-1/2 min-h-fit bg-black animate-slide-down'>
          <div className=' flex flex-col w-fit min-h-fit py-4 rounded-xl items-center justify-between shadow-3xl border-2 bg-gradient-to-br from-white to-slate-400 opacity-85 z-10 animate-bounce-twice'>
            <h1 className='text-center font-mono font-bold text-4xl bg-gradient-to-r from-orange-700 to-green-500 text-transparent bg-clip-text z-20'>Register</h1>
              <div className='flex flex-col m-4 px-4 justify-around  h-3/4'>
              <div className='flex m-2'>
                  <input 
                      className='p-1 px-2 rounded-md min-w-80 shadow-xl z-20' 
                      type="text" 
                      placeholder='Full name' 
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
                <div className='flex m-2'>
                  <input 
                      className='p-1 px-2 rounded-md min-w-80 shadow-xl z-20' 
                      type="text" 
                      placeholder='username (unique)' 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className='flex m-2'>
                  <input 
                      className='p-1 px-2 rounded-md min-w-80 shadow-xl z-20' 
                      type="email" 
                      placeholder='email' 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='flex m-2'>
                  <input 
                      className='p-1 px-2 rounded-md min-w-80 shadow-xl z-20' 
                      type="email" 
                      placeholder='Preferred Language' 
                      value={preferred_language}
                      onChange={(e) => set_preferred_language(e.target.value)}
                  />
                </div>
                <div className='flex m-2'>                                                             
                  <input 
                      className='p-1 px-2 rounded-md min-w-80 shadow-xl z-20' 
                      type="password"  
                      placeholder='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}    
                  />
                </div>
                <div className='flex m-2'>                                                             
                  <input 
                      className='p-1 px-2 rounded-md min-w-80 shadow-xl z-20' 
                      type="password"  
                      placeholder='confirm password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}    
                  />
                </div>
                <div className='flex m-2 '>
                  <button 
                      className='shadow-lg w-full bg-red-700 hover:bg-gradient-to-b hover:from-red-500 hover:to-red-700 py-2 rounded-md text-white z-10' 
                      type='button' 
                      onClick={handleLogin}>
                        Submit
                  </button>
            </div>
            </div>
            
        </div>
      </div>
      </div>

    </div>
    
      
      
      </>
    )
}