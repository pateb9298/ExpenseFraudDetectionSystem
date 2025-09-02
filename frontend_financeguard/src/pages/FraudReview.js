import React, { useState, useEffect } from "react";
import "../styles/FraudReview.css";
import { FaExclamationTriangle } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import axios from "axios";
import { Link } from "react-router-dom";


const FraudReview = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [notes, setNotes] = useState({});
  const [expanded, setExpanded] = useState({});
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [historyTransactions, setHistoryTransactions] = useState([]);

  // Fetch flagged transactions
  useEffect(() => {
    const fetchFraud = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/fraudAlerts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Separate into pending + history
        const pending = res.data.filter((tx) => tx.reviewStatus === "pending");
        const history = res.data.filter(
          (tx) => tx.reviewStatus !== "pending"
        );
        setPendingTransactions(pending);
        setHistoryTransactions(history);
      } catch (err) {
        console.error("Error fetching fraud alerts", err);
      }
    };
    fetchFraud();
  }, []);

  // Toggle details expand/collapse
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Approve
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/fraud/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingTransactions((prev) => prev.filter((tx) => tx._id !== id));
      setHistoryTransactions((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error approving transaction", err);
    }
  };

  // Reject
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/fraud/reject/${id}`,
        { notes: notes[id] || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingTransactions((prev) => prev.filter((tx) => tx._id !== id));
      setHistoryTransactions((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error rejecting transaction", err);
    }
  };

  return (
    <div>
      {/* Navbar */}
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
            Pending Review ({pendingTransactions.length})
          </button>
          <button
            className={`fraud-tab ${selectedTab === "history" ? "active" : ""}`}
            onClick={() => setSelectedTab("history")}
          >
            Reviewed History ({historyTransactions.length})
          </button>
        </div>

        {/* Pending Transactions */}
        {selectedTab === "pending" && (
          <div className="fraud-list">
            <h3 className="fraud-section-title">Transactions Awaiting Review</h3>

            {pendingTransactions.length === 0 && <p>No pending transactions.</p>}

            {pendingTransactions.map((tx) => (
              <div key={tx._id} className="fraud-item">
                <div className="fraud-header">
                  <FaExclamationTriangle className="fraud-icon" />
                  <span className="fraud-merchant">{tx.MerchantGroup || tx.merchant}</span>
                  <span className="fraud-risk">Risk Score: {tx.riskScore}</span>
                  <button
                    className="fraud-toggle"
                    onClick={() => toggleExpand(tx._id)}
                  >
                    {expanded[tx._id] ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>
                <p className="fraud-amount">
                  ${tx.Amount.toFixed(2)} on{" "}
                  {new Date(tx.Date).toLocaleDateString()}
                </p>

                {expanded[tx._id] && (
                  <>
                    <div className="fraud-reason">
                      <strong>Reason for Flag: </strong>
                      {tx.fraudReason}
                    </div>

                    <textarea
                      className="fraud-notes"
                      placeholder="Add notes for rejection (optional)..."
                      value={notes[tx._id] || ""}
                      onChange={(e) =>
                        setNotes({ ...notes, [tx._id]: e.target.value })
                      }
                    />

                    <div className="fraud-actions">
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(tx._id)}
                      >
                        ✔ Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(tx._id)}
                      >
                        ✖ Reject
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* History Transactions */}
        {selectedTab === "history" && (
          <div className="fraud-list">
            <h3 className="fraud-section-title">Reviewed History</h3>
            {historyTransactions.length === 0 && <p>No reviewed transactions yet.</p>}

            {historyTransactions.map((tx) => (
              <div key={tx._id} className="fraud-item">
                <div className="fraud-header">
                  <FaExclamationTriangle className="fraud-icon" />
                  <span className="fraud-merchant">{tx.MerchantGroup || tx.merchant}</span>
                  <span
                    className={`fraud-status ${
                      tx.reviewStatus === "approved" ? "approved" : "rejected"
                    }`}
                  >
                    {tx.reviewStatus.toUpperCase()}
                  </span>
                </div>
                <p className="fraud-amount">
                  ${tx.Amount.toFixed(2)} on{" "}
                  {new Date(tx.Date).toLocaleDateString()}
                </p>
                {tx.reviewStatus === "rejected" && tx.reviewNotes && (
                  <p className="fraud-reason">
                    <strong>Rejection Notes:</strong> {tx.reviewNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudReview;
