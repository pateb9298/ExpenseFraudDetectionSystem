import React, { useState } from "react";
import { addTransaction } from "../utils/api";
import "../styles/AddExpense.css";
import { Link } from "react-router-dom";

export default function AddTransaction() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    age: "",
    amount: "",
    currency: "",
    shippingAddress: "",
    gender: "",
    typeOfCard: "",
    entryMode: "",
    typeOfTransaction: "",
    merchantGroup: "",
    countryOfTransaction: "",
    countryOfResidence: "",
    bank: "",
    date: "",
    time: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { data } = await addTransaction(formData);
      alert(data.message || "Transaction added successfully!");
      // reset form
      setFormData({
        age: "",
        amount: "",
        currency: "",
        shippingAddress: "",
        gender: "",
        typeOfCard: "",
        entryMode: "",
        typeOfTransaction: "",
        merchantGroup: "",
        countryOfTransaction: "",
        countryOfResidence: "",
        bank: "",
        date: "",
        time: "",
        description: "",
      });
      setStep(1);
    } catch (err) {
      console.error(err);
      console.error("Full error:", err);
      alert(JSON.stringify(err.response?.data || err.message));

    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <>
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-logo">MyFinance</div>
        <ul className="navbar-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/add-expense">Add Expense</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/fraud-review">Fraud Review</Link></li>
          <li><Link to="/budgets">Budgets</Link></li>
        </ul>
      </div>

      {/* Form Container */}
      <div className="add-part-container">
        <h1 className="page-title">Add New Transaction</h1>
        <p className="subtitle">Record a new transaction in your finance tracker</p>

        {/* Step Indicators */}
        <div className="steps">
          <div className={`step ${step === 1 ? "active" : ""}`}><span>1</span> Transaction Info</div>
          <div className={`step ${step === 2 ? "active" : ""}`}><span>2</span> Details</div>
          <div className={`step ${step === 3 ? "active" : ""}`}><span>3</span> Review & Submit</div>
        </div>

        {/* === Step 1 === */}
        {step === 1 && (
          <div className="form-card">
            <h2 className="form-title">💳 Transaction Info</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Amount *</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Currency *</label>
                <input type="text" name="currency" value={formData.currency} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Type of Transaction *</label>
                <input type="text" name="typeOfTransaction" value={formData.typeOfTransaction} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Entry Mode *</label>
                <input type="text" name="entryMode" value={formData.entryMode} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Type of Card *</label>
                <input type="text" name="typeOfCard" value={formData.typeOfCard} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Bank *</label>
                <input type="text" name="bank" value={formData.bank} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn secondary" disabled>← Previous Step</button>
              <button className="btn primary" onClick={nextStep}>Next Step →</button>
            </div>
          </div>
        )}

        {/* === Step 2 === */}
        {step === 2 && (
          <div className="form-card">
            <h2 className="form-title">📋 Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Merchant Group</label>
                <input type="text" name="merchantGroup" value={formData.merchantGroup} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Country of Transaction</label>
                <input type="text" name="countryOfTransaction" value={formData.countryOfTransaction} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Country of Residence</label>
                <input type="text" name="countryOfResidence" value={formData.countryOfResidence} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Shipping Address</label>
                <input type="text" name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn secondary" onClick={prevStep}>← Previous Step</button>
              <button className="btn primary" onClick={nextStep}>Next Step →</button>
            </div>
          </div>
        )}

        {/* === Step 3 === */}
        {step === 3 && (
          <div className="form-card">
            <h2 className="form-title">📝 Review & Submit</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} />
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn secondary" onClick={prevStep}>← Previous Step</button>
              <button className="btn primary" onClick={handleSubmit}>Submit Transaction</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
