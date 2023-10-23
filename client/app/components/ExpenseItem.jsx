"use client"

import React, { useState, useContext } from 'react'
import { currencyFormat } from '../lib/utils'
import Modal from './Modal'
import Alert from '../components/Alert';
import AlertContext from '../context/AlertContext';

const ExpenseItem = ({ color, amount, category, text, index, userId, categoryList }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [, setAlert] = useContext(AlertContext);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [formData, setFormData] = useState({
    amount: amount,
    category: category,
    color: color,
    desc: text,
  });

  const handleNewCategoryClick = () => {
    setIsNewCategory(!isNewCategory);
    setSelectedCategory(''); // Clear the selected category when creating a new one
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryName = e.target.value;
    setSelectedCategory(selectedCategoryName);
  };

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


  const handleDeleteExpense = async (e) => {
    let text = "Are you sure you want to delete this expense?";
    if (confirm(text) == true) {
      e.preventDefault();

      const response = await fetch('https://finance-tracker-sepia.vercel.app/api/deleteExpense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: userId,
          expenseIndex: index
        })
      });


      if (response.ok) {
        window.location.reload();

      } else {
        showAlert("danger", "error in handleDeleteExpense");

      }
      text = "entry Deleted";
    } else {
      text = "Canceled";
    }

  }

  const resetFormData = () => {
    setFormData({
      amount: amount,
      category: category,
      color: color,
      desc: text,
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const amount = formData.get('amount');
    const catVal = formData.get('category');
    const color = formData.get('color');
    const desc = formData.get('desc');

    // Check if the new category already exists in uniqueCategoryList
    const categoryExists = categoryList.some(category => category.name === catVal);

    // If the category already exists, show an error or prevent further action
    if (categoryExists && isNewCategory) {
      console.log("Category already exists!");
      showAlert("warning", "Category already exists!");
      return;
    }


    let category = selectedCategory;

    if (isNewCategory) {
      category = catVal;
    }

    const response = await fetch('https://finance-tracker-sepia.vercel.app/api/editExpense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        userId: userId,
        updatedExpense: {
          amount,
          desc,
          category,
          color
        },
        expenseIndex: index
      })
    });


    if (response.ok) {
      window.location.reload();

    } else {
      showAlert("danger", "error in handleEdit expense");

    }

  };

  return (
    <>
      <Modal title={""} flag={modalIsOpen} onClose={() => { setModalIsOpen(false); resetFormData(); }}>
        <form onSubmit={handleEdit}>
          <div className='flex flex-col flex-wrap gap-2'>
            <div className='flex flex-row justify-between items-center mb-4'>
              <span className='font-bold text-2xl'>Edit Expense</span>
              <button className='btn btn-danger self-end m-2 font-semibold text-lg' onClick={handleDeleteExpense} type='button'>Delete This Expense</button>
            </div>

            <span className='p-2'>Amount</span>
            <input required className='bg-slate-700 rounded-2xl py-1 px-4 mb-4' type='number' value={formData.amount}
              onChange={handleInputChange} name='amount'></input>

            <button
              className='btn btn-warning ml-4 mr-auto py-1 px-4 rounded'
              onClick={handleNewCategoryClick}
              type='button'
            >
              {isNewCategory ? 'Select Existing Category' : 'New Category'}
            </button>

            <div className='flex my-4'>

              <span className='p-2 mr-4'>Category: </span>
              {isNewCategory ? (
                // Input for creating a new category
                <input
                  required
                  className='bg-slate-700 rounded-2xl py-1 px-4'
                  type='text'
                  name='category'
                  placeholder='Enter new category...'
                />
              ) : (
                // Dropdown for selecting existing categories
                <select
                  className='bg-slate-700 rounded-2xl py-1 px-4 mr-2'
                  name='existingCategory'
                  value={selectedCategory}
                  required
                  onChange={handleCategoryChange}
                >
                  <option value='' disabled>Select Category...</option>
                  {categoryList.map((category, index) => (
                    <option key={index} value={category.name}>
                      {category.name}

                    </option>
                  ))}
                </select>
              )}


              <span className='p-2 mr-4 ml-auto'>Color:</span>
              <input required className='self-center mr-8' type='color' value={formData.color}
                onChange={handleInputChange} name='color' ></input>

            </div>

            <span className='p-2'>Description</span>
            <input required className='bg-slate-700 rounded-2xl py-1 px-4 mb-4' value={formData.desc} type='text'
              onChange={handleInputChange} name='desc' ></input>
            <button className='btn btn-primary self-end m-2 font-semibold text-lg' type='submit'>Save</button>

          </div>
        </form>
      </Modal>

      <Alert />

      <button className='bg-slate-700 hover:bg-slate-500 w-4/5 self-center transition transform duration-500 hover:scale-125" py-2 px-4 rounded-full '
        onClick={() => { setModalIsOpen(true) }}>
        <div className='flex flex-row'>
          <span className='w-[12px] sm:w-[30px] sm:h-[30px] rounded-full px-4' style={{ backgroundColor: color }} ></span>
          <span className='font-semibold text-md sm:text-lg text-opacity-80 ml-2'>{category}</span>
          <span className='ml-auto text-sm sm:text-base overflow-clip'>{text}</span>
          <span className='text-sm self-end ml-auto mr-4'>{currencyFormat(amount)}</span>
        </div>

      </button>
    </>
  )
}

export default ExpenseItem