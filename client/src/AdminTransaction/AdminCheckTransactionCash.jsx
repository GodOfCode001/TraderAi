import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Select, MenuItem, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import AdminUserTableHeader from '../AdminComponents/AdminUserTableHeader';
import './adminCheckTransactionCash.css'

const AdminCheckTransactionCash = () => {

  const initialData = [
    { username: 'JohnDoe123', paymentId: 132456212, status: 'Waiting', amount: 500, role: 'Customer', date: "08/09/2024", confirm: 'Diamond' },
    { username: 'JaneDoe123', paymentId: 132456212, status: 'Waiting', amount: 500,  role: 'Admin', date: "08/09/2024", confirm: 'Gold' },
    { username: 'JohnDoe124', paymentId: 132456212, status: 'Waiting', amount: 500, role: 'Customer', date: "08/09/2024", confirm: 'Diamond' },
    { username: 'JaneDoe125', paymentId: 132456212, status: 'Waiting', amount: 500, role: 'Admin', date: "08/09/2024", confirm: 'Gold' },
    { username: 'JohnDoe126', paymentId: 132456212, status: 'Waiting', amount: 500, role: 'Customer', date: "08/09/2024", confirm: 'Diamond' },
    { username: 'JaneDoe127', paymentId: 132456212, status: 'Waiting', amount: 500, role: 'Admin', date: "08/09/2024", confirm: 'Gold' },
    { username: 'JohnDoe128', paymentId: 132456212, status: 'Waiting', amount: 500,  role: 'Customer',date: "08/09/2024",  confirm: 'Diamond' },
    { username: 'JaneDoe123', paymentId: 132456212, status: 'Waiting', amount: 500,  role: 'Admin', date: "08/09/2024", confirm: 'Gold' },
    { username: 'JohnDoe123', paymentId: 132456212, status: 'Waiting', amount: 500,  role: 'Customer', date: "08/09/2024", confirm: 'Diamond' },
    { username: 'JaneDoe123', paymentId: 132456212, status: 'Waiting', amount: 500,  role: 'Admin', date: "08/09/2024", confirm: 'Gold' },
    { username: 'JohnDoe124', paymentId: 132456212, status: 'Waiting', amount: 500,  role: 'Customer', date: "08/09/2024", confirm: 'Diamond' },
    { username: 'JaneDoe125', paymentId: 132456212, status: 'Waiting', amount: 500,  role: 'Admin', date: "08/09/2024", confirm: 'Gold' },
    { username: 'JohnDoe126', paymentId: 132456212, status: 'Waiting', amount: 500,  role: 'Customer', date: "08/09/2024", confirm: 'Diamond' },
    { username: 'JaneDoe127', paymentId: 132456212, status: 'Waiting', amount: 500,  role: 'Admin', date: "08/09/2024", confirm: 'Gold' },
    { username: 'JohnDoe128', paymentId: 132456212, status: 'Waiting', amount: 500,  role: 'Customer',date: "08/09/2024",  confirm: 'Diamond' },
    { username: 'JaneDoe123', paymentId: 132456212, status: 'Waiting', amount: 500,  role: 'Admin', date: "08/09/2024", confirm: 'Gold' },
    // เพิ่มข้อมูลอื่นๆ
  ];

const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

const [searchTerm, setSearchTerm] = useState('');

const handleSearchChange = (event) => {
  setSearchTerm(event.target.value);
  onSearch(event.target.value);
};

////////////////////////////////////////

const [data, setData] = useState(initialData);
const [filteredData, setFilteredData] = useState(initialData);

console.log(filteredData)

// ฟังก์ชันค้นหา
const handleSearch = (searchTerm) => {
  const lowercasedTerm = searchTerm.toLowerCase();
  const filtered = data.filter(item =>
    item.username.toLowerCase().includes(lowercasedTerm) ||
    item.paymentId.toString().includes(lowercasedTerm) ||
    item.status.toLowerCase().includes(lowercasedTerm) || 
    item.amount.toString().includes(lowercasedTerm) ||
    item.confirm.toLowerCase().includes(lowercasedTerm)
  );
  setFilteredData(filtered);
};

// ฟังก์ชันเปิดฟอร์มเพิ่มผู้ใช้ใหม่
const handleNewUser = () => {
  alert('Opening form to create a new user!');
  // ที่นี่คุณสามารถเปิด modal หรือ redirect ไปยังหน้าสำหรับการเพิ่ม user ใหม่
};

// ฟังก์ชันการกรอง
const handleFilter = () => {
  alert('Opening filter dialog!');
  // ที่นี่คุณสามารถเปิด dialog หรือ dropdown สำหรับเลือกตัวเลือกการกรอง
};

  return (
    <div className='AdminCheckTransactionCash'>
      <div className="AdminCheckTransactionCash-container">
        <div className="table">
        <TableContainer component={Paper}>
                <AdminUserTableHeader onSearch={handleSearch} onNewUser={handleNewUser} onFilter={handleFilter}/>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>OrderId</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>PaymentId</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>NOTE & REMARK</TableCell>
            <TableCell>Confirm</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* เพิ่ม rows เพียงพอให้แสดงการจัดหน้า */}
          {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                        <TableRow key={index}>
                        <TableCell> {index + 1} </TableCell>
                        <TableCell> {user.username} </TableCell>
                        <TableCell> #{user.paymentId} </TableCell>
                        <TableCell style={{color: `${user.status === "Waiting" ? "var(--warning)" : "var(--green)"}`}}>{user.status}</TableCell>
                        <TableCell>{user.amount}</TableCell>
                        <TableCell>{user.date}</TableCell>
                        <TableCell>
                        <input type="text" placeholder='remark' style={{padding: "6px 8px", border: "1px solid var(--border)", borderRadius: "4px", outline: "none"}}/>
                        </TableCell>
                        <TableCell><button className='green-btn'>Confirm</button> <button className='red-btn'>Discard</button> </TableCell>
                      </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 15, 20, 25, 50]}
        component="div"
        count={100} // จำนวน row ทั้งหมด
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Show"
      />
    </TableContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminCheckTransactionCash
