import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

const TransactionTableSkeleton = () => {
  const rows = Array(15).fill(0);
  
  return (
    <div className="skeleton-wrapper">
      <div className="header-controls">
        <div className="filter-buttons">
          <div className="btn btn-black"></div>
          <div className="btn btn-black"></div>
        </div>
        <div className="right-controls">
          <div className="search-input"></div>
          <div className="filter-icon"></div>
          <div className="btn btn-green"></div>
        </div>
      </div>

      <TableContainer component={Paper} className="table-container">
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
            {rows.map((_, index) => (
              <TableRow key={index}>
                <TableCell className="border-cell">
                  <div className="skeleton-item"></div>
                </TableCell>
                <TableCell className="border-cell">
                  <div className="skeleton-item small"></div>
                </TableCell>
                <TableCell className="border-cell">
                  <div className="skeleton-item smaller"></div>
                </TableCell>
                <TableCell className="border-cell">
                  <div className="skeleton-item medium"></div>
                </TableCell>
                <TableCell className="border-cell">
                  <div className="skeleton-item small"></div>
                </TableCell>
                <TableCell className="border-cell">
                  <div className="skeleton-item large"></div>
                </TableCell>
                <TableCell className="border-cell">
                  <div className="skeleton-input"></div>
                </TableCell>
                <TableCell className="border-cell">
                  <div className="button-group">
                    <div className="skeleton-button confirm"></div>
                    <div className="skeleton-button discard"></div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="pagination">
          <div className="pagination-content">
            <span>Show per page</span>
            <div className="skeleton-item small"></div>
            <div className="skeleton-item medium"></div>
          </div>
        </div>
      </TableContainer>

      <style>{`
        .skeleton-wrapper {
          width: 100%;
        }

        .header-controls {
          display: flex;
          justify-content: space-between;
          padding: 16px;
          margin-bottom: 16px;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
        }

        .right-controls {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .btn {
          height: 16px;
          width: 40px;
          border-radius: 4px;
        }

        .btn-black {
          background-color: #000;
        }

        .btn-green {
          background-color: #22c55e;
          width: 60px;
        }

        .search-input {
          height: 20px;
          width: 250px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
        }

        .filter-icon {
          height: 40px;
          width: 40px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
        }

        .table-container {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .border-cell {
          border-bottom: 1px solid #e5e7eb;
        }

        .skeleton-item {
          height: 24px;
          background-color: #e5e7eb;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          display: flex;
        }

        .skeleton-item::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          animation: wave 1.6s linear infinite;
          transform: translateX(-100%);
        }

        .small {
          width: 32px;
        }

        .smaller {
          width: 24px;
        }

        .medium {
          width: 64px;
        }

        .large {
          width: 128px;
        }

        .skeleton-input {
          height: 32px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }

        .skeleton-input::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          animation: wave 1.6s linear infinite;
          transform: translateX(-100%);
        }

        .button-group {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .skeleton-button {
          height: 32px;
          width: 64px;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }

        .skeleton-button::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          animation: wave 1.6s linear infinite;
          transform: translateX(-100%);
        }

        .confirm {
          background-color: #22c55e;
        }

        .discard {
          background-color: #ef4444;
        }

        .pagination {
          display: flex;
          justify-content: flex-end;
          padding: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .pagination-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @keyframes wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default TransactionTableSkeleton;