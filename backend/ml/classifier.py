import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# --- Updated multi-level training data ---
data = {
    "text": [
        # 🔴 High-level crimes (2)
        "murder in city", "terrorist attack reported", "rape case filed",
        "armed robbery at bank", "bomb blast in market", "homicide discovered",
        "shootout between gangs", "human trafficking ring busted",

        # 🟠 Medium-level crimes (1)
        "house burglary", "snatched mobile phone", "cyber fraud via email",
        "credit card scam", "vehicle theft", "blackmail case", "domestic violence reported",
        "fake currency racket", "attempted robbery", "illegal arms seized",

        # 🟡 Low-level crimes (0)
        "pickpocket in train", "minor theft in shop", "street fight", "public nuisance reported",
        "petty vandalism", "illegal parking issue", "small scuffle at market",

        # Non-crime
        "enjoyed a walk", "watched movie", "festival celebrated in Pune"
    ],
    "label": [
        2,2,2,2,2,2,2,2,
        1,1,1,1,1,1,1,1,1,1,
        0,0,0,0,0,0,0,
        0,0,0
    ]
}

df = pd.DataFrame(data)
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["text"])
y = df["label"]

model = LogisticRegression(max_iter=200)
model.fit(X, y)

joblib.dump(model, "crime_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("✅ Multi-class crime model saved successfully!")
