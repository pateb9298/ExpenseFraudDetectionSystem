import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use(config => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export const registerUser = (userData) => api.post("/auth/register", userData);
export const loginUser = (userData) => api.post("/auth/login", userData);

// Transactions
export const addTransaction = (transactionData) => api.post("/auth/addTransaction", transactionData);
export const getAllTransactions = () => api.get("/auth/getAllTransactions");
export const getRecentTransactions = () => api.get("/auth/recentTransactions");
export const searchTransactions = (query) => api.get("/auth/search", { params: query });
export const deleteTransaction = (id) => api.delete(`/auth/delete/transaction/${id}`);
export const editTransaction = (id, updates) => api.put(`/auth/edit/transaction/${id}`, updates);

// Budgets
export const addBudget = (budgetData) => api.post("/auth/addBudget", budgetData);
export const getAllBudgets = () => api.post("/auth/getAllBudgets");
export const deleteBudget = (id) => api.delete(`/auth/delete/budget/${id}`);
export const editBudget = (id, updates) => api.put(`/auth/edit/budget/${id}`, updates);

// Fraud Alerts
export const getFraudAlerts = () => api.get("/auth/fraudAlerts");

export default api;