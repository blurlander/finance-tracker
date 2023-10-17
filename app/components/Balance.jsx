import React from 'react'

const Balance = ({balance}) => {
  return (
    <section className='py-6 bg-slate-900 rounded-2xl flex justify-evenly gap-3 items-start'>

            <div className='flex flex-col'>
                <span className=' text-slate-200 text-sm sm:text-md font-bold px-6 sm:mx-6 py-2'>My Balance</span>
                <span className='text-2xl sm:text-4xl sm:mx-6 px-6 py-4 font-semibold'>{balance}</span>
            </div>

            <div className='flex flex-col self-center px-6 mr-2 md:mr-12'>
                <button className='btn btn-warning my-2'>+ Expenses</button>
                <button className='btn btn-primary my-2'>+ Income</button>

            </div>
    </section>
  )
}

export default Balance