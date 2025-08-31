import React, { useState } from "react";
import "../styles/Login.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Please login.");
        window.location.href = "/login";
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <input name="first_name" value={formData.first_name} onChange={handleChange} required />

        <label>Last Name</label>
        <input name="last_name" value={formData.last_name} onChange={handleChange} required />

        <label>Username</label>
        <input name="username" value={formData.username} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>
      <div className="auth-footer">
        Already have an account? <a href="/login">Login</a>
      </div>
    </div>
  );
}