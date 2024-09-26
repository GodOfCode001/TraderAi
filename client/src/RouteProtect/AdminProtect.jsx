import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';
import IsLoading from '../components/IsLoading';

const AdminProtect = ({ children }) => {
    const { backend, currentUser, forceLogout, setCurrentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [verify, setVerify] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const admin = currentUser?.users_role === 'admin' || currentUser?.users_role === 'ceo';

    useEffect(() => {
        
        const verifyToken = async () => {
            setLoading(true); // Start loading when making request

            if (currentUser) {
                try {
                    const res = await axios.get(`${backend}/api/auth/isadmin`, {
                        withCredentials: true
                    });
                    const data = res.data;
    
                    // Handle different responses from the backend
                    if (data === "Token is required") {
                        forceLogout();
                        Swal.fire({
                            icon: "error",
                            title: "Unauthorized",
                            text: "No token provided, please login again.",
                            footer: '<a href="#">Why do I have this issue?</a>'
                        });
                        navigate('/login');
                    } else if (data === "Token expired") {
                        forceLogout();
                        Swal.fire({
                            icon: "error",
                            title: "Session Expired",
                            text: "Your session has expired. Please log in again.",
                            footer: '<a href="#">Why do I have this issue?</a>'
                        });
                        navigate('/login');
                    } else if (data === "OK") {
                        // Token is valid, set verification state
                        setVerify(true);
                    }
                } catch (error) {
                    // console.log("error is", error)

                    if (error.response?.data === "permission is not allowed") {
                        navigate('/')
                        return
                    }

                    if (error.response?.data === "Token expired" || error.response?.status === 403) {
                        localStorage.clear();
                        setCurrentUser(null)
                        Swal.fire({
                            icon: "error",
                            title: "Session Expired",
                            text: "Your session has expired. Please log in again.",
                            footer: '<a href="#">Why do I have this issue?</a>'
                        });
                        // forceLogout();
                        navigate('/login');
                    } else {
                        navigate('/');
                    }
                } finally {
                    setLoading(false); // Stop loading when request is done
                }
            }




        };

        verifyToken();
    }, [currentUser, backend, forceLogout, navigate]);

    // console.log(verify)

    // If not an admin or verification failed
    if (!admin && verify === false) {
        return <Navigate to="/" replace />;
    }

    // Show loading animation while waiting for the request to complete
    if (loading) {
        return (
            <IsLoading />
        );
    }

    // Once verification is successful, show children components
    return verify ? children : <IsLoading />;
};

export default AdminProtect;
