import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-800 text-white'>
      <div className="md:w-[80vw] md:px-40 md:mx-auto flex h-12 justify-between items-center px-4 py-5">
        <div className='logo font-bold text-2xl'>
          <span className='text-green-500'>&lt;</span>
          <span>Pass</span>
          <span className='text-green-500'>OP/&gt;</span>
        </div>
        {/* <ul>
          <li className='flex gap-4 '>
            <a className='hover:font-bold' href="/">Home</a>
            <a className='hover:font-bold' href="#">About</a>
            <a className='hover:font-bold' href="#">Contact</a>
          </li>
        </ul> */}

        <button className='text-white bg-green-700 my-5 flex justify-between items-center rounded-full pr-2 ring-white ring-1'>
                    <img className='w-8 p-1 invert' src="icons/github.svg" alt="github logo" />
                    <span className='font-medium px-0.5'>Github</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
