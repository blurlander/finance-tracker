import React from 'react'
import IncomeItem from './IncomeItem'

const Income = ({incomeList, userId}) => {
  return (
    <section className='p-6 my-12 bg-slate-900 rounded-2xl flex flex-col  gap-3 items-start'>
        <h1 className='py-4 mr-auto'>Income History</h1>
        {incomeList.map((income, index) => (
        <IncomeItem
          key={index}
          index={index} // Make sure to provide a unique key for each incomeItem
          text={income.desc}
          amount={income.amount}
          userId={userId}
        />
      ))}
    </section>
  )
}

export default Income