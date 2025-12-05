const mongoose = require("mongoose");
const Post = require("../models/Post"); // aapka model

// 🔗 MongoDB connection
mongoose
  .connect(
    "mongodb+srv://prchaudhari3172_db_user:m6TAbyMSJ0AXJcia@cluster0.xdas6bd.mongodb.net/?appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("🗄 MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function insertDummyData() {
  // 👇 Yahaan apna actual array daalna hai

  const posts = [
    {
      text: "Murder in Mumbai Bandra area",
      location: { lat: 19.0544, lng: 72.8401 },
      label: 2,
    },
    {
      text: "Robbery at Pune Shivaji Nagar",
      location: { lat: 18.5196, lng: 73.8553 },
      label: 1,
    },
    {
      text: "Pickpocketing in Nagpur Sitabuldi market",
      location: { lat: 21.15, lng: 79.09 },
      label: 0,
    },
    {
      text: "Arson in Nashik Panchavati area",
      location: { lat: 20.0, lng: 73.784 },
      label: 2,
    },
    {
      text: "Minor theft in Thane Ghodbunder road",
      location: { lat: 19.23, lng: 72.963 },
      label: 0,
    },
    {
      text: "Kidnapping attempt in Aurangabad CIDCO",
      location: { lat: 19.8795, lng: 75.3413 },
      label: 1,
    },
    {
      text: "Murder in Kolhapur city center",
      location: { lat: 16.694, lng: 74.2433 },
      label: 2,
    },
    {
      text: "Robbery at Solapur main bazaar",
      location: { lat: 17.6599, lng: 75.9064 },
      label: 1,
    },
    {
      text: "Car theft in Jalgaon residential area",
      location: { lat: 21.0076, lng: 75.5626 },
      label: 0,
    },
    {
      text: "Chain snatching in Amravati urban area",
      location: { lat: 20.9333, lng: 77.7797 },
      label: 1,
    },
    {
      text: "Rape reported in Latur city outskirts",
      location: { lat: 18.4106, lng: 76.5603 },
      label: 2,
    },
    {
      text: "Pickpocketing in Chandrapur main square",
      location: { lat: 19.96, lng: 79.3 },
      label: 0,
    },
    {
      text: "Armed robbery in Nanded downtown",
      location: { lat: 19.1383, lng: 77.321 },
      label: 2,
    },
    {
      text: "Minor theft in Akola market area",
      location: { lat: 20.71, lng: 77.003 },
      label: 0,
    },
    {
      text: "Kidnapping in Buldhana town center",
      location: { lat: 20.541, lng: 76.182 },
      label: 1,
    },
    {
      text: "Murder in Satara highway",
      location: { lat: 17.6805, lng: 74.0183 },
      label: 2,
    },
    {
      text: "Robbery at Ahmednagar jewelry shop",
      location: { lat: 19.0952, lng: 74.7496 },
      label: 1,
    },
    {
      text: "Pickpocketing in Ratnagiri port area",
      location: { lat: 16.99, lng: 73.312 },
      label: 0,
    },
    {
      text: "Arson in Sindhudurg village",
      location: { lat: 16.13, lng: 73.512 },
      label: 2,
    },
    {
      text: "Robbery at Mumbai Dadar station",
      location: { lat: 19.0185, lng: 72.8479 },
      label: 1,
    },
    {
      text: "Murder in Pune Kothrud area",
      location: { lat: 18.5, lng: 73.8 },
      label: 2,
    },
    {
      text: "Gold chain theft in Nagpur Dharampeth",
      location: { lat: 21.1458, lng: 79.0882 },
      label: 1,
    },
    {
      text: "Mobile snatching in Thane Vartak Nagar",
      location: { lat: 19.22, lng: 72.975 },
      label: 0,
    },
    {
      text: "Murder during family dispute in Kolhapur",
      location: { lat: 16.705, lng: 74.2433 },
      label: 2,
    },
    {
      text: "Robbery at Aurangabad MIDC area",
      location: { lat: 19.875, lng: 75.34 },
      label: 1,
    },
    {
      text: "Pickpocketing in Mumbai CST",
      location: { lat: 18.975, lng: 72.83 },
      label: 0,
    },
    {
      text: "Armed robbery at Pune Hinjewadi",
      location: { lat: 18.59, lng: 73.73 },
      label: 2,
    },
    {
      text: "Minor theft at Nashik Mela grounds",
      location: { lat: 19.9975, lng: 73.7898 },
      label: 0,
    },
    {
      text: "Murder due to political clash in Nagpur",
      location: { lat: 21.1458, lng: 79.0882 },
      label: 2,
    },
    {
      text: "Chain snatching in Solapur highway",
      location: { lat: 17.6599, lng: 75.9064 },
      label: 1,
    },
    {
      text: "Theft of electric appliances in Thane",
      location: { lat: 19.2183, lng: 72.9781 },
      label: 0,
    },
    {
      text: "Robbery at Kolhapur city center",
      location: { lat: 16.705, lng: 74.2433 },
      label: 1,
    },
    {
      text: "Murder in Aurangabad village outskirts",
      location: { lat: 19.8762, lng: 75.3433 },
      label: 2,
    },
    {
      text: "Pickpocketing in Mumbai night bazaar",
      location: { lat: 19.076, lng: 72.8777 },
      label: 0,
    },
    {
      text: "Gold chain theft in Pune suburb area",
      location: { lat: 18.5204, lng: 73.8567 },
      label: 1,
    },
    {
      text: "Minor scuffle and theft in Nashik",
      location: { lat: 19.9975, lng: 73.7898 },
      label: 0,
    },
    {
      text: "Murder during local fight in Nagpur",
      location: { lat: 21.1458, lng: 79.0882 },
      label: 2,
    },
    {
      text: "Robbery at Solapur city center",
      location: { lat: 17.6599, lng: 75.9064 },
      label: 1,
    },
    {
      text: "Mobile theft in Thane station area",
      location: { lat: 19.2183, lng: 72.9781 },
      label: 0,
    },
    {
      text: "Rape reported in Kolhapur urban area",
      location: { lat: 16.705, lng: 74.2433 },
      label: 2,
    },
    {
      text: "Chain snatching in Aurangabad city center",
      location: { lat: 19.8762, lng: 75.3433 },
      label: 1,
    },
    {
      text: "Pickpocketing in Mumbai Dadar station",
      location: { lat: 19.0185, lng: 72.8479 },
      label: 0,
    },
    {
      text: "Robbery in Pune residential sector",
      location: { lat: 18.5204, lng: 73.8567 },
      label: 1,
    },
    {
      text: "Minor theft in Nashik Market Lane",
      location: { lat: 19.9975, lng: 73.7898 },
      label: 0,
    },
    {
      text: "Murder over property dispute in Nagpur",
      location: { lat: 21.1458, lng: 79.0882 },
      label: 2,
    },
    {
      text: "Theft at Solapur bus stand area",
      location: { lat: 17.6599, lng: 75.9064 },
      label: 0,
    },
    {
      text: "Mobile snatching incident in Thane suburb",
      location: { lat: 19.2183, lng: 72.9781 },
      label: 0,
    },
    {
      text: "Robbery at Kolhapur market street",
      location: { lat: 16.705, lng: 74.2433 },
      label: 1,
    },
    {
      text: "Murder in Aurangabad downtown area",
      location: { lat: 19.8762, lng: 75.3433 },
      label: 2,
    },
    {
      text: "Pickpocketing in Mumbai night bazaar",
      location: { lat: 19.076, lng: 72.8777 },
      label: 0,
    },
    {
      text: "Gold chain theft in Pune suburb area",
      location: { lat: 18.5204, lng: 73.8567 },
      label: 1,
    },
    {
      text: "Robbery at Nashik market street",
      location: { lat: 19.9975, lng: 73.7898 },
      label: 1,
    },
    {
      text: "Murder in Thane residential zone",
      location: { lat: 19.2183, lng: 72.9781 },
      label: 2,
    },
  ];

  // ✅ Insert all at once
  try {
    await Post.insertMany(posts);
    console.log(`✅ ${posts.length} posts inserted successfully!`);
  } catch (err) {
    console.error("❌ Error inserting posts:", err);
  } finally {
    mongoose.connection.close();
  }
}

insertDummyData();
