#loading the model and making predictions
import joblib
import pandas as pd

model = joblib.load('ml/fraud_model.pkl')

new_data = pd.read_csv('ml/data/new_transactions.csv')

predictions = model.predict(new_data)
print(predictions)