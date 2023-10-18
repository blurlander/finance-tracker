"use client"

import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


const Stats = ({data}) => {
  return (
    <section className='p-6 my-12 bg-slate-900 rounded-2xl flex flex-col  gap-3 items-start'>
      <h1 className='py-4'>Stats</h1>
    
    </section>
  )
}

export default Stats