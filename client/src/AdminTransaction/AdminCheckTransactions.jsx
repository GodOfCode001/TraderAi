import React, { useContext, useEffect, useState } from "react";
import "./adminCheckTransactions.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import AdminUserTableHeader from "../AdminComponents/AdminUserTableHeader";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import TransactionTableSkeleton from "./TransactionTableSkeleton";
import Swal from "sweetalert2";

const AdminCheckTransactions = () => {
  const [initialData, setInitialData] = useState([]);
  const { backend } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true)
  const [remark, setRemark] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${backend}/api/admin/get-crypto-transactions`,
          {
            withCredentials: true,
          }
        );
        console.log(res);
        setInitialData(res.data);
        setData(res.data);
        setFilteredData(res.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false)
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${backend}/api/admin/get-crypto-transactions`,
        {
          withCredentials: true,
        }
      );
      console.log(res);
      setInitialData(res.data);
      setData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [searchTerm, setSearchTerm] = useState("");

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
    const filtered = data.filter(
      (item) =>
        item.AT_amount.toString().toLowerCase().includes(lowercasedTerm) ||
        item.AT_transactions_hash.toString().includes(lowercasedTerm) ||
        item.AT_status.toLowerCase().includes(lowercasedTerm) ||
        item.AT_transaction_type.toString().includes(lowercasedTerm) ||
        item.AT_date_time.toString().includes(lowercasedTerm) ||
        item.AT_crypto_symbol.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredData(filtered);
  };

  // ฟังก์ชันการกรอง
  const handleFilter = () => {
    alert("Opening filter dialog!");
    // ที่นี่คุณสามารถเปิด dialog หรือ dropdown สำหรับเลือกตัวเลือกการกรอง
  };

  const handleConfirm = (e, tranId, transactionId) => {
    e.preventDefault()
    
    Swal.fire({
      title: "Are you sure",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Confirm it!"
    }).then(async (result) => {
      if (result.isConfirmed) {

        try {
          const res = await axios.put(`${backend}/api/admin/admin-confirm`, {
            remark: remark,
            id: tranId,
            transactionsId: transactionId
          }, {withCredentials: true})
          console.log(res.data)
          Swal.fire({
            title: "Confirmed!",
            text: "Your transaction has been confirm",
            icon: "success",
            timer: 1500
          });
          setRemark("")
          fetchData()
        } catch (error) {
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

  const handleDenied = (e, transaction) => {
    e.preventDefault()
    
    Swal.fire({
      title: "Are you sure",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Confirm it!"
    }).then(async (result) => {
      if (result.isConfirmed) {

        if (transaction.AT_is_principal === 1) {

          try {
            const res = await axios.put(`${backend}/api/admin/admin-denied`, {
              remark: remark,
              id: transaction.AT_id,
              transactionsId: transaction.AT_transactions_hash,
              principal: transaction.AT_is_principal,
              amount: transaction.AT_amount,
              maker: transaction.AT_maker
            }, {withCredentials: true})
            console.log(res.data)
            Swal.fire({
              title: "Denied!",
              text: "Your transaction has been denied",
              icon: "success",
              timer: 1500
            });
            setRemark("")
            fetchData()
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: error.response ? error.response.data : "An error occurred",
              icon: "error",
              timer: 2000
            });
          }

        }

        if (transaction.AT_is_profit === 1) {
          try {
            const res = await axios.put(`${backend}/api/admin/admin-denied`, {
              remark: remark,
              id: transaction.AT_id,
              transactionsId: transaction.AT_transactions_hash,
              profit: transaction.AT_is_profit,
              amount: transaction.AT_amount,
              maker: transaction.AT_maker
            }, {withCredentials: true})
            console.log(res.data)
            Swal.fire({
              title: "Denied!",
              text: "Your transaction has been denied",
              icon: "success",
              timer: 1500
            });
            setRemark("")
            fetchData()
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: error.response ? error.response.data : "An error occurred",
              icon: "error",
              timer: 2000
            });
          }
        }

        if (transaction.AT_is_both === 1) {
          try {
            const res = await axios.put(`${backend}/api/admin/admin-denied`, {
              remark: remark,
              id: transaction.AT_id,
              transactionsId: transaction.AT_transactions_hash,
              both: transaction.AT_is_both,
              amount: transaction.AT_amount,
              maker: transaction.AT_maker
            }, {withCredentials: true})
            console.log(res.data)
            Swal.fire({
              title: "Denied!",
              text: "Your transaction has been denied",
              icon: "success",
              timer: 1500
            });
            setRemark("")
            fetchData()
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: error.response ? error.response.data : "An error occurred",
              icon: "error",
              timer: 2000
            });
          }
        }

      }
    });
  }

  return (
    <div className="AdminCheckTransactions">
      <div className="AdminCheckTransactions-container">
        <div className="table">

          {isLoading ? 
          (
            <TransactionTableSkeleton />
          ) 
          : 
          (
            <TableContainer component={Paper}>
            <AdminUserTableHeader
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>OrderId</TableCell>
                  <TableCell>UserId</TableCell>
                  <TableCell>PaymentId</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>NOTE & REMARK</TableCell>
                  <TableCell>Confirm</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => (
                    <TableRow key={index}>
                      <TableCell
                        style={{
                          width: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.AT_transactions_hash.length > 10
                          ? user.AT_transactions_hash.substring(0, 15) + "..."
                          : user.AT_transactions_hash}
                      </TableCell>
                      <TableCell> {user.AT_maker} </TableCell>
                      <TableCell> #{user.paymentId} </TableCell>
                      <TableCell
                        style={{
                          color: `${
                            user.AT_status === "pending"
                              ? "var(--yellow)"
                              : user.AT_status === "denied"
                              ? "var(--red)"
                              : "var(--green)"
                          }`,
                          fontWeight: "bold",
                        }}
                      >
                        {user.AT_status}
                      </TableCell>
                      <TableCell>{user.AT_amount}</TableCell>
                      <TableCell>
                        {new Date(user.AT_date_time).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          placeholder="remark"
                          onChange={(e) => setRemark(e.target.value)}
                          style={{
                            padding: "6px 8px",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            outline: "none",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <button className="green-btn" onClick={(e) => handleConfirm(e, user.AT_id, user.AT_transactions_hash)}>Confirm</button>
                        <button className="red-btn" onClick={(e) => handleDenied(e, user)}>Discard</button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[15, 20, 25, 50]}
              component="div"
              count={initialData.length} // จำนวน row ทั้งหมด
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Show per page"
            />
          </TableContainer>
          )}


        </div>
      </div>
    </div>
  );
};

export default AdminCheckTransactions;
