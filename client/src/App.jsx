import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Rank from './pages/Rank'
import About from './pages/About'
import Userinfo from './pages/Userinfo'
import TopupSelect from './pages/TopupSelect'
import Deposit from './topup/Deposit'
import Withdraw from './topup/Withdraw'
import WithdrawSelect from './pages/WithdrawSelect'
import BankDeposit from './topup/BankDeposit'
import BankWithdraw from './topup/BankWithdraw'
import UserRebate from './UserinfoComponents/UserRebate'

function App() {

  const Layout = () => {
    return (
      <>
      <Navbar />
      <Outlet />
      <Footer />
      </>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/register",
          element: <Register />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/rebate",
          element: <Rank />
        },
        {
          path: "/about",
          element: <About />
        },
        {
          path: "/userinfo",
          element: <Userinfo />
        },
        {
          path: "/rebate",
          element: <UserRebate />
        },
        {
          path: "/topup",
          element: <TopupSelect />
        },
        {
          path: "/withdraw",
          element: <WithdrawSelect />
        },
        {
          path: "/crypto-deposit",
          element: <Deposit />
        },
        {
          path: "/crypto-withdraw",
          element: <Withdraw />
        },
        {
          path: "/bank-deposit",
          element: <BankDeposit />
        },
        {
          path: "/bank-withdraw",
          element: <BankWithdraw />
        }
      ]
    }
  ])

  return (
    <>
     <div className="app">
        <div className="container">
          <RouterProvider router={router} />
        </div>
     </div>
    </>
  )
}

export default App
