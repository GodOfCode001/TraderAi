import React from 'react';
import FilterableTransactionTable from '../components/FilterableTransactionTable';
import './adminTransactions.css'

// Example transactions data
const transactions = [
    { userId: 'U001', file: '/path/to/icon.png', paymentId: 'P001', status: 'Success', amount: 100.50, date: '2024-09-09' },
    { userId: 'U002', file: '/path/to/icon.png', paymentId: 'P002', status: 'Failed', amount: 200.75, date: '2024-09-08' },
    { userId: 'U001', file: '/path/to/icon.png', paymentId: 'P001', status: 'Success', amount: 100.50, date: '2024-09-09' },
    { userId: 'U002', file: '/path/to/icon.png', paymentId: 'P002', status: 'Failed', amount: 200.75, date: '2024-09-08' },
    { userId: 'U001', file: '/path/to/icon.png', paymentId: 'P001', status: 'Success', amount: 100.50, date: '2024-09-09' },
    { userId: 'U002', file: '/path/to/icon.png', paymentId: 'P002', status: 'Failed', amount: 200.75, date: '2024-09-08' },
    { userId: 'U001', file: '/path/to/icon.png', paymentId: 'P001', status: 'Success', amount: 100.50, date: '2024-09-09' },
    { userId: 'U002', file: '/path/to/icon.png', paymentId: 'P002', status: 'Failed', amount: 200.75, date: '2024-09-08' },
    { userId: 'U001', file: '/path/to/icon.png', paymentId: 'P001', status: 'Success', amount: 100.50, date: '2024-09-09' },
    { userId: 'U002', file: '/path/to/icon.png', paymentId: 'P002', status: 'Failed', amount: 200.75, date: '2024-09-08' },
    { userId: 'U001', file: '/path/to/icon.png', paymentId: 'P001', status: 'Success', amount: 100.50, date: '2024-09-09' },
    { userId: 'U002', file: '/path/to/icon.png', paymentId: 'P002', status: 'Failed', amount: 200.75, date: '2024-09-08' },
    // Add more transactions...
];

const App = () => (
    <div className='admin-transactions'>
        <div className="admin-transactions-container">
            <div className="admin-all-transactions">
        <FilterableTransactionTable transactions={transactions} />
            </div>
        </div>
    </div>
);

export default App;
