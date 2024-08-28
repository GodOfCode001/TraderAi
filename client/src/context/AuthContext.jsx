import axios from "axios";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    // const socket = io('http://localhost:8800');
    
    const backend = "http://localhost:8800"
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
      };

    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null)
    const [heartbeatInterval, setHeartbeatInterval] = useState(null);
    const INACTIVITY_LIMIT = 60000; // 60000 === 1 minute
    const [remainingTime, setRemainingTime] = useState(INACTIVITY_LIMIT)
    const [socket, setSocket] = useState(null)

    

    const login = async (inputs) => {
        const res = await axios.post('/api/auth/login', inputs)
        const id = res.data.users_id
        setCurrentUser(res.data)
        // socket.emit('user-online', id);

        const newSocket = io(`${backend}`);
        setSocket(newSocket);
        newSocket.emit('user-online', id)
    }

    const logout = async () => {
      clearInterval(heartbeatInterval);

      Swal.fire({
        title: "Are you sure?",
        text: "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Logout it!"
      }).then(async (result) => {
        if (result.isConfirmed) {

          if (socket) {
            socket.emit('user-offline', currentUser.users_id);
            socket.close();
            setSocket(null)
          }

          // socket.emit('user-offline', currentUser.users_id)
          const res = await axios.post('/api/auth/logout', {userId: currentUser.users_id})
            setCurrentUser(null)
            // clearToken()
            localStorage.clear();


          Swal.fire({
            title: "Logout!",
            text: "You has been logout.",
            icon: "success",
            timer: 1500
          });
        }
      });
    }

    const forceLogout = async () => {

      if (currentUser) {
        if (socket) {
          socket.emit('user-offline', currentUser.users_id);
          socket.close()
          setSocket(null)
        }
        // socket.emit('user-offline', currentUser.users_id)
        const res = await axios.post('/api/auth/logout', {userId: currentUser.users_id})
        setCurrentUser(null)
        localStorage.clear();
      }
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser))
    },[currentUser])

    useEffect(() => {

      console.log(currentUser)
      console.log(socket)

      // let intervalId;
      if (currentUser && !socket) {
        const newSocket = io(`${backend}`);
        setSocket(newSocket);
        newSocket.emit('user-online', currentUser.users_id);
      }

      if (currentUser) {
          const intervalId = setInterval(() => {
          socket.emit('heartbeat', currentUser.users_id);
          console.log("heartbeat sent")
        }, 10000)
        setHeartbeatInterval(intervalId);
      }

      return () => {
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          console.log("heartbeat interval cleared")
        }
        if (socket) {
          socket.close();
          console.log('Socket connection closed');
        }
      }
    }, [currentUser])

      // Inactive track


      const resetTimer = useCallback(() => {
        setRemainingTime(INACTIVITY_LIMIT)
      }, [])

      useEffect(() => {
        const handleActivity = () => {
          resetTimer()
        }

        window.addEventListener('mousemove', handleActivity)
        window.addEventListener('keydown', handleActivity)

        return () => {
          window.removeEventListener('mousemove', handleActivity);
          window.removeEventListener('keydown', handleActivity);
        }
      }, [resetTimer])

      useEffect(() => {
        const interval = setInterval(() => {
          setRemainingTime((prevTime) => {
            if (prevTime <= 1000) {

              if (currentUser !== null) {
                clearInterval(interval);
                clearInterval(heartbeatInterval);
                forceLogout();
                return 0;
              } else {
                clearInterval(interval);
              }
              return 0;
            }
            return prevTime - 1000;
          })
        }, 1000)

        return () => clearInterval(interval);
      }, [currentUser, heartbeatInterval, forceLogout]);

      // console.log(remainingTime)
    
    return (
        <AuthContext.Provider value={{ currentUser, login, logout, changeLanguage, resetTimer }}>
            {children}
        </AuthContext.Provider>
    )
}