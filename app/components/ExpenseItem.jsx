"use client"

import React, { useState } from 'react'
import Modal from './Modal'

const ExpenseItem = ({ color, amount, category, text, id }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  return (
    <>
      <Modal title={"Hello"} flag={modalIsOpen} onClose={setModalIsOpen}>
        <h1>Hello</h1>
      </Modal>

      <button className='flex flex-wrap bg-slate-700 hover:bg-slate-500 transition transform duration-500 hover:scale-125" py-2 px-4 rounded-full w-full'
        onClick={() => { setModalIsOpen(true) , setModalInfo() }}>
        <span className='w-[12px] sm:w-[30px] sm:h-[30px] rounded-full px-4' style={{ backgroundColor: color }} ></span>
        <span className='font-semibold text-md sm:text-lg text-opacity-80 ml-2'>{category}</span>
        <span className='ml-auto text-sm sm:text-base overflow-clip'>{text}</span>
        <span className='text-sm self-end ml-auto mr-4'>{amount}</span>
      </button>
    </>
  )
}

export default ExpenseItem