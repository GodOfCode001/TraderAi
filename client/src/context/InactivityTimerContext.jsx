import React, { createContext, useEffect, useState, useCallback, useContext } from 'react';
// import { logout } from '../utils/auth';
import { AuthContext } from './AuthContext';

// const INACTIVITY_LIMIT = 1800000; // 30 minute in milliseconds
const INACTIVITY_LIMIT = 1800000; // 30 minute in milliseconds

export const InactivityTimerContext = createContext();

export const InactivityTimerProvider = ({ children }) => {
    const [remainingTime, setRemainingTime] = useState(INACTIVITY_LIMIT);
    console.log(remainingTime)

    const { forceLogout, currentUser } = useContext(AuthContext)

    const resetTimer = useCallback(() => {
        setRemainingTime(INACTIVITY_LIMIT);
    }, []);

    useEffect(() => {
        const handleActivity = () => {
            resetTimer();
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
        };
    }, [resetTimer]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1000) {

                    if (currentUser) {
                        clearInterval(interval);
                        // logout();
                        forceLogout();
                        return 0;
                    } else {
                        clearInterval(interval);
                        return 0;
                    }
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [forceLogout]);

    return (
        <InactivityTimerContext.Provider value={{ remainingTime, resetTimer }}>
            {children}
        </InactivityTimerContext.Provider>
    );
};
