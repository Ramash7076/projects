"use client"
import React, { useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'

const Navbar = () => { 
  const { data: session } = useSession()
  const [showdropdown, setShowdropdown] = useState(false)

  return (
    <nav className='bg-gray-950 text-white flex flex-col md:flex-row justify-between items-center px-4 md:h-16'>
      <Link href={"/"} className="logo font-bold text-lg flex justify-center items-center">
        <img className='invertimg' src="/tea.gif" width={44} alt="" />
        <span className='text-xl md:text-base my-3 md:my-0'>GetmeaChai!</span>
      </Link>
      {/* <ul className='flex justify-between gap-4'>
        <li>Home</li>
        <li>About</li>
        <li>Projects</li>
        <li>Sign Up</li>
        <li>Login</li>
      </ul> */}
      <div className='relative flex flex-col gap-2 md:block'>
        {session && <><button onClick={() => { setShowdropdown(!showdropdown) }} onBlur={() => {
          setTimeout(() => {
            setShowdropdown(false)
          }, 100);
        }} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium focus:outline-none rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mx-4  bg-blue-700 hover:bg-blue-800 inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 " type="button">Welcome {session.user.email} <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>


          <div id="dropdown" className={`z-10 ${showdropdown ? "" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 absolute left-14`}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link>
              </li>
              <li>
                <Link href={`/${session.user.name}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Your page</Link>
              </li>

              <li>
                <Link onClick={()=>{console.log("signing out....");
                 signOut()}} href="/login" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</Link>
              </li>
            </ul>
          </div></>
        }

        {session && <button className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium focus:outline-none rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 md:w-fit w-full' onClick={() => { signOut() }}>Logout</button>}
        {!session && <Link href={"/login"}>
          <button className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'>Login</button></Link>}
      </div>
    </nav>
  )
}

export default Navbar
