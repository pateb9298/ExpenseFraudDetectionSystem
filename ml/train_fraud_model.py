import pandas as pd
import joblib
from sklearn.model_selection import train_test_split #split dataset into training and testing sets
from sklearn.ensemble import RandomForestClassifier #machine learning algorithm used for classification
from sklearn.metrics import classification_report, confusion_matrix#detailed summary on model's performance 


df = pd.read_csv("data/archive/creditcard_2023.csv")  # path to your CSV

#Quick Look at the data
print("First 5 rows of the dataset:")
print(df.head())

#Seperate features (X) and Labels (y)
X = df.drop('Class', axis=1) #All columns except 'Class' are features
y = df['Class'] #'Class' is our target: 0=legit, 1=fraud

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