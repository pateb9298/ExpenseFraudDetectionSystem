import pandas as pd

# Load dataset (after downloading from Kaggle)
df = pd.read_csv("data/archive/CreditCardData.csv")

print(df.head())
print(df['Class'].value_counts())  # 0 = legit, 1 = fraud
