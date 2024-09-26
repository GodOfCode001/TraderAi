import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Select, MenuItem, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import './adminUserTable.css'
import AdminUserTableHeader from './AdminUserTableHeader';

const initialData = [
    { username: 'JohnDoe123', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
    { username: 'JaneDoe123', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
    { username: 'JohnDoe124', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
    { username: 'JaneDoe125', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
    { username: 'JohnDoe126', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
    { username: 'JaneDoe127', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
    { username: 'JohnDoe128', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
    { username: 'JaneDoe123', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
    { username: 'JohnDoe123', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
    { username: 'JaneDoe123', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
    { username: 'JohnDoe124', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
    { username: 'JaneDoe125', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
    { username: 'JohnDoe126', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
    { username: 'JaneDoe127', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
    { username: 'JohnDoe128', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
    { username: 'JaneDoe123', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
    // เพิ่มข้อมูลอื่นๆ
  ];


const AdminUserTable = () => {
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
  
    // ฟังก์ชันค้นหา
    const handleSearch = (searchTerm) => {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = data.filter(item =>
        item.username.toLowerCase().includes(lowercasedTerm) ||
        item.firstName.toLowerCase().includes(lowercasedTerm) ||
        item.lastName.toLowerCase().includes(lowercasedTerm) || 
        item.class.toLowerCase().includes(lowercasedTerm)
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
    <div className='admin-user-table'>
        <div className="admin-user-table-container">

            <div className="user-table">

            <TableContainer component={Paper}>
                <AdminUserTableHeader onSearch={handleSearch} onNewUser={handleNewUser} onFilter={handleFilter}/>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>USERNAME</TableCell>
            <TableCell>FIRST NAME</TableCell>
            <TableCell>LAST NAME</TableCell>
            <TableCell>ROLE</TableCell>
            <TableCell>CLASS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* เพิ่ม rows เพียงพอให้แสดงการจัดหน้า */}
          {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                        <TableRow key={index}>
                        <TableCell> {user.username} </TableCell>
                        <TableCell> {user.firstName} </TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>
                          <Select value={`${user.role}`}>
                            <MenuItem value="Customer">Customer</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>{user.class}</TableCell>
                      </TableRow>
          ))}
          {/* {[...Array(100)].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((_, index) => (
            <TableRow key={index}>
              <TableCell>JohnDoe123</TableCell>
              <TableCell>John</TableCell>
              <TableCell>Doe</TableCell>
              <TableCell>
                <Select value="Customer">
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </TableCell>
              <TableCell>Diamond</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10,15, 20, 25, 50]}
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

export default AdminUserTable
