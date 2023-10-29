"use client"

import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const aggregateExpensesByCategory = (expenseList) => {
  const aggregatedExpenses = {};

  expenseList.forEach(expense => {
    const category = expense.category;
    if (aggregatedExpenses[category]) {
      aggregatedExpenses[category].amount += parseFloat(expense.amount);
    } else {
      aggregatedExpenses[category] = {
        amount: parseFloat(expense.amount),
        color: expense.color,
      };
    }
  });

  return aggregatedExpenses;
};


const Stats = ({ expenseList }) => {
  const aggregatedExpenses = aggregateExpensesByCategory(expenseList);
  const labels = Object.keys(aggregatedExpenses);
  const data = labels.map(category => aggregatedExpenses[category].amount);
  const backgroundColors = labels.map(category => aggregatedExpenses[category].color);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Expenses',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: [],
      },
    ],
  };

  return (
    <section className='p-6 my-12 bg-slate-900 rounded-2xl flex flex-col items-center' id='stats'>
      <h1 className='py-4 mb-4'>Stats</h1>
      <div className='w-2/3 sm:w-1/3 p-2'>
        <Doughnut data={chartData} />
      </div>

    </section>
  );
};

export default Stats;