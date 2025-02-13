// import React from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col md:flex-col box-border justify-around items-center w-1/2 p-4'>

      <div className='flex w-fit h-fit'>
        <button className='flex box-border font-serif font-bold text-white text-md hover:drop-shadow-2xl hover:text-slate-200  hover:box-border p-2' type='submit'>Explore</button>
      </div>
      <div className='border-l-2 border-r-2 border-r-white border-gray-400 h-10 shadow-2xl'></div>
      <div className='flex w-fit h-fit'>
        <button className='flex box-border font-serif font-bold text-white text-md hover:drop-shadow-2xl hover:text-slate-200  hover:box-border p-2' type='submit' onClick={() => navigate('/')}>Services</button>
      </div>
      <div className='border-l-2 border-r-2 border-r-white border-gray-400 h-10 shadow-2xl'></div>
      <div className='flex w-fit h-fit'>
        <button className='flex box-border font-serif font-bold text-white text-md hover:drop-shadow-2xl hover:text-slate-200  hover:box-border p-2' type='submit' onClick={() => navigate('/register')}>Sign Up</button>
      </div>
      <div className='border-l-2 border-r-2 border-r-white border-gray-400 h-10 shadow-2xl'></div>
      <div className='flex w-fit h-fit'>
        <button className='flex box-border font-serif font-bold text-white text-md hover:drop-shadow-2xl hover:text-slate-200  hover:box-border p-2' type='submit' onClick={() => navigate('/Login')}>Login</button>
      </div>
    </div>
  )
}

export default Header