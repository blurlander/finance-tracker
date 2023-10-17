import React from 'react'
import ExpenseItem from './ExpenseItem'
import { curencyFormat } from '../lib/utils'

const Expenses = () => {
  return (
    <section className='p-6 my-12 bg-slate-900 rounded-2xl flex flex-col  gap-3 items-start'>
        <h1 className='py-4'>My Expenses</h1>
        <ExpenseItem text={"merhaba"} color={"green"} category={"Food"} amount={curencyFormat(100)}/>
    </section>
  )
}

export default Expenses