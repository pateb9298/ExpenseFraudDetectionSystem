from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

#Load the saved fraud model
model = joblib.load("fraud_model.pkl")

@app.route("/predict", methods = ["POST"])
def predict():
    data = request.json #expects a transaction

    #extracts the needed values (V1, V2,...Amount)
    #Convert to numpy array in the correction order (same as training features!)
    features = np.array([
        data["V1"], data["V2"], data["V3"], data["V4"], data["V5"], 
        data["V6"], data["V7"], data["V8"], data["V9"], data["V10"],
        data["V11"], data["V12"], data["V13"], data["V14"], data["V15"],
        data["V16"], data["V17"], data["V18"], data["V19"], data["V20"],
        data["V21"], data["V22"], data["V23"], data["V24"], data["V25"],
        data["V26"], data["V27"], data["V28"], data["Amount"]
    ]).reshape(1, -1)

    #runs the trained RandomForest on this input and returns 0 (legit) or 1 (fraud)
    prediction = model.predict(features)[0] # 0=legit, 1=fraud
    return jsonify({"fraud": bool(prediction)})

if __name__ == "__main__":
    app.run(port=5001, debug=True)