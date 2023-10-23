import React, { useState } from 'react'
import ExpenseItem from './ExpenseItem'


const Expenses = ({expenseList, userId, categoryList}) => {


  return (
    <section className='p-6 my-12 bg-slate-900 rounded-2xl flex flex-col  gap-3 items-start'>
      <h1 className='py-4 mr-auto'>Expenses</h1>
      {expenseList.map((expense, index) => (
        <ExpenseItem
          key={index}
          index={index} // Make sure to provide a unique key for each ExpenseItem
          text={expense.desc}
          color={expense.color}
          category={expense.category}
          amount={expense.amount}
          userId={userId}
          categoryList={categoryList}
        />
      ))}
    </section>
  )
}

export default Expenses