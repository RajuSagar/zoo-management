import React from 'react'
import { Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <div className="h-screen pt-16 bg-gradient-to-r from-neutral-300 to-stone-400">
      <div className='flex justify-between items-center h-full'>
        <div className='w-[50%] h-full flex flex-col justify-end'>
          <img src="images/animals.png" alt="" className='ml-7' />
        </div>
        <div className='w-[50%] text-center p-10'>
          <h1 className='text-7xl mb-5 text-[#3E3232] font-serif'>Welcome to Zoo Ticket Management</h1>
          <p className='text-lg text-white mb-3'>Book zoo tickets here.</p>
          <Link
            className="rounded-md px-5 py-2 ml-2 text-lg bg-[#503C3C] font-semibold text-white shadow-sm  hover:bg-[#7E6363]"
            to={'/AdminLogin'}
          >
            Admin Login
          </Link>
          <Link
            className="rounded-md px-5 py-2 ml-2 text-lg bg-[#503C3C] font-semibold text-white shadow-sm  hover:bg-[#7E6363]"
            to={'/CustomerLogin'}
          >
            Customer Login
          </Link>
        </div>
      </div>
    </div>
  )
}
