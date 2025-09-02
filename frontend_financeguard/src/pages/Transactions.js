import React, { useEffect, useState } from "react";
import "../styles/Transactions.css";
import { FaExclamationTriangle } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import axios from "axios";
import { Link } from "react-router-dom";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/getAllTransactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched transactions:", res.data); 
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchTransactions();
  }, []);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/auth/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: { merchant: search },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">💰 FinanceApp</div>
        <ul className="navbar-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/add-expense">Add Expense</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/fraud-review">Fraud Review</Link></li>
          <li><Link to="/budgets">Budgets</Link></li>
        </ul>
      </nav>

      <div className="transactions-container">
        <h2 className="transactions-title">All Transactions</h2>
        <p className="transactions-subtitle">
          Search, filter, and review your spending history.
        </p>

        {/* Search row */}
        <div className="transactions-search-row">
          <input
            type="text"
            placeholder="Search by merchant..."
            className="transactions-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="transactions-filter-btn" onClick={handleSearch}>
            <FiFilter size={18} /> Search
          </button>
        </div>

        {/* Transactions list */}
        <div className="transactions-list">
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className={`transaction-item ${tx.isFraud ? "flagged" : ""}`}
            >
              <div className="transaction-left">
                {tx.isFraud && (
                  <span className="flagged-icon">
                    <FaExclamationTriangle />
                  </span>
                )}
                <div className="transaction-info">
                  <p className="transaction-merchant">{tx["Merchant Group"]}</p>
                  <p className="transaction-date">
                    {new Date(tx.Date).toLocaleDateString()} •{" "}
                    <span className={`category-tag ${tx["Type of Transaction"]}`}>
                      {tx["Type of Transaction"]}
                    </span>
                  </p>
                </div>
              </div>

              <div className="transaction-right">
                <p className="transaction-amount">
                  -${tx.Amount.toFixed(2)}
                </p>
                {tx.isFraud && (
                  <div className="flagged-details">
                    <span className="flagged-badge">Flagged</span>
                    <span className="risk-score">Risk: {tx.riskScore}/100</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Transactions;
