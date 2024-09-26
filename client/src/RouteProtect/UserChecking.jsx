import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import IsLoading from '../components/IsLoading';

const UserChecking = ({ children }) => {
    const { backend, currentUser, setCurrentUser, forceLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [refCode, setRefCode] = useState(null);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const ref = queryParams.get('ref');
        if (ref) {
            setRefCode(ref);
        }
    }, [location.search]);

    useEffect(() => {
        const verifyToken = async () => {
            if (currentUser) {
                try {
                    const res = await axios.get(`${backend}/api/auth/verify-token`, {
                        withCredentials: true
                    });

                    if (res.data.message !== "OK") {
                        await handleLogout("Your session has expired, Please login.");
                    }
                } catch (error) {
                    console.log("error is:", error);
                    await handleLogout("Session Expired. Your session has expired. Please login.");
                }
            }
                setLoading(false);
        };
        verifyToken();
    }, [currentUser, backend]);

    const handleLogout = async (message) => {
        localStorage.clear();
        setCurrentUser(null);
        await Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: message,
            timer: 3000
        });
        forceLogout();
        setShouldRedirect(true);
    };

    useEffect(() => {
        const isRegisterPath = location.pathname === "/register/";
        const isComingFromReferralLink = isRegisterPath && refCode;

        if (!isRegisterPath && !isComingFromReferralLink && !currentUser && !loading) {
            setShouldRedirect(true);
        } else {
            setShouldRedirect(false);
        }
    }, [location.pathname, refCode, currentUser, loading]);

    useEffect(() => {
        if (shouldRedirect) {
            navigate('/', { replace: true });
        }
    }, [shouldRedirect, navigate]);

    if (loading) {
        return <IsLoading />;
    }

    return children;
};

export default UserChecking;