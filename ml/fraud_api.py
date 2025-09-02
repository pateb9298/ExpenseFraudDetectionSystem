from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import shap

app = Flask(__name__)

# Load the saved fraud model
model = joblib.load("fraud_model.pkl")

conversion_rates = {"GBP": 0.87, "USD": 1.17, "EUR": 1, "CAD": 1.61}

# Use TreeExplainer with interventional perturbation
explainer = shap.TreeExplainer(
    model.named_steps['classifier'],
    feature_perturbation="interventional"
)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json  # expects a transaction

    # --- Amount conversion ---
    amount = float(data.get("Amount", 0))
    currency = data.get("Currency", "EUR")
    amount_eur = amount * conversion_rates.get(currency, 1.0)

    # --- Date & Time handling ---
    date = pd.to_datetime(data.get("Date"), errors="coerce")
    day_of_week = date.dayofweek if pd.notna(date) else 0
    hour = int(data.get("Time", 0))

    # Construct input DataFrame (must match training features)
    input_df = pd.DataFrame([{
        "Age": data.get("Age"),
        "Amount_eur": amount_eur,
        "DayOfWeek_num": day_of_week,
        "Hour": hour,
        "Shipping Address": data.get("Shipping Address"),
        "Gender": data.get("Gender"),
        "Type of Card": data.get("Type of Card"),
        "Entry Mode": data.get("Entry Mode"),
        "Type of Transaction": data.get("Type of Transaction"),
        "Merchant Group": data.get("Merchant Group"),
        "Country of Transaction": data.get("Country of Transaction"),
        "Country of Residence": data.get("Country of Residence"),
        "Bank": data.get("Bank"),
        "IsWeekend": 0
    }])

    # --- Model prediction ---
    prediction = model.predict(input_df)[0]  # 0 = legit, 1 = fraud

    # --- SHAP explanations ---
    shap_values = explainer.shap_values(input_df, check_additivity=False)

    # Handle binary classifier output
    if isinstance(shap_values, list):
        shap_values = shap_values[1]

    # Reduce array SHAP values to scalars
    scalar_shap = [np.sum(val) if isinstance(val, np.ndarray) else val for val in shap_values[0]]

    # Map back to feature names
    feature_contributions = dict(zip(input_df.columns, scalar_shap))

    # Pick top 3 most important features
    top_features = sorted(feature_contributions.items(), key=lambda x: x[1], reverse=True)[:3]
    reason = [f"{feat} = {val:.2f}" for feat, val in top_features]

    prob = model.predict_proba(input_df)[0][1]  # Probability of fraud (class 1)
    risk_score = float(prob)  # Convert to float for JSON

    return jsonify({
        "fraud": bool(prediction),
        "riskScore": risk_score,
        "reason": reason
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True)
