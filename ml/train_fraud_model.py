import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import shap

df = pd.read_csv("data/archive/CreditCardData.csv")

# Clean Amount (remove symbols, convert to EUR)
df["Amount_clean"] = pd.to_numeric(
    df["Amount"].astype(str).str.replace(r"[^\d.]", "", regex=True),
    errors="coerce"
).fillna(0)
df["Amount_eur"] = df["Amount_clean"]

# Extract datetime features
df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
df["DayOfWeek_num"] = df["Date"].dt.dayofweek   # Monday=0, Sunday=6
df["IsWeekend"] = df["DayOfWeek_num"].isin([5, 6]).astype(int)

# Time column is just the hour already
df["Hour"] = pd.to_numeric(df["Time"], errors="coerce")

# Drop unused columns
df = df.drop(columns=["Transaction ID", "Date", "Time", "Day of Week"])

# Feature groups
numeric_cols = ["Age", "Amount_eur", "DayOfWeek_num", "IsWeekend", "Hour"]
categorical_cols = [
    "Shipping Address", "Gender", "Type of Card", "Entry Mode", "Type of Transaction",
    "Merchant Group", "Country of Transaction", "Country of Residence", "Bank"
]

# Preprocessor
num_imputer = SimpleImputer(strategy="median")
cat_imputer = SimpleImputer(strategy="constant", fill_value="Unknown")

preprocessor = ColumnTransformer(
    transformers=[
        ("num", num_imputer, numeric_cols),
        ("cat", Pipeline(steps=[
            ("imputer", cat_imputer),
            ("encoder", OneHotEncoder(handle_unknown="ignore"))
        ]), categorical_cols)
    ]
)

# Features/target
X = df.drop("Fraud", axis=1)
y = df["Fraud"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Model pipeline
pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))
])
pipeline.fit(X_train, y_train)

# Evaluate
y_pred = pipeline.predict(X_test)
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save model
joblib.dump(pipeline, "fraud_model.pkl")
print("Model saved successfully!")
