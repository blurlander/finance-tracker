"use client"

import { createContext, useEffect, useRef, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({children}) => {
    const [alert, setAlert] = useState(null);
    const timeRef = useRef(null);

    useEffect(() => {
        if(timeRef.current){
            clearTimeout(timeRef.current);
        }
        timeRef.current = setTimeout(() => {
            setAlert(null);
        },4000)

    },[alert])

    return (
        <AlertContext.Provider value={[alert, setAlert]}>
            {children}
        </AlertContext.Provider>
    )
}

export default AlertContext;