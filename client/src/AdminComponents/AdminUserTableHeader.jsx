import React, { useContext, useState } from 'react'
import { Modal, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios'
import { AuthContext } from '../context/AuthContext';

const AdminUserTableHeader = ({ onSearch, onNewUser, onFilter }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation().pathname.split('/')[2]
    const [open, setOpen] = useState(false)
    const { backend } = useContext(AuthContext)
    const [userData, setUserData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      refererCode: ''
    });

    const handleNewUser = () => {
      setOpen(true); // เปิด Modal เมื่อกด New User
    };
  
    const handleClose = () => {
      setOpen(false); // ปิด Modal
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUserData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // ส่งข้อมูล userData ไปยัง backend หรือ process อื่นๆ
      // console.log(userData);
      Swal.fire({
        title: "Are you sure",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, register it!"
      }).then(async (result) => {
        if (result.isConfirmed) {

          try {
            const res = await axios.post(`${backend}/api/admin/add-new-user`, {
              username: userData.username,
              password: userData.password,
              email: userData.email,
              referrer: userData.refererCode
            },{ withCredentials: true})
            Swal.fire({
              title: "Created!",
              text: "Your new user has been created.",
              icon: "success",
              timer: 1500
            });
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          } catch (error) {
            console.log(error)
            Swal.fire({
              title: "Error",
              text: error.response ? error.response.data : "error occurred",
              icon: "error",
              timer: 2000
            });
          }

        }
      });
      handleClose(); // ปิด Modal หลังจากกด submit
    };

    const cypto = "check-transaction"
    const userpage = 'user'

    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
      onSearch(event.target.value);
    };

    const navigate = useNavigate()

    const cyptopage = () => {
       navigate('/admin/check-transaction')
    }

    const cashpage = () => {
       navigate('/admin/check-transaction-cash')
    }

  return (
    <>
    {/* <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '16px', backgroundColor: '#f0f0f0', padding: "10px 10px", borderRadius: "12px 12px 0px 0px" }}>
      <button>Crypto</button>
      <button>Cash</button>
    </div> */}
<div style={{display: "flex", justifyContent: `${location === userpage ? "flex-end": "space-between"}`, alignItems: "center", backgroundColor: '#f0f0f0'}}>

    {location !== userpage && (
    <div style={{padding: "0px 10px", display: "flex", gap: '12px'}}>
    <button className='confirm-btn' onClick={e => cyptopage()} style={{padding: "10px 12px", width: "70px"}}>Crypto</button>
    <button className='confirm-btn' onClick={e => cashpage()} style={{padding: "10px 12px", width: "70px"}}>Cash</button>
    </div>
    )}
  


    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#f0f0f0', padding: "10px 10px", borderRadius: "12px 12px 0px 0px" }}>
      {/* Search Input */}
      <TextField
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search"
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        style={{ width: '300px', backgroundColor: 'var(--white)', overflow: "hidden", borderRadius: "8px", border: "1px solid var(--border)", outline: "none"}}
      />

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Filter Button */}
        <IconButton onClick={onFilter} color="primary">
          <FilterListIcon />
        </IconButton>

        {/* New User Button */}
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleNewUser}
          style={{ marginLeft: '10px' }}
        >
          New User
        </Button>

        <Modal open={open} onClose={handleClose}>
            <div className="modal-content" style={modalStyle}>
              <h2>สมัครสมาชิก</h2>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Username"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Email Address"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Referer Code"
                  name="refererCode"
                  value={userData.refererCode}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                  สมัครสมาชิก
                </Button>
              </form>
            </div>
        </Modal>
      </div>
    </div>

    </div>
    </>
  )
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};

export default AdminUserTableHeader
