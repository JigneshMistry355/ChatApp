// import React from 'react'
import Header from '../Header/header'

function Home() {
  return (
    <>
        <div className='fixed h-screen w-screen bg-[url(src/assets/images/Homebg.avif)] bg-cover animate-slide-down z-0'></div>
        <div className='flex flex-col h-screen '>
            <div className='flex h-1/6 bg-gray-400/20 items-center justify-center z-10 shadow-2xl'>
                <Header />
            </div>
            <div className='flex flex-grow z-10'>
                  <div className='flex justify-center items-center w-screen bg-white h-full opacity-70 bg-[url(src/assets/images/images.jpg)]'>
                      <div className='flex h-1/2 w-1/2 bg-[#470592] shadow-2xl rounded-2xl justify-center items-center'>
                        <h1 className='text-white text-center text-6xl font-serif shadow-white shadow-xl'> MultiLINGUO </h1>
                      </div>
                  </div>
            </div>
        </div>
    </>
  )
}

export default Home