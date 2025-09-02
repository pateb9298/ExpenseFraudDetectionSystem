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

        {/* Step 1 */}
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
                <select name="currency" value={formData.currency} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="GBP">GBP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>

              <div className="form-group">
                <label>Type of Transaction *</label>
                <select name="typeOfTransaction" value={formData.typeOfTransaction} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="POS">POS</option>
                  <option value="Online">Online</option>
                  <option value="ATM">ATM</option>
                </select>
              </div>

              <div className="form-group">
                <label>Entry Mode *</label>
                <select name="entryMode" value={formData.entryMode} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="PIN">PIN</option>
                  <option value="CVC">CVC</option>
                  <option value="TAP">TAP</option>
                </select>
              </div>

              <div className="form-group">
                <label>Type of Card *</label>
                <select name="typeOfCard" value={formData.typeOfCard} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="VISA">VISA</option>
                  <option value="MasterCard">MasterCard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Bank (optional)</label>
                <select name="bank" value={formData.bank} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Barclays">Barclays</option>
                  <option value="RBS">RBS</option>
                  <option value="Monzo">Monzo</option>
                  <option value="HSBC">HSBC</option>
                  <option value="Halifax">Halifax</option>
                  <option value="Lloyds">Lloyds</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn secondary" disabled>← Previous Step</button>
              <button className="btn primary" onClick={nextStep}>Next Step →</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
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
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
              </div>

              <div className="form-group">
                <label>Merchant Group</label>
                <select name="merchantGroup" value={formData.merchantGroup} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Children">Children</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Services">Services</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Food">Food</option>
                  <option value="Products">Products</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>

              <div className="form-group">
                <label>Country of Transaction</label>
                <select name="countryOfTransaction" value={formData.countryOfTransaction} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="USA">USA</option>
                  <option value="India">India</option>
                  <option value="Russia">Russia</option>
                  <option value="China">China</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>

              <div className="form-group">
                <label>Country of Residence</label>
                <select name="countryOfResidence" value={formData.countryOfResidence} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="USA">USA</option>
                  <option value="India">India</option>
                  <option value="Russia">Russia</option>
                  <option value="China">China</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>

              <div className="form-group">
                <label>Shipping Address (optional)</label>
                <select name="shippingAddress" value={formData.shippingAddress} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="USA">USA</option>
                  <option value="India">India</option>
                  <option value="Russia">Russia</option>
                  <option value="China">China</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn secondary" onClick={prevStep}>← Previous Step</button>
              <button className="btn primary" onClick={nextStep}>Next Step →</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
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
                <label>Description (optional)</label>
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
