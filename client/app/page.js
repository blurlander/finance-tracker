"use client"

import Balance from './components/Balance'
import Expenses from './components/Expenses'
import Stats from './components/Stats'
import Navbar from './components/Navbar'
import React, { useEffect, useState } from 'react'
import Income from './components/Income'

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function fetchUser() {
        try {
            const response = await fetch('https://finance-tracker-api-c4uj.onrender.com/api/user', {
                method: 'GET',
                credentials: 'include', // Include credentials for cross-origin requests
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                throw new Error('Request failed with status: ' + response.status);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setIsLoading(false);
        }
    }

    fetchUser();
}, []);

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
