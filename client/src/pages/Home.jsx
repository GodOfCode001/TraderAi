import React from 'react'
import Banner from '../HomeComponents/Banner'
import Feature from '../HomeComponents/Feature'
import Earn from '../HomeComponents/Earn'


const Home = () => {
//   const autoLogout = () => {
//     const token = Cookies.get('access_token');
//     console.log(token);
// }

// autoLogout();
  return (
    <>
      <Banner />
      <Feature />
      <Earn />
    </>
  )
}

export default Home
