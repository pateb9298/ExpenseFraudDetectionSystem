import React, { useEffect, useState, useContext } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { api } from "../utils/api";
import '../styles/Dashboard.css';
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [spendingData, setSpendingData] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [unapprovedFraudCount, setUnapprovedFraudCount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!user) return;

    // Fetch Transactions
    const fetchTransactions = async () => {
      try {
        const { data } = await api.get("/auth/recentTransactions");
        const normalized = data.map(t => ({
          ...t,
          merchant: t["Merchant Group"] || t.merchant,
          amount: t.Amount,
          date: t.Date,
          category: t["Type of Transaction"] || t.category,
          flagged: t.isFraud
        }));
        setRecentTransactions(normalized);

        // Spending Trends
        const monthTotals = {};
        normalized.forEach(t => {
          const month = new Date(t.date).toLocaleString('default', { month: 'short' });
          monthTotals[month] = (monthTotals[month] || 0) + t.amount;
        });
        setSpendingData(Object.keys(monthTotals).map(month => ({ month, amount: monthTotals[month] })));
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    // Fetch Budgets
    const fetchBudgets = async () => {
      try {
        const { data } = await api.post("/auth/getAllBudgets");
        setBudgetData(data);
      } catch (err) {
        console.error("Error fetching budgets:", err);
      }
    };

    // Fetch Fraud Alerts for list (limited)
    const fetchFraudAlerts = async () => {
      try {
        const { data } = await api.get("/auth/fraudAlertsDashboard");
        const normalized = data.map(alert => ({
          ...alert,
          merchant: alert["Merchant Group"] || alert.merchant,
          amount: alert.Amount,
          date: alert.Date,
          location: alert["Country of Transaction"] || alert.location
        }));
        setFraudAlerts(normalized);
      } catch (err) {
        console.error("Error fetching fraud alerts:", err);
      }
    };

    // Fetch all unapproved fraud alerts for the card count
    const fetchUnapprovedFraudAlerts = async () => {
      try {
        const { data } = await api.get("/auth/fraudAlertsPending");
        setUnapprovedFraudCount(data.length);
      } catch (err) {
        console.error("Error fetching unapproved fraud alerts:", err);
      }
    };

    fetchTransactions();
    fetchBudgets();
    fetchFraudAlerts();
    fetchUnapprovedFraudAlerts();
  }, [user]);

  // PieChart data for budgets
  const budgetPieData = budgetData.map(b => ({
    name: b.category,
    value: b.spent, // or b.limit - b.spent for remaining
  }));

  const totalSpent = spendingData.reduce((acc, t) => acc + t.amount, 0);
  const totalBudgetRemaining = budgetData.reduce((acc, b) => acc + (b.limit - b.spent), 0);

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          {user && (
            <div className="navbar-profile">
              <div className="profile-circle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              {dropdownOpen && (
                <div className="profile-dropdown">
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>
          )}
          <div className="navbar-logo">FinanceGuard AI</div>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/add-expense">Add Expense</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/fraud-review">Fraud Review</Link></li>
          <li><Link to="/budgets">Budgets</Link></li>
        </ul>
      </nav>

      {/* Motto */}
      <div className="motto-box">
        <div className="motto-logo">🛡️ FinanceGuard AI</div>
        <p className="motto-text">Guarding your finances, one transaction at a time.</p>
      </div>

      {/* Top Cards */}
      <div className="top-cards">
        <div className="card">
          <h3>This Month Spent</h3>
          <p className="amount">${totalSpent.toFixed(2)}</p>
          <span className="subtext red">↑ +12% from last month</span>
        </div>
        <div className="card">
          <h3>Budget Remaining</h3>
          <p className="amount">${totalBudgetRemaining.toFixed(2)}</p>
          <span className="subtext green">0.0% utilized</span>
        </div>
        <div className="card">
          <h3>Flagged Transactions</h3>
          <p className="amount">{unapprovedFraudCount}</p>
          <span className="subtext red">Requires attention</span>
        </div>
        <div className="card">
          <h3>Avg Daily Spending</h3>
          <p className="amount">${(totalSpent / 30).toFixed(2)}</p>
          <span className="subtext green">Based on current month</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Spending Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Budget Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={budgetPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
              >
                {budgetPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="alerts">
        <h2>⚠️ Fraud Alerts Require Your Attention</h2>
        {fraudAlerts.map(alert => (
          <div key={alert._id} className="alert-card high-risk">
            <div className="alert-header">
              <span className="risk-badge high">HIGH RISK</span>
              <span className="timestamp">{new Date(alert.date).toLocaleTimeString()}</span>
            </div>
            <h3>{alert.merchant} - ${alert.amount}</h3>
            <p className="location">{alert.location || "Unknown"}</p>
            <p className="note"><em>Potential fraud detected</em></p>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="transactions">
          <h2>Recent Transactions</h2>
          <ul>
            {recentTransactions.map(tx => (
              <li key={tx._id} className={tx.flagged ? "flagged" : ""}>
                <span>{tx.merchant}</span>
                <span className="expense">${tx.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="budget">
          <h2>Budget Progress</h2>
          {budgetData.map(b => {
            const percent = Math.min((b.spent / b.limit) * 100, 100);
            return (
              <div className="progress" key={b._id}>
                <label>{b.category}</label>
                <div className="bar">
                  <div className={`fill ${percent > 100 ? "red" : "green"}`} style={{width: `${percent}%`}}></div>
                </div>
                <span>${b.spent.toFixed(2)} / ${b.limit.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
