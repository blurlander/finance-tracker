"use client"

import React, { useState } from 'react'

const Modal = ({ children, flag, onClose}) => {

    return (
        <section className='absolute top-0 left-0 w-full h-full z-10 transition-all duration-500'
        style={{transform: flag ? "translateX(0%)" : "translateX(-200%)"}}>
            <div className='container mx-auto max-w-2xl h-[80vh] rounded-3xl bg-slate-900 p-6'>
                <button className='btn btn-danger mb-6' onClick={() => { onClose(false) }}>X</button>
                {children}

            </div>
 
        </section>
        


    )
}

export default Modal