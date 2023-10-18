import Image from 'next/image'
import Balance from './components/Balance'
import Expenses from './components/Expenses'
import Stats from './components/Stats'
import Navbar from './components/Navbar'
import { curencyFormat } from './lib/utils'

export default function Home() {
  return (
    <main className="container my-24 px-6 sm:px-32 py-6 mx-auto">

      <Navbar/>
      <Balance balance={curencyFormat(100000)}/>
      <Expenses/>
      <Stats/>
      
    </main>
  )
}
