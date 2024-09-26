import React, { useState } from 'react'
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminUserTableHeader = ({ onSearch, onNewUser, onFilter }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation().pathname.split('/')[2]

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
          onClick={onNewUser}
          style={{ marginLeft: '10px' }}
        >
          New User
        </Button>
      </div>
    </div>

    </div>
    </>
  )
}

export default AdminUserTableHeader
