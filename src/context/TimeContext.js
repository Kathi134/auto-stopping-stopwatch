import React, { createContext, useContext, useState } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
    const [time, setTime] = useState(0);

    return (
        <TimeContext.Provider value={{ time, setTime }}>
            {children}
        </TimeContext.Provider>
    );
};

export const useTime = () => useContext(TimeContext);