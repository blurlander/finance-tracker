"use client"

import Balance from './components/Balance'
import Expenses from './components/Expenses'
import Stats from './components/Stats'
import Navbar from './components/Navbar'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Income from './components/Income'

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get('https://finance-tracker-api-c4uj.onrender.com/api/user', {
          withCredentials: true, // Equivalent to 'credentials: 'include''
        });
        const userData = response.data;
        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsLoading(false);
      }
    }

    fetchUser();
  },[])

  if(isLoading) {
    return (
      <span>Loading...</span>
    )
  }

  return (
    <main className="container my-24 px-6 sm:px-32 py-6 mx-auto">

      <Navbar user={user.username ?? "username"}/>
      <Balance userId={user._id} balance={user.balance} categoryList={user.categories}/>
      <Income userId={user._id} incomeList={user.income}/>
      <Expenses expenseList={user.expenses} userId={user._id} categoryList={user.categories}/>
      <Stats expenseList={user.expenses} categoryList={user.categories}/>
      
    </main>
  )
}
