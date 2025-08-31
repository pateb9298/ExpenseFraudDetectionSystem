import React, { useState } from "react";
import "../styles/FraudReview.css";
import { FaExclamationTriangle } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const flaggedTransactions = [
  {
    id: 1,
    merchant: "TechnoElectronics Ltd",
    amount: 2450.0,
    date: "Jan 13, 2025",
    risk: 85,
    reason:
      "Unusually high amount for unverified merchant, purchase made at odd hours, location mismatch with usual spending pattern",
  },
  {
    id: 2,
    merchant: "SafeWay Online Services",
    amount: 750.0,
    date: "Jan 12, 2025",
    risk: 75,
    reason:
      "Transaction flagged for exceeding daily average spend, merchant not frequently used",
  },
  {
    id: 3,
    merchant: "QuickShop Electronics",
    amount: 1299.99,
    date: "Jan 11, 2025",
    risk: 90,
    reason:
      "High-risk electronics merchant, purchase value exceeds account’s normal range",
  },
];

const FraudReview = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [notes, setNotes] = useState({});
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      {/* Navbar */}
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

      {/* Fraud Review Container */}
      <div className="fraud-container">
        <h2 className="fraud-title">Fraud Review</h2>
        <p className="fraud-subtitle">
          Review and resolve AI-flagged transactions.
        </p>

        {/* Tabs */}
        <div className="fraud-tabs">
          <button
            className={`fraud-tab ${selectedTab === "pending" ? "active" : ""}`}
            onClick={() => setSelectedTab("pending")}
          >
            Pending Review ({flaggedTransactions.length})
          </button>
          <button
            className={`fraud-tab ${selectedTab === "history" ? "active" : ""}`}
            onClick={() => setSelectedTab("history")}
          >
            Reviewed History (0)
          </button>
        </div>

        {/* Transactions Awaiting Review */}
        {selectedTab === "pending" && (
          <div className="fraud-list">
            <h3 className="fraud-section-title">
              Transactions Awaiting Your Review
            </h3>

            {flaggedTransactions.map((tx) => (
              <div key={tx.id} className="fraud-item">
                <div className="fraud-header">
                  <FaExclamationTriangle className="fraud-icon" />
                  <span className="fraud-merchant">{tx.merchant}</span>
                  <span className="fraud-risk">Risk Score: {tx.risk}</span>
                  <button
                    className="fraud-toggle"
                    onClick={() => toggleExpand(tx.id)}
                  >
                    {expanded[tx.id] ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>
                <p className="fraud-amount">
                  ${tx.amount.toFixed(2)} on {tx.date}
                </p>

                {expanded[tx.id] && (
                  <>
                    <div className="fraud-reason">
                      <strong>Reason for Flag: </strong>
                      {tx.reason}
                    </div>

                    <textarea
                      className="fraud-notes"
                      placeholder="Add notes for rejection (optional)..."
                      value={notes[tx.id] || ""}
                      onChange={(e) =>
                        setNotes({ ...notes, [tx.id]: e.target.value })
                      }
                    />

                    <div className="fraud-actions">
                      <button className="approve-btn">✔ Approve</button>
                      <button className="reject-btn">✖ Reject</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedTab === "history" && (
          <div className="fraud-list">
            <h3 className="fraud-section-title">Reviewed History</h3>
            <p>No reviewed transactions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudReview;
