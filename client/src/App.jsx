import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, Outlet, RouterProvider, useLocation, useNavigate } from 'react-router-dom'
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
import Admin from './pages/Admin'
import AdminProtect from './RouteProtect/AdminProtect'
import AdminUser from './pages/AdminUser'
import AdminCheckTrans from './pages/AdminCheckTrans'
import AdminCheckTranCash from './pages/AdminCheckTranCash'
import AdminSettings from './pages/AdminSettings'
import ResetPassword from './pages/ResetPassword'
import ForgetPassword from './pages/ForgetPassword'
import axios from 'axios'
import { AuthContext } from './context/AuthContext'
import IsLoading from './components/IsLoading'
import UserChecking from './RouteProtect/UserChecking'
import CryptoWallet from './RouteProtect/CryptoWallet'
import Blog from './pages/Blog'
import SingleBlog from './pages/SingleBlog'
import ScrollToTop from './components/ScrollToTop'
import BlogWrite from './pages/BlogWrite'

function App() {

  const [isLoading, setIsLoading] = useState(true)
  const [feature, setFeature] = useState(null)
  // const { backend } = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      console.log("Fecthing")
     try {
      // const res = await axios.get(`${backend}/api/coins/get`)
      const res = await axios.get(`http://localhost:8800/api/coins/get`)
      setFeature(res.data)
     } catch (error) {
      console.error('Error fetching data:', error)
     } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000);
     }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return <IsLoading />
  }

  const Layout = () => {
    return (
      <>
      <UserChecking>
      <Navbar />
      <Outlet context={{ feature }}/>
      <Footer />
      </UserChecking>
      </>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <>
      <ScrollToTop />
      <Layout />
      </>,
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
          path: "/blog",
          element: <Blog />
        },
        {
          path: "/blog/:id",
          element: <SingleBlog />
        },
        {
          path: "/blog/write",
          element: <BlogWrite />
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
          // element: <Deposit />
          element: (
            <CryptoWallet>
              <Deposit />
            </CryptoWallet>
          )
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
        },
        {
          path: "/forget-password",
          element: <ForgetPassword />
        },
        {
          path: "/reset-password",
          element: <ResetPassword />
        }
      ]
    },
    {
      path: "/admin",
      element: (
        <AdminProtect>
          <Layout />
        </AdminProtect>
      ),
      children: [
        {
          path: "/admin",
          element: 
            <Admin />
        },
        {
          path: "/admin/user",
          element: <AdminUser />
        },
        {
          path: "/admin/check-transaction",
          element: <AdminCheckTrans />
        },
        {
          path: "/admin/check-transaction-cash",
          element: <AdminCheckTranCash />
        },
        {
          path: "/admin/settings",
          element: <AdminSettings />
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
