import React from 'react';
import { Skeleton } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';

const UserTableSkeleton = ({ rowsNum = 5 }) => {
  return (
    <div className="admin-user-table" >
      <div className="admin-user-table-container" style={{width: "100%"}}>
        <div className="user-table">
          <TableContainer component={Paper}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f0f0f0' }}>
              <Skeleton variant="rectangular" width={150} height={40} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <Skeleton variant="rectangular" width={300} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={100} height={40} />
              </div>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  {['USERNAME', 'FIRST NAME', 'Email', 'ROLE', 'CLASS'].map((header) => (
                    <TableCell key={header}>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(rowsNum)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={126} height={40} /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
              <Skeleton variant="rectangular" width={300} height={40} />
            </div>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default UserTableSkeleton;