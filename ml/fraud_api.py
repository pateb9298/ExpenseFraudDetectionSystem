from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import shap
# from sklearn.pipeline import Pipeline


app = Flask(__name__)

#Load the saved fraud model

model = joblib.load("fraud_model.pkl")

conversion_rates = {"GBP": 0.87, "USD": 1.17, "EUR": 1, "CAD": 1.61}

explainer = shap.TreeExplainer(model.named_steps['classifier'])

@app.route("/predict", methods = ["POST"])
def predict():
    data = request.json #expects a transaction

    amount = float(data.get("Amount", 0))   # user just enters a number
    currency = data.get("Currency", "EUR")  # dropdown selection
    amount_eur = amount * conversion_rates.get(currency, 1.0)

    # --- Date & Time handling ---
    date = pd.to_datetime(data.get("Date"), errors="coerce")
    day_of_week = date.dayofweek if pd.notna(date) else 0

    hour = int(data.get("Time", 0))

    #extracts the needed values (V1, V2,...Amount)
    #Convert to numpy array in the correction order (same as training features!)
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
    }])


    #runs the trained RandomForest on this input and returns 0 (legit) or 1 (fraud)
    prediction = model.predict(input_df)[0] # 0=legit, 1=fraud

    shap_values = explainer.shap_values(input_df)
    feature_contributions = dict(zip(input_df.columns, shap_values[1][0]))

    top_features = sorted(feature_contributions.items(), key=lambda x: x[1], reverse=True)[:3]
    reason = [f"{feat} = {val:.2f}" for feat, val in top_features]
    return jsonify({"fraud": bool(prediction), "reason": reason})

if __name__ == "__main__":
    app.run(port=5001, debug=True)