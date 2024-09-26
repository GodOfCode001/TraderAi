import React, { cloneElement, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import IsLoading from '../components/IsLoading'

const CryptoWallet = ({ children }) => {

    const { backend, currentUser, forceLogout, setCurrentUser} = useContext(AuthContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState()

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {                
                const res = await axios.get(`${backend}/api/checkuser-wallet`, {
                    withCredentials: true,
                })
                setData(res.data)
            } catch (error) {
                if (error.response.status == 403) {
                    setCurrentUser(null)
                    localStorage.clear()
                    navigate('/login')
                }
                console.error("Error fetching wallet data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [navigate, currentUser])

    if (loading) {
        return <IsLoading />
    }

    return cloneElement(children, { data })

}

export default CryptoWallet
