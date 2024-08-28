import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import Swal from 'sweetalert2'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const socket = io('http://localhost:8800');
    
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
      };

    const api = "https://api.oattydev.online"

    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null)
    // console.log(currentUser)
    const [heartbeatInterval, setHeartbeatInterval] = useState(null);
    

    const login = async (inputs) => {
        const res = await axios.post('/api/auth/login', inputs)
        const id = res.data.users_id
        setCurrentUser(res.data)
        socket.emit('user-online', id);
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

          socket.emit('user-offline', currentUser.users_id)
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

    // setInterval(() => {
    //   console.log("heartbeatinterval is", heartbeatInterval)
    // }, 30000);

    setInterval(() => {
      socket.on('update-userstatus', (status) => {
        console.log(status)
      })
      // console.log("online status is", onlineUser)
    }, 30000);


    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser))
        console.log("now currentUser state", currentUser)
    },[currentUser])


    useEffect(() => {
        if (currentUser !== null) {
                // Start sending heartbeat every 1 minute
            const intervalId = setInterval(() => {
              socket.emit('heartbeat', currentUser.users_id);
              console.log('Heartbeat sent');
            }, 30000); // 60000 milliseconds = 1 minute

          setHeartbeatInterval(intervalId)
          console.log("heartbeatinterval is", heartbeatInterval)
        }
        if (currentUser === null) {
          return () => clearInterval(heartbeatInterval);
        }
        return () => clearInterval(heartbeatInterval);

      }, [currentUser]);
    

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, changeLanguage, api }}>
            {children}
        </AuthContext.Provider>
    )
}