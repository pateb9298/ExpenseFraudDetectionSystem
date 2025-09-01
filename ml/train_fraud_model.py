import pandas as pd
import joblib
from sklearn.model_selection import train_test_split #split dataset into training and testing sets
from sklearn.ensemble import RandomForestClassifier #machine learning algorithm used for classification
from sklearn.metrics import classification_report, confusion_matrix#detailed summary on model's performance 
import re
from sklearn.impute import SimpleImputer


df = pd.read_csv("data/archive/CreditCardData.csv")  # path to your CSV

#Quick Look at the data
print("First 5 rows of the dataset:")
print(df.head())

df["Amount_clean"] = df["Amount"].str.replace(r'[^\d.]', '', regex=True).astype(float)
conversion_rates = {"GBP": 0.87, "USD": 1.17, "EUR": 1, "CAD": 1.61}
df["Amount_eur"] = df.apply(
    lambda row: row['Amount_clean'] * conversion_rates.get(row["Currency"], 1.0),
    axis=1
)

df = df.drop(column=["Transaction_ID"])

num_inputer = SimpleImputer(strategy = "median")
df[["Age", "Amount_eur"]] = num_imputer.fit_transform(df[["Age", "Amount_usd"]])

cat_imputer = SimpleImputer(strategy="constant", fill_value = "Unknown")
categorical_cols = ["Shipping Address", "Gender", "Type_of_Card", "Entry_Mode", "Merchant_Group", "Country_of_Transaction", "Country_of_Residence", "Bank"]
df[categorical_cols] = cat_imputer.fit_transform(df[categorical_cols])

#Seperate features (X) and Labels (y)
X = df.drop('Fraud', axis=1) #All columns except 'Class' are features
y = df['Fraud'] #'Class' is our target: 0=legit, 1=fraud

#Split the data into training and testing sets (80% train, 20% test)
#random_state ensures same split every time run the code
X_train, X_test, y_train, y_test = train_test_split(X,y,test_size = 0.2, random_state=42, stratify = y)

#Train a random forest model - good for tabular data and can handle imbalanced datasets reasonably well
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

#Make predictions on the test set
y_pred = model.predict(X_test)

#Evaluate the model's performance
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

joblib.dump(model, 'fraud_model.pkl')
print("Model saved successfully!")