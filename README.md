# AI-Powered Fraud Detection System & Expense Management
This project is an AI-powered system that allows users to manually add expenses and instantly detects unusual or potentially fraudulent transactions. It also helps users monitor budgets, analyze spending trends, and review flagged transactions.

# Features 
- Instant fraud detection when users add transactions
- Manual expense tracking and budget monitoring
- AI-based anomaly detection and review for flagged transactions
- Spending trend analysis and predictive insights

# Tech Stack 
- Frontend: React.js
- Backend: Python, Node.js
- Machine Learning: Pandas, Numpy (trained on Kaggle dataset)
- Deployment: Netlify (frontend), Render (backend)

# Installation / Setup
1. Clone the Repository
```
git clone https://github.com/YOUR_USERNAME/ExpenseFraudDetectionSystem.git
```
```
cd ExpenseFraudDetectionSystem
```

2. Install backend dependencies
```
cd backend
```
```
pip install -r requirements.txt
```

3. Run the backend
```
node server.js
```
The backend API should now run at http://localhost:5000

4. Install frontend dependencies
```
cd frontend_financeguard
```
```
npm install
npm start
```
The frontend will run at http://localhost:3000.

# Usage
- Open the live frontend link @ https://financeguardai.netlify.app/ or run locally.
- Register to make a profile/login
- Manually add expenses (Add Expense Page) to track transactions and detect fraud
- The AI model will instantly flag any transactions that appear potentially fraudulent.
- Review flagged transactions and approve/reject them.
- Monitor spending trends and budgets over time.
