import React, { useContext, useEffect, useState } from 'react'
import Banner from '../HomeComponents/Banner'
import Feature from '../HomeComponents/Feature'
import Earn from '../HomeComponents/Earn'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import IsLoading from '../components/IsLoading'
import { useOutletContext } from 'react-router-dom'


const Home = () => {

  const { feature } = useOutletContext() 

  // const [isLoading, setIsLoading] = useState(true)
  // const [feature, setFeature] = useState(null)
  // const { backend } = useContext(AuthContext)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true)
  //    try {
  //     const res = await axios.get(`${backend}/api/coins/get`)
  //     setFeature(res.data)
  //    } catch (error) {
  //     console.error('Error fetching data:', error)
  //    } finally {
  //     setIsLoading(true)
  //    }
  //   }
  //   fetchData()
  // }, [])

  return (
    <>
        <Banner />
        <Feature data={feature}/>
        <Earn />
      {/* {isLoading ? <IsLoading /> : (
        <>
        <Banner />
        <Feature data={feature}/>
        <Earn />
        </>
      )} */}
    </>
  )
}

export default Home