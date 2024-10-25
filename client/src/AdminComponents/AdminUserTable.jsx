import React, { useContext, useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Select, MenuItem, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import './adminUserTable.css'
import AdminUserTableHeader from './AdminUserTableHeader';
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Swal from 'sweetalert2';
import UserTableSkeleton from './AdminUserTableSkeleton';

// const initialData = [
//     { username: 'JohnDoe123', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
//     { username: 'JaneDoe123', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
//     { username: 'JohnDoe124', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
//     { username: 'JaneDoe125', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
//     { username: 'JohnDoe126', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
//     { username: 'JaneDoe127', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
//     { username: 'JohnDoe128', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
//     { username: 'JaneDoe123', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
//     { username: 'JohnDoe123', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
//     { username: 'JaneDoe123', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
//     { username: 'JohnDoe124', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
//     { username: 'JaneDoe125', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
//     { username: 'JohnDoe126', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
//     { username: 'JaneDoe127', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
//     { username: 'JohnDoe128', firstName: 'John', lastName: 'Doe', role: 'Customer', class: 'Diamond' },
//     { username: 'JaneDoe123', firstName: 'Jane', lastName: 'Doe', role: 'Admin', class: 'Gold' },
//     // เพิ่มข้อมูลอื่นๆ
//   ];


const AdminUserTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { backend } = useContext(AuthContext)
    const [initialData, setInitialData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${backend}/api/admin/get-users`, {
            withCredentials: true
          })
          setInitialData(res.data)
          setFilteredData(res.data)
          setData(res.data)
        } catch (error) {
          console.log(error)
        }
        setIsLoading(false)
      }
      fetchData()
    }, [])

    const fetchData = async () => {
      try {
        const res = await axios.get(`${backend}/api/admin/get-users`, {
          withCredentials: true
        })
        setInitialData(res.data)
        setFilteredData(res.data);
      } catch (error) {
        console.log(error)
      }
    }
    
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
    // console.log(filteredData)
  
    // ฟังก์ชันค้นหา
    const handleSearch = (searchTerm) => {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = data.filter(item =>
        item.users_username.toLowerCase().includes(lowercasedTerm) ||
        // item.firstName.toLowerCase().includes(lowercasedTerm) ||
        item.users_email.toLowerCase().includes(lowercasedTerm) || 
        item.users_class.toLowerCase().includes(lowercasedTerm) ||
        item.users_role.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredData(filtered);
    };
  
    // ฟังก์ชันเปิดฟอร์มเพิ่มผู้ใช้ใหม่
    // const handleNewUser = () => {
    //     setOpen(true); // เปิด Modal เมื่อกด New User
    // };
  
    // ฟังก์ชันการกรอง
    const handleFilter = () => {
      alert('Opening filter dialog!');
      // ที่นี่คุณสามารถเปิด dialog หรือ dropdown สำหรับเลือกตัวเลือกการกรอง
    };

    // Update userRole 

    const updateRole = async (e, userId, newRole) => {
      e.preventDefault()

      Swal.fire({
        title: "Are you sure",
        text: "You will change the user role?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!"
      }).then(async (result) => {
        if (result.isConfirmed) {

          try {
            const res = await axios.put(`${backend}/api/admin/change-role`, {
              changedRole: newRole, // ส่งค่า role ใหม่
              changedId: userId, // ส่งค่า ID ของ user
            }, {
              withCredentials: true,
            });
            
            Swal.fire({
              title: "Changed!",
              text: "User role has been changed.",
              icon: "success",
              timer: 1500
            });
            fetchData()
          } catch (error) {
            console.log(error)
            Swal.fire({
              title: "Error",
              text: error.response ? error.response.data : "An error occurred",
              icon: "error",
              timer: 2000
            });
          }


        }
      });
    }

  return (
    <div className="admin-user-table">
      <div className="admin-user-table-container">
        {isLoading ? (
          <UserTableSkeleton rowsNum={10}/>
        ) : (
          <div className="user-table">
            <TableContainer component={Paper}>
              <AdminUserTableHeader
                onSearch={handleSearch}
                onFilter={handleFilter}
              />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>USERNAME</TableCell>
                    <TableCell>FIRST NAME</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>ROLE</TableCell>
                    <TableCell>CLASS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* เพิ่ม rows เพียงพอให้แสดงการจัดหน้า */}
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, index) => (
                      <TableRow key={index}>
                        <TableCell> {user.users_username} </TableCell>
                        <TableCell> {user.firstName} </TableCell>
                        <TableCell>{user.users_email}</TableCell>
                        <TableCell>
                          <Select
                            value={`${user.users_role}`}
                            onChange={(e) =>
                              updateRole(e, user.users_id, e.target.value)
                            }
                          >
                            <MenuItem value="customer">Customer</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="blogger">Blogger</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>{user.users_class}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 15, 20, 25, 50]}
                component="div"
                count={initialData.length} // จำนวน row ทั้งหมด
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Show"
              />
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUserTable
