'use client'

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation'
import Alert from '../components/Alert';
import AlertContext from '../context/AlertContext';

export default function page() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [, setAlert] = useContext(AlertContext);

    const showAlert = (type,text) => {
        setAlert({
            type,
            text
        })
    }


    const handleRegister = async (e) => {

        e.preventDefault();

        const response = await fetch('http://localhost:8000/api/register', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        if(response.ok){

            await router.push('/login');

        }else {
            showAlert("warning", "This email has already been used.")
        }

        

    }

    return (
        <main>
            <div className='container max-w-2xl h-[90vh] mx-auto mt-12 rounded-3xl bg-slate-900 p-6'>
                <form onSubmit={handleRegister}>
                    <div className='flex flex-col flex-wrap'>
                        <span className='text-3xl font-bold self-center my-4 p-2'>Register</span>

                        <input className='bg-slate-700 rounded-xl mt-12 p-2' required placeholder='Username' name='username' onChange={(e) => setUsername(e.target.value)}></input>
                        <input className='bg-slate-700 rounded-xl mt-12 p-2' required type='email' placeholder='Email' name='email' onChange={(e) => setEmail(e.target.value)}></input>
                        <input className='bg-slate-700 rounded-xl mt-12 p-2' required placeholder='Password' name='Password' onChange={(e) => setPassword(e.target.value)}></input>

                        <button className='btn btn-primary w-[90px] mt-12 mx-4 self-center font-bold' type='submit'>Register</button>
                        <span className='font-bold text-sm mt-12 self-center'>Already have an account?</span>
                        <button className='btn btn-warning w-[90px] mt-4 mx-4 self-center font-bold' type='button' onClick={() => {router.push("/login")}}>Login</button>

                    </div>

                </form>

            </div>
            <Alert/>

        </main>
    )
}
