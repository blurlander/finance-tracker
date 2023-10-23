"use client"

import React, { useState, useContext } from 'react'
import { currencyFormat } from '../lib/utils'
import Modal from './Modal'
import Alert from '../components/Alert';
import AlertContext from '../context/AlertContext';

const IncomeItem = ({ amount, text, index, userId }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [, setAlert] = useContext(AlertContext);
    const [formData, setFormData] = useState({
      amount: amount,
      desc: text,
    });

    const showAlert = (type, text) => {
        setAlert({
          type,
          text
        })
      }
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

      const resetFormData = () => {
        setFormData({
          amount: amount,
          desc: text,
        });
      };

      const handleEdit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData(e.target);
        const amount = formData.get('amount');
        const desc = formData.get('desc');
    
        const response = await fetch('https://finance-tracker-sepia.vercel.app/api/editIncome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            userId: userId,
            updatedIncome: {
              amount,
              desc,
            },
            incomeIndex: index
          })
        });
    
    
        if (response.ok) {
          window.location.reload();
    
        } else {
          showAlert("danger", "error in handleEdit income");
    
        }
    
      };

      const handleDeleteIncome = async (e) => {
        let text = "Are you sure you want to delete this income?";
        if (confirm(text) == true) {
          e.preventDefault();
      
          const response = await fetch('https://finance-tracker-sepia.vercel.app/api/deleteIncome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              userId: userId,
              incomeIndex: index
            })
          });
      
      
          if (response.ok) {
            window.location.reload();
      
          } else {
            showAlert("danger", "error in handleDeleteIncome");
      
          }
          text = "Entry Deleted";
        } else {
          text = "Canceled";
        }
  
    }
    
  return (
    <>
    <Modal title={""} flag={modalIsOpen} onClose={() => { setModalIsOpen(false); resetFormData(); }}>
      <form onSubmit={handleEdit}>
        <div className='flex flex-col flex-wrap gap-2'>
          <div className='flex flex-row justify-between items-center mb-4'>
            <span className='font-bold text-2xl'>Edit Income</span>
            <button className='btn btn-danger self-end m-2 font-semibold text-lg' onClick={handleDeleteIncome} type='button'>Delete This Income</button>
          </div>

          <span className='p-2'>Amount</span>
          <input required className='bg-slate-700 rounded-2xl py-1 px-4 mb-4' type='number' value={formData.amount}
            onChange={handleInputChange} name='amount'></input>

          <span className='p-2'>Description</span>
          <input required className='bg-slate-700 rounded-2xl py-1 px-4 mb-4' value={formData.desc} type='text'
            onChange={handleInputChange} name='desc' ></input>
          <button className='btn btn-primary self-end m-2 font-semibold text-lg' type='submit'>Save</button>

        </div>
      </form>
    </Modal>

    <Alert />

    <button className='bg-slate-700 hover:bg-slate-500 self-center w-4/5 transition transform duration-500 hover:scale-125" py-2 px-4 rounded-full '
      onClick={() => { setModalIsOpen(true) }}>
      <div className='flex flex-row'>
        <span className='ml-8 text-sm sm:text-base overflow-clip'>{text}</span>
        <span className='text-sm self-end ml-auto mr-4'>{currencyFormat(amount)}</span>
      </div>
    </button>
  </>
  )
}

export default IncomeItem