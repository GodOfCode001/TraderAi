import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../AdminComponents/adminTransactions.css'
import './filterableTransactionTable.css'
import { CiSearch } from "react-icons/ci";

const columns = [
    {
        name: 'UserID',
        selector: row => row.userId,
        sortable: true,
    },
    {
        name: 'File',
        selector: row => row.file,
        cell: row => <img src={row.file} alt="File icon" className="w-4 h-4" />,
    },
    {
        name: 'PaymentID',
        selector: row => row.paymentId,
        sortable: true,
    },
    {
        name: 'Status',
        selector: row => row.status,
        cell: row => (
            <span className={`${
                row.status === 'Success' ? 'success-status' : 'failed-status'
            }`}>
                {row.status}
            </span>
        ),
        sortable: true,
    },
    {
        name: 'Amount',
        selector: row => row.amount,
        cell: row => `$${row.amount.toFixed(2)}`,
        sortable: true,
    },
    {
        name: 'Date',
        selector: row => row.date,
        sortable: true,
    },
];

const FilterableTransactionTable = ({ transactions }) => {
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);
    const [filterText, setFiltertext] = useState("")

    useEffect(() => {
        // Simulate a loading delay of 2 seconds
        const timeout = setTimeout(() => {
            setRows(transactions);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [transactions]);

    const filteredRows = rows.filter(row => 
        row.userId.toLowerCase().includes(filterText.toLowerCase()) ||
        row.paymentId.toLowerCase().includes(filterText.toLowerCase()) ||
        row.status.toLowerCase().includes(filterText.toLowerCase()) ||
        row.amount.toString().includes(filterText) ||
        row.date.includes(filterText)
    );

    const customStyles = {
        rows: {
            style: {
                // backgroundColor: 'red',
            }
        },
        headCells: {
            style: {
                fontFamily: "sans-serif",
                backgroundColor: "var(--gray)",
            }
        },
        cells: {
            style: {
                fontFamily: "sans-serif",
                // backgroundColor: "var(--gray)",
            }
        }
    }

    return (
        <div className='transaction-table-container'>

            <div className="search-container">
                <input type="text" placeholder='Search...' value={filterText} onChange={e => setFiltertext(e.target.value)} className='search-input'/>
                <div className="icons">
                <CiSearch />
                </div>
            </div>
            <DataTable
                title="Transaction List"
                columns={columns}
                data={filteredRows}
                customStyles={customStyles}
                progressPending={pending}
                pagination
                />
        </div>
    );
};

export default FilterableTransactionTable
