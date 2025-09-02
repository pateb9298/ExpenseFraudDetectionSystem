import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Budgets.css";
import { Link } from "react-router-dom";


export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBudgetId, setCurrentBudgetId] = useState(null);
  const [newBudget, setNewBudget] = useState({
    category: "",
    icon: "",
    spent: 0,
    limit: "",
  });

  // Fetch budgets from backend
  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/auth/getAllBudgets",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBudgets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editMode) {
        const res = await axios.put(
          `http://localhost:5000/api/auth/edit/budget/${currentBudgetId}`,
          newBudget,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBudgets((prev) =>
          prev.map((b) => (b._id === currentBudgetId ? res.data.item : b))
        );
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/addBudget", newBudget, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBudgets([res.data.budget, ...budgets]);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving budget:", err);
    }
  };

  const handleEdit = (budget) => {
    setEditMode(true);
    setCurrentBudgetId(budget._id);
    setNewBudget({
      category: budget.category,
      icon: budget.icon,
      spent: budget.spent,
      limit: budget.limit,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/auth/delete/budget/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  };

  const resetForm = () => {
    setNewBudget({ category: "", icon: "", spent: 0, limit: "" });
    setShowForm(false);
    setEditMode(false);
    setCurrentBudgetId(null);
  };

  return (
    <>
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

      {/* Page Header */}
      <div className="budgets-header">
        <h2>Manage Budgets</h2>
        <p>Set and track your spending limits across categories.</p>
        <button className="new-budget-btn" onClick={() => setShowForm(true)}>
          + New Budget
        </button>
      </div>

      {/* Budgets Grid */}
      <div className="budgets-grid">
        {budgets.map((b) => {
          const remaining = b.limit - b.spent;
          const overBudget = remaining < 0;
          const percent = Math.min((b.spent / b.limit) * 100, 100);

          return (
            <div className="budget-card" key={b._id}>
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
              <p className={`budget-status ${overBudget ? "over-budget" : "under-budget"}`}>
                {overBudget
                  ? `You're $${Math.abs(remaining).toFixed(2)} over budget!`
                  : `$${remaining.toFixed(2)} remaining.`}
              </p>

              {/* Edit & Delete */}
              <div className="budget-actions">
                <button onClick={() => handleEdit(b)}>✏️ Edit</button>
                <button onClick={() => handleDelete(b._id)}>🗑️ Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editMode ? "Edit Budget" : "Add New Budget"}</h3>
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
                <button type="submit">{editMode ? "Save Changes" : "Add Budget"}</button>
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
