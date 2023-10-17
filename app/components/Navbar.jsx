import React from 'react'
import {BiUserCircle} from 'react-icons/bi'
import {MdQueryStats} from 'react-icons/md'

const Navbar = () => {
  return (
    <nav className='fixed top-0 left-0 z-10 right-0'>  
        <div className='flex flex-wrap flex-row items-center justify-between px-4 sm:px-12 py-6 max-w-6xl ml-auto mr-auto'>
            <div className='flex flex-row items-center gap-6'>
            <BiUserCircle className='w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded'/>
            <span className='text-sm sm:text-base'>Username</span>
            </div>


            <div className='flex flex-row item-center gap-2'>
                <button><MdQueryStats className='w-5 h-5 mr-2 sm:w-6 sm:h-6 sm:mr-4'/></button>
                

                <button className='btn btn-danger'>Sign out</button>


            </div>

        </div>
    
    
    </nav>
  )
}

export default Navbar