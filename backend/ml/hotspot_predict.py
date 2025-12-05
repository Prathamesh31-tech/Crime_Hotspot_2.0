import joblib
import pandas as pd
import numpy as np
from pymongo import MongoClient
from sklearn.cluster import KMeans

# Connect to MongoDB
client = MongoClient("mongodb+srv://prchaudhari3172_db_user:m6TAbyMSJ0AXJcia@cluster0.xdas6bd.mongodb.net/?appName=Cluster0")
db = client["crime-db"]

# Fetch posts where label is 0, 1, or 2 (crime-related)
posts = list(db["posts"].find({"label": {"$in": [0, 1, 2]}}))

# Prepare DataFrame
coords = np.array([[p["location"]["lat"], p["location"]["lng"]] for p in posts if "location" in p and "lat" in p["location"] and "lng" in p["location"]])

# Handle empty data gracefully
if len(coords) == 0:
    print("No crime data available")
else:
    # Train KMeans to find hotspot
    kmeans = KMeans(n_clusters=1, n_init=10, random_state=42)
    kmeans.fit(coords)

    # Output hotspot center
    center = kmeans.cluster_centers_[0]
    print(f"{center[0]},{center[1]}")

