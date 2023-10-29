"use client"

import React, { useContext, useState } from 'react'
import { currencyFormat } from '../lib/utils'
import Modal from './Modal'
import Alert from '../components/Alert';
import AlertContext from '../context/AlertContext';

const Balance = ({ userId, balance, categoryList }) => {
  const [modalIsOpen1, setModalIsOpen1] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [, setAlert] = useContext(AlertContext);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('#111111');


  const handleNewCategoryClick = () => {
    setIsNewCategory(!isNewCategory);
    setSelectedCategory(''); // Clear the selected category when creating a new one
  };

  const showAlert = (type, text) => {
    setAlert({
      type,
      text
    })
  }

  const handleCategoryChange = (e) => {
    const selectedCategoryName = e.target.value;
    setSelectedCategory(selectedCategoryName);

    // Find the selected category object from uniqueCategoryList
    const selectedCategoryObject = categoryList.find(category => category.name === selectedCategoryName);

    if (selectedCategoryObject) {
      // If the selected category exists, update the color input value
      setSelectedColor(selectedCategoryObject.color);
    } else {
      setSelectedColor('#000000'); // Set default color if no category is selected
    }
  };


  const handleIncome = async (e) => {

    e.preventDefault();

    const formData = new FormData(e.target);
    const amount = formData.get('amount');
    const desc = formData.get('desc');

    const response = await fetch('https://finance-tracker-api-c4uj.onrender.com/api/addIncome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        userId: userId,
        income: {
          amount,
          desc
        }
      })
    });


    if (response.ok) {
      window.location.reload();

    } else {
      showAlert("danger", "error in handleIncome");

    }
  }



  const handleExpense = async (e) => {

    e.preventDefault();

    const formData = new FormData(e.target);
    const amount = formData.get('amount');
    const catVal = formData.get('category');
    const colVal = formData.get('color');
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
    let color = selectedColor;

    if (isNewCategory) {
      category = catVal;
      color = colVal;
    }



    const response = await fetch('https://finance-tracker-api-c4uj.onrender.com/api/addExpense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        userId: userId,
        expense: {
          amount,
          desc,
          category,
          color
        }
      })
    });


    if (response.ok) {
      window.location.reload();

    } else {
      showAlert("danger", "error in handleExpense");

    }

  }


  return (
    <section className='py-6 bg-slate-900 rounded-2xl flex justify-evenly gap-3 items-start'>
      <Alert />
      <Modal title={"Add Income"} flag={modalIsOpen1} onClose={setModalIsOpen1}>
        <form onSubmit={handleIncome}>
          <div className='flex flex-col flex-wrap gap-2'>
            <span className='font-bold text-2xl mb-4'>Add Income</span>
            <span className='p-2'>Amount</span>
            <input required className='bg-slate-700 rounded-2xl py-1 px-4 mb-4' type='number' name='amount' id='amount'></input>
            <span className='p-2'>Description</span>
            <input className='bg-slate-700 rounded-2xl py-1 px-4 mb-4' type='text' name='desc' id='desc'></input>
            <button className='btn btn-primary self-end m-2 font-semibold text-lg' type='submit'>Save</button>
          </div>
        </form>
      </Modal>

      <Modal title={"Add Expense"} flag={modalIsOpen2} onClose={setModalIsOpen2}>
        <form onSubmit={handleExpense}>
          <div className='flex flex-col flex-wrap gap-2'>
            <span className='font-bold text-2xl mb-4'>Add Expense</span>
            <span className='p-2'>Amount</span>
            <input required className='bg-slate-700 rounded-2xl py-1 px-4 mb-4' type='number' name='amount'></input>
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
              <input required className='self-center mr-8' type='color' name='color'
               value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}></input>

            </div>


            <span className='p-2'>Description</span>
            <input required className='bg-slate-700 rounded-2xl py-1 px-4 mb-4' type='text' name='desc' ></input>
            <button className='btn btn-primary self-end m-2 font-semibold text-lg' type='submit'>Save</button>
          </div>
        </form>
      </Modal>

      <div className='flex flex-col'>
        <span className=' text-slate-200 text-sm sm:text-md font-bold px-6 sm:mx-6 py-2'>My Balance</span>
        <span className='text-2xl sm:text-4xl sm:mx-6 px-6 py-4 font-semibold'>{currencyFormat(balance)}</span>
      </div>

      <div className='flex flex-col self-center px-6 mr-2 md:mr-12'>
        <button className='btn btn-warning my-2'
          onClick={() => { setModalIsOpen2(true) }}>+ Add Expense</button>
        <button className='btn btn-primary my-2'
          onClick={() => { setModalIsOpen1(true) }}>+ Add Income</button>

      </div>
    </section>
  )
}

export default Balance