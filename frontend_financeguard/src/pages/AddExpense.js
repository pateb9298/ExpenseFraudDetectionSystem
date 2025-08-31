import React, { useState } from "react";
import "../styles/AddExpense.css";

export default function AddExpense() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    part_name: "",
    category: "",
    model_number: "",
    manufacturer: "",
    condition: "",
    quantity: 1,
    specs: "",
    listing_title: "",
    listing_type: "",
    price: "",
    currency: "USD",
    location: "",
    availability: "",
    notes: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/add_part", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // don't set Content-Type manually
        },
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error submitting part: " + err.message);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <>
      {/* ✅ Navbar at top */}
      <div className="navbar">
        <div className="navbar-logo">MyFinance</div>
        <ul className="navbar-links">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/add-expense">Add Expense</a></li>
          <li><a href="/transactions">Transactions</a></li>
          <li><a href="/fraud-review">Fraud Review</a></li>
          <li><a href="/budgets">Budgets</a></li>
        </ul>
      </div>

      {/* ✅ Form Container */}
      <div className="add-part-container">
        <h1 className="page-title">List New Spare Part</h1>
        <p className="subtitle">Share your spare parts with the marketplace</p>

        {/* Step Indicators */}
        <div className="steps">
          <div className={`step ${step === 1 ? "active" : ""}`}>
            <span>1</span> Part Details
          </div>
          <div className={`step ${step === 2 ? "active" : ""}`}>
            <span>2</span> Listing Info
          </div>
          <div className={`step ${step === 3 ? "active" : ""}`}>
            <span>3</span> Photos & Review
          </div>
        </div>

        {/* === Step 1 === */}
        {step === 1 && (
          <div className="form-card">
            <h2 className="form-title">📦 Part Details</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Part Name *</label>
                <input
                  type="text"
                  name="part_name"
                  value={formData.part_name}
                  onChange={handleChange}
                  placeholder="e.g. Industrial Motor Controller"
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  <option>Electronics</option>
                  <option>Automotive</option>
                  <option>Industrial</option>
                </select>
              </div>
              <div className="form-group">
                <label>Model/Part Number *</label>
                <input
                  type="text"
                  name="model_number"
                  value={formData.model_number}
                  onChange={handleChange}
                  placeholder="e.g. MC-450X"
                />
              </div>
              <div className="form-group">
                <label>Manufacturer *</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g. Siemens"
                />
              </div>
              <div className="form-group">
                <label>Condition *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  <option value="">Select condition</option>
                  <option>New</option>
                  <option>Used</option>
                  <option>Refurbished</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Technical Specifications</label>
              <textarea
                name="specs"
                value={formData.specs}
                onChange={handleChange}
                placeholder="Enter detailed specifications, dimensions, power requirements, etc."
              />
            </div>

            <div className="form-actions">
              <button className="btn secondary" disabled>
                ← Previous Step
              </button>
              <button className="btn primary" onClick={nextStep}>
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* === Step 2 === */}
        {step === 2 && (
          <div className="form-card">
            <h2 className="form-title">📝 Listing Info</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Listing Title *</label>
                <input
                  type="text"
                  name="listing_title"
                  value={formData.listing_title}
                  onChange={handleChange}
                  placeholder="e.g. Siemens Motor Controller - New"
                />
              </div>
              <div className="form-group">
                <label>Listing Type *</label>
                <select
                  name="listing_type"
                  value={formData.listing_type}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  <option>For Sale</option>
                  <option>For Trade</option>
                  <option>Wanted</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 250.00"
                />
              </div>
              <div className="form-group">
                <label>Currency *</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Toronto, Canada"
                />
              </div>
              <div className="form-group">
                <label>Availability *</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="">Select availability</option>
                  <option>In Stock</option>
                  <option>Lead Time</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add shipping info, warranty, or other details"
              />
            </div>

            <div className="form-actions">
              <button className="btn secondary" onClick={prevStep}>
                ← Previous Step
              </button>
              <button className="btn primary" onClick={nextStep}>
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* === Step 3 === */}
        {step === 3 && (
          <div className="form-card">
            <h2 className="form-title">📷 Photos & Documentation</h2>

            <div className="upload-box">
              <div className="upload-content">
                <span className="upload-icon">📤</span>
                <span className="upload-title">Upload Product Image</span>
                <span className="upload-sub">PNG, JPG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
              </div>
            </div>

            {formData.image && (
              <div className="preview-card">
                <div className="preview-left">
                  <span className="preview-icon">🖼️</span>
                  <div>
                    <div className="preview-title">{formData.image.name}</div>
                    <div className="preview-sub">
                      {(formData.image.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button className="btn secondary" onClick={prevStep}>
                ← Previous Step
              </button>
              <button className="btn primary" onClick={handleSubmit}>
                Submit Listing
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
