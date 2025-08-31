import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.js";   // <--- Make sure Dashboard.js is inside /src/pages
import AddExpense from "./pages/AddExpense.js";
import Transactions from "./pages/Transactions.js";
import FraudReview from "./pages/FraudReview.js";
import Budgets from "./pages/Budgets.js";



import "./styles/App.css";

// Placeholder pages until you design them
// function AddExpense() {
//   return <h1 style={{ padding: "2rem" }}>Add Expense Page (Coming Soon)</h1>;
// }

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/fraud-review" element={<FraudReview />} />
        <Route path="/Budgets" element={<Budgets />} />
      </Routes>
    </Router>
  );
}

export default App;
