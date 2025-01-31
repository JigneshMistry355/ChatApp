import React from 'react'
import Header from '../Header/header'

function Home() {
  return (
    <>
        <div className='fixed h-screen w-screen bg-[url(src/assets/images/chat-image-background.jpg)] bg-cover opacity-85 animate-slide-down'></div>
        <div className='flex flex-col h-screen '>
            <div className='flex h-1/6 bg-gray-400/30 items-center justify-center z-10 shadow-2xl'>
                <Header />
            </div>
            <div className='flex flex-grow'>

            </div>
        </div>
    </>
  )
}

export default Home