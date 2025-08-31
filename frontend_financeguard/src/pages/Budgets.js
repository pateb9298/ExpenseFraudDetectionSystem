import React, { useState } from "react";
import "../styles/Budgets.css";

const Budgets = () => {
  const [budgets, setBudgets] = useState([
    { id: 1, category: "Food & Dining", icon: "🍔", spent: 700, limit: 500 },
    { id: 2, category: "Transportation", icon: "🚗", spent: 0, limit: 200 },
    { id: 3, category: "Shopping", icon: "🛍️", spent: 0, limit: 800 },
    { id: 4, category: "Entertainment", icon: "🎬", spent: 0, limit: 300 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: "",
    icon: "",
    spent: 0,
    limit: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newBudget.category || !newBudget.limit) return;

    const newEntry = {
      id: budgets.length + 1,
      category: newBudget.category,
      icon: newBudget.icon || "💡",
      spent: parseFloat(newBudget.spent) || 0,
      limit: parseFloat(newBudget.limit),
    };

    setBudgets([...budgets, newEntry]);
    setNewBudget({ category: "", icon: "", spent: 0, limit: "" });
    setShowForm(false);
  };

  return (
    <>
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

      {/* Page Header */}
      <div className="budgets-header">
        <h2>Manage Budgets</h2>
        <p>Set and track your spending limits across categories.</p>
        <button className="new-budget-btn" onClick={() => setShowForm(true)}>
          + New Budget
        </button>
      </div>

      {/* Budgets grid */}
      <div className="budgets-grid">
        {budgets.map((b) => {
          const remaining = b.limit - b.spent;
          const overBudget = remaining < 0;
          const percent = Math.min((b.spent / b.limit) * 100, 100);

          return (
            <div className="budget-card" key={b.id}>
              <div className="budget-header">
                <span className="budget-icon">{b.icon}</span>
                <h3 className="budget-title">{b.category}</h3>
              </div>
              <p>
                Spent this month:{" "}
                <span className="spent-amount">${b.spent.toFixed(2)}</span>
              </p>
              <div className="budget-progress">
                <div
                  className={`progress-bar ${overBudget ? "over" : ""}`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <div className="budget-limits">
                <span>0%</span>
                <span>${b.limit.toFixed(2)} Limit</span>
              </div>
              <p
                className={`budget-status ${
                  overBudget ? "over-budget" : "under-budget"
                }`}
              >
                {overBudget
                  ? `You're $${Math.abs(remaining).toFixed(2)} over budget!`
                  : `$${remaining.toFixed(2)} remaining.`}
              </p>
            </div>
          );
        })}
      </div>

      {/* Budget Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Budget</h3>
            <form onSubmit={handleSubmit} className="budget-form">
              <label>
                Category:
                <input
                  type="text"
                  name="category"
                  value={newBudget.category}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Icon (emoji):
                <input
                  type="text"
                  name="icon"
                  value={newBudget.icon}
                  onChange={handleInputChange}
                  placeholder="e.g. 🍕"
                />
              </label>
              <label>
                Spending Limit:
                <input
                  type="number"
                  name="limit"
                  value={newBudget.limit}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Spent (optional):
                <input
                  type="number"
                  name="spent"
                  value={newBudget.spent}
                  onChange={handleInputChange}
                />
              </label>
              <div className="form-actions">
                <button type="submit">Add Budget</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Budgets;
