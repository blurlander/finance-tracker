import React, { useContext } from 'react';
import AlertContext from '../context/AlertContext';

const Alert = () => {
    const severity = {
        danger: "bg-red-400",
        warning: "bg-yellow-400",
        success: "bg-green-400"
    };

    const [alert] = useContext(AlertContext);

    if (!alert) {
        return null;
    }

    const backgroundColorClass = severity[alert.type] || "bg-gray-400"; // Default to gray-400 if the type is not found in severity

    return (
        <div className={`absolute flex items-center justify-center flex-wrap bottom-0 right-0
         sm:w-[340px] sm:h-[100px] w-[240px] h-[85px] ml-auto mr-8 rounded-2xl p-4 ${backgroundColorClass}`}>
            {alert.text}
        </div>
    );
};

export default Alert;
