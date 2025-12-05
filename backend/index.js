require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// ✅ FIX: Import spawnSync also
const { spawn, spawnSync } = require("child_process");

const Post = require("./models/Post");
const { runNewsJob } = require("./runner");

const app = express();
app.use(cors());
app.use(express.json());

// ------------------ MongoDB Connection ------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------ User Auth ------------------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

// Signup
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Profile
app.get("/api/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

// ------------------ Crime Endpoints ------------------

// Classify + Save
app.post("/api/classify", async (req, res) => {
  const { text, location } = req.body;

  try {
    const result = spawn("python", ["./ml/predict.py", text]);
    let output = "";

    result.stdout.on("data", (data) => (output += data.toString()));
    result.stderr.on("data", (data) => console.error(data.toString()));

    result.on("close", async () => {
      const label = parseInt(output.trim());
      const isAuthenticCrime = () => true;

      if (label === 1 && isAuthenticCrime(text)) {
        const newPost = new Post({ text, location, label });
        await newPost.save();
        return res.json({ label, stored: true });
      } else {
        return res.json({ label, stored: false });
      }
    });
  } catch (error) {
    console.error("❌ Error in /api/classify:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Heatmap Data
app.get("/api/heatmap", async (_, res) => {
  try {
    await runNewsJob();
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("❌ Error in /api/heatmap:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// District Crime Data
app.get("/api/district/:name", async (req, res) => {
  try {
    const district = req.params.name;
    const posts = await Post.find({
      text: { $regex: district, $options: "i" },
    });

    const counts = { high: 0, medium: 0, low: 0 };
    posts.forEach((p) => {
      if (p.label === 2) counts.high++;
      else if (p.label === 1) counts.medium++;
      else counts.low++;
    });

    res.json({ district, counts });
  } catch (error) {
    console.error("❌ District fetch error:", error);
    res.status(500).json({ error: "Failed to fetch district data" });
  }
});

// ---------------- HOTSPOT PREDICTION (FIXED) ----------------
app.get("/api/hotspot", async (req, res) => {
  try {
    const result = spawnSync("python", ["./ml/hotspot_predict.py"], {
      encoding: "utf-8",
    });

    if (result.error) {
      console.error("Python execution failed:", result.error);
      return res.status(500).json({ error: "Python failed to run" });
    }

    const output = result.stdout.trim();

    if (!output || output === "No crime data available") {
      return res.json({ hotspot: null });
    }

    const [lat, lng] = output.split(",");
    res.json({ hotspot: { lat: parseFloat(lat), lng: parseFloat(lng) } });
  } catch (error) {
    console.error("❌ Error in /api/hotspot:", error);
    res.status(500).json({ error: "Hotspot prediction failed" });
  }
});

// ------------------ Top Crimes ------------------
const getTopCrimes = async (label) => {
  const posts = await Post.find({ label });
  const districtCounts = {};

  posts.forEach((p) => {
    const location = p.location || "Unknown";
    districtCounts[location] = (districtCounts[location] || 0) + 1;
  });

  return Object.entries(districtCounts)
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
};

app.get("/api/top-high-crime", async (req, res) => {
  res.json(await getTopCrimes(2));
});

app.get("/api/top-medium-crime", async (req, res) => {
  res.json(await getTopCrimes(1));
});

app.get("/api/top-low-crime", async (req, res) => {
  res.json(await getTopCrimes(0));
});

// Helper function: Top 3 safe districts by label

const getSafeCrimes = async (label) => {
  const posts = await Post.find({ label });
  const districtCounts = {};

  // Count crimes per district
  posts.forEach((p) => {
    const location = p.location || "Unknown";
    districtCounts[location] = (districtCounts[location] || 0) + 1;
  });

  // Filter out districts with 0 crimes, sort ascending, and take top 3
  return Object.entries(districtCounts)
    .map(([district, count]) => ({ district, count }))
    .filter((item) => item.count > 0) // Only consider districts with at least 1 crime
    .sort((a, b) => a.count - b.count) // Ascending order
    .slice(0, 3); // Top 3 safe districts
};

// Endpoints for safe districts
app.get("/api/safe-high-crime", async (req, res) => {
  res.json(await getSafeCrimes(2)); // high-level crime label
});

app.get("/api/safe-medium-crime", async (req, res) => {
  res.json(await getSafeCrimes(1)); // medium-level crime label
});

app.get("/api/safe-low-crime", async (req, res) => {
  res.json(await getSafeCrimes(0)); // low-level crime label
});

// ------------------ START SERVER ------------------
app.listen(process.env.PORT || 8080, () =>
  console.log(`🚀 Backend running on port ${process.env.PORT || 8080}`)
);
