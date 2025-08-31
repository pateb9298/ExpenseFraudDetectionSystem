import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import '../styles/Dashboard.css';

export default function Dashboard() {
  // Dummy data for charts
  const spendingData = [
    { month: "Oct", amount: 2400 },
    { month: "Nov", amount: 2800 },
    { month: "Dec", amount: 3200 },
    { month: "Jan", amount: 1800 },
  ];

  const categoryData = [
    { name: "Food & Dining", value: 35 },
    { name: "Shopping", value: 25 },
    { name: "Transport", value: 15 },
    { name: "Utilities", value: 20 },
    { name: "Other", value: 5 },
  ];

  const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="dashboard">
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

      {/* Motto */}
      <div className="motto-box">
        <div className="motto-logo">🛡️ FinanceGuard</div>
        <p className="motto-text">"Guarding your finances, one transaction at a time."</p>
      </div>

      {/* Top Cards */}
      <div className="top-cards">
        <div className="card">
          <h3>This Month Spent</h3>
          <p className="amount">$0.00</p>
          <span className="subtext red">↑ +12% from last month</span>
        </div>
        <div className="card">
          <h3>Budget Remaining</h3>
          <p className="amount">$1800.00</p>
          <span className="subtext green">0.0% utilized</span>
        </div>
        <div className="card">
          <h3>Flagged Transactions</h3>
          <p className="amount">3</p>
          <span className="subtext red">Requires attention</span>
        </div>
        <div className="card">
          <h3>Avg Daily Spending</h3>
          <p className="amount">$0.00</p>
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
          <h3>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="alerts">
        <h2>⚠️ Fraud Alerts Require Your Attention</h2>

        <div className="alert-card high-risk">
          <div className="alert-header">
            <span className="risk-badge high">HIGH RISK</span>
            <span className="timestamp">2 min ago</span>
          </div>
          <h3>Amazon Purchase - $1,247.99</h3>
          <p className="location">Seattle, WA</p>
          <p className="note"><em>Unusual amount for merchant</em></p>
          <div className="alert-actions">
            <button className="approve">✔️ Approve</button>
            <button className="block">❌ Block</button>
          </div>
        </div>

        <div className="alert-card medium-risk">
          <div className="alert-header">
            <span className="risk-badge medium">MEDIUM RISK</span>
            <span className="timestamp">15 min ago</span>
          </div>
          <h3>Gas Station - $89.50</h3>
          <p className="location">Las Vegas, NV</p>
          <p className="note"><em>Geographic anomaly</em></p>
          <div className="alert-actions">
            <button className="approve">✔️ Approve</button>
            <button className="block">❌ Block</button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        {/* Recent Transactions */}
        <div className="transactions">
          <h2>Recent Transactions</h2>
          <ul>
            <li>
              <span>Whole Foods Market</span>
              <span className="expense">-$85.50</span>
            </li>
            <li className="flagged">
              <span>TechnoElectronics Ltd</span>
              <span className="expense">-$2450.00</span>
            </li>
            <li>
              <span>Starbucks Coffee</span>
              <span className="expense">-$12.75</span>
            </li>
          </ul>
        </div>

        {/* Budget Progress */}
        <div className="budget">
          <h2>Budget Progress</h2>
          <div className="progress">
            <label>Food</label>
            <div className="bar"><div className="fill green" style={{width: "40%"}}></div></div>
            <span>$198.25 / $500.00</span>
          </div>
          <div className="progress">
            <label>Transport</label>
            <div className="bar"><div className="fill orange" style={{width: "73%"}}></div></div>
            <span>$145.20 / $200.00</span>
          </div>
          <div className="progress">
            <label>Shopping</label>
            <div className="bar"><div className="fill red" style={{width: "470%"}}></div></div>
            <span>$3749.99 / $800.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
