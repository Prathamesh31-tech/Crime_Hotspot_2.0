import requests
import feedparser
import joblib
import os
import time
import logging
from pymongo import MongoClient
from geopy.geocoders import Nominatim

# ----------------- Logging Setup -----------------
logging.basicConfig(
    filename="fetch_news.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger()

# ----------------- Base Directory -----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ----------------- Load ML model -----------------
try:
    model_path = os.path.join(BASE_DIR, "crime_model.pkl")
    vectorizer_path = os.path.join(BASE_DIR, "vectorizer.pkl")
    
    if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
        raise FileNotFoundError("Model or vectorizer file missing!")

    model = joblib.load(model_path, mmap_mode="r")
    vectorizer = joblib.load(vectorizer_path, mmap_mode="r")
    logger.info("✅ Model & vectorizer loaded successfully.")
except Exception as e:
    logger.error(f"❌ Error loading model/vectorizer: {e}")
    raise

# ----------------- MongoDB Setup -----------------
client = MongoClient("mongodb+srv://prchaudhari3172_db_user:m6TAbyMSJ0AXJcia@cluster0.xdas6bd.mongodb.net/?appName=Cluster0/crime-db")
db = client["crime-db"]
collection = db["posts"]

# ----------------- Geocoding Setup -----------------
geolocator = Nominatim(user_agent="SmartCrimeSystem/1.0 (prathamesh31-tech; contact@example.com)")

# ----------------- Recent News Memory Cache -----------------
recent_titles = set()
MAX_CACHE_SIZE = 500  # prevent memory growth

def already_seen(title):
    if title in recent_titles:
        return True
    recent_titles.add(title)
    if len(recent_titles) > MAX_CACHE_SIZE:
        recent_titles.pop()
    return False

# ----------------- Static City Cache -----------------
city_cache = {
    "Mumbai": (19.0760, 72.8777),
    "Pune": (18.5204, 73.8567),
    "Nagpur": (21.1458, 79.0882),
    "Nashik": (19.9975, 73.7898),
    "Thane": (19.2183, 72.9781),
    "Aurangabad": (19.8762, 75.3433),
    "Solapur": (17.6599, 75.9064),
    "Jalgaon": (21.0077, 75.5626),
    "Amravati": (20.9333, 77.7519),
    "Kolhapur": (16.7050, 74.2433),
    "Nanded": (19.1383, 77.3210),
    "Sangli": (16.8524, 74.5815),
    "Latur": (18.4088, 76.5604),
    "Ahmednagar": (19.0952, 74.7496),
    "Chandrapur": (19.9506, 79.2952),
    "Parbhani": (19.2686, 76.7708)
}

# ----------------- Helper: Safe Geocoding -----------------
def geocode_city(city):
    if city in city_cache:
        lat, lng = city_cache[city]
        return {"lat": lat, "lng": lng}
    try:
        time.sleep(1)
        location = geolocator.geocode(f"{city}, Maharashtra, India", timeout=10)
        if location:
            coords = {"lat": location.latitude, "lng": location.longitude}
            city_cache[city] = (coords["lat"], coords["lng"])
            return coords
    except Exception as e:
        logger.warning(f"⚠️ Geocode failed for {city}: {e}")
    return None

# ----------------- Location Extractor -----------------
maharashtra_cities = list(city_cache.keys())

def extract_maharashtra_location(text):
    for city in maharashtra_cities:
        if city.lower() in text.lower():
            coords = geocode_city(city)
            if coords:
                return coords
    return None

# ----------------- Crime Classification -----------------
def get_crime_level(text):
    try:
        vec = vectorizer.transform([text])
        return int(model.predict(vec)[0])  # 0,1,2
    except Exception as e:
        logger.error(f"❌ Prediction error: {e}")
        return -1

# ----------------- Save Function -----------------
def save_if_crime(text, source):
    if already_seen(text):
        logger.info(f"⏭️ Skipped recently seen news: {text[:80]}")
        return
    level = get_crime_level(text)
    if level not in [0,1,2]:
        return
    location = extract_maharashtra_location(text)
    if not location:
        return
    if not collection.find_one({"text": text}):
        collection.insert_one({
            "text": text,
            "location": location,
            "label": level,
            "source": source,
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        })
        level_name = ["Low","Medium","High"][level]
        logger.info(f"✅ Saved ({level_name}): {text[:80]} → {location}")
    else:
        logger.info(f"⚠️ Duplicate skipped (in DB): {text[:80]}")

# ----------------- Fetch Functions -----------------
def fetch_gnews():
    logger.info("🌐 Fetching from GNews.io...")
    try:
        url = "https://gnews.io/api/v4/search?q=crime%20maharashtra&lang=en&country=in&max=20&apikey=572b4058d84f38725165c0979b0aecdb"
        data = requests.get(url, timeout=15).json()
        for article in data.get("articles", []):
            title = article['title']
            text = f"{title}. {article.get('description', '')}"
            save_if_crime(text, "GNews")
    except Exception as e:
        logger.error(f"❌ GNews fetch error: {e}")

def fetch_newsapi():
    logger.info("📰 Fetching from NewsAPI.org...")
    try:
        url = "https://newsapi.org/v2/everything?q=crime%20maharashtra&language=en&apiKey=2de9bd8806444aa3b0bc88bb6d5f14d2"
        data = requests.get(url, timeout=15).json()
        for article in data.get("articles", []):
            title = article['title']
            text = f"{title}. {article.get('description', '')}"
            save_if_crime(text, "NewsAPI")
    except Exception as e:
        logger.error(f"❌ NewsAPI fetch error: {e}")

def fetch_google_rss():
    logger.info("🔎 Fetching from Google RSS...")
    try:
        rss_url = "https://news.google.com/rss/search?q=crime+maharashtra&hl=en-IN&gl=IN&ceid=IN:en"
        feed = feedparser.parse(rss_url)
        for entry in feed.entries:
            title = entry.title
            text = f"{title}. {entry.get('description', '')}"
            save_if_crime(text, "GoogleRSS")
    except Exception as e:
        logger.error(f"❌ Google RSS fetch error: {e}")

# ----------------- Main Loop -----------------
if __name__ == "__main__":
    while True:
        try:
            logger.info("🚀 Starting fetch cycle...")
            fetch_gnews()
            fetch_newsapi()
            fetch_google_rss()
            logger.info("✅ Cycle complete — waiting 1 hour before next fetch...\n")
            time.sleep(3600)  # 1 hour
        except Exception as e:
            logger.error(f"❌ Main loop error: {e}")
            logger.info("⏳ Retrying in 60 seconds...")
            time.sleep(60)
