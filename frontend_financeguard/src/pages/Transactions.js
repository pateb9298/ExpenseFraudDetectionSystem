import React from "react";
import "../styles/Transactions.css";
import { FaExclamationTriangle } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

const transactions = [
  {
    id: 1,
    merchant: "Whole Foods Market",
    date: "Jan 14, 2025",
    category: "food",
    amount: -85.5,
    flagged: false,
  },
  {
    id: 2,
    merchant: "Starbucks Coffee",
    date: "Jan 14, 2025",
    category: "food",
    amount: -12.75,
    flagged: false,
  },
  {
    id: 3,
    merchant: "TechnoElectronics Ltd",
    date: "Jan 13, 2025",
    category: "shopping",
    amount: -2450.0,
    flagged: true,
    risk: 85,
  },
  {
    id: 4,
    merchant: "Shell Gas Station",
    date: "Jan 13, 2025",
    category: "transport",
    amount: -45.2,
    flagged: false,
  },
  {
    id: 5,
    merchant: "SafeWay Online Services",
    date: "Jan 12, 2025",
    category: "other",
    amount: -750.0,
    flagged: true,
    risk: 75,
  },
  {
    id: 6,
    merchant: "QuickShop Electronics",
    date: "Jan 11, 2025",
    category: "shopping",
    amount: -1299.99,
    flagged: true,
    risk: 90,
  },
];

const Transactions = () => {
  return (
    <>
      {/* Navbar at the very top */}
      <nav className="navbar">
        <div className="navbar-logo">💰 FinanceApp</div>
        <ul className="navbar-links">
          <li><a href="/">Dashboard</a></li>
          <li><a href="/add-expense">Add Expense</a></li>
          <li><a href="/transactions">Transactions</a></li>
          <li><a href="/fraud-review">Fraud Review</a></li>
          <li><a href="/budgets">Budgets</a></li>
        </ul>
      </nav>

      {/* Page content */}
      <div className="transactions-container">
        <h2 className="transactions-title">All Transactions</h2>
        <p className="transactions-subtitle">
          Search, filter, and review your spending history.
        </p>

        {/* Search and filter row */}
        <div className="transactions-search-row">
          <input
            type="text"
            placeholder="Search by merchant or description..."
            className="transactions-search"
          />
          <button className="transactions-filter-btn">
            <FiFilter size={18} />
            Filters
          </button>
        </div>

        {/* Transactions list */}
        <div className="transactions-list">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className={`transaction-item ${tx.flagged ? "flagged" : ""}`}
            >
              <div className="transaction-left">
                {tx.flagged && (
                  <span className="flagged-icon">
                    <FaExclamationTriangle />
                  </span>
                )}
                <div className="transaction-info">
                  <p className="transaction-merchant">{tx.merchant}</p>
                  <p className="transaction-date">
                    {tx.date} •{" "}
                    <span className={`category-tag ${tx.category}`}>
                      {tx.category}
                    </span>
                  </p>
                </div>
              </div>

              <div className="transaction-right">
                <p className="transaction-amount">
                  {tx.amount < 0
                    ? `-$${Math.abs(tx.amount).toFixed(2)}`
                    : `$${tx.amount.toFixed(2)}`}
                </p>
                {tx.flagged && (
                  <div className="flagged-details">
                    <span className="flagged-badge">Flagged</span>
                    <span className="risk-score">Risk: {tx.risk}/100</span>
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
