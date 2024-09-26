import React from 'react'
import AdminBanner from '../AdminComponents/AdminBanner'
import AdminCharts from '../AdminComponents/AdminCharts'
import './admin.css'
import AdminTransactions from '../AdminComponents/AdminTransactions'

const Admin = () => {
  return (
    <div className='admin'>
      <AdminBanner />
      <AdminCharts />
      <AdminTransactions />
    </div>
  )
}

export default Admin
