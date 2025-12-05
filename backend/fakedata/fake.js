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
      text: "Murder in Jalgaon market",
      location: { lat: 21.0076, lng: 75.5626 },
      label: 2,
    },
    {
      text: "Robbery at Amravati jewelry shop",
      location: { lat: 20.9333, lng: 77.7797 },
      label: 1,
    },
    {
      text: "Pickpocketing in Nagpur bus stand",
      location: { lat: 21.1458, lng: 79.0882 },
      label: 0,
    },
    {
      text: "Arson in Mumbai suburban area",
      location: { lat: 19.076, lng: 72.8777 },
      label: 2,
    },
    {
      text: "Minor theft in Pune local market",
      location: { lat: 18.5204, lng: 73.8567 },
      label: 0,
    },
    {
      text: "Kidnapping attempt in Nashik city",
      location: { lat: 19.9975, lng: 73.7898 },
      label: 1,
    },
    {
      text: "Murder over property dispute in Thane",
      location: { lat: 19.2183, lng: 72.9781 },
      label: 2,
    },
    {
      text: "Robbery at Solapur bank",
      location: { lat: 17.6599, lng: 75.9064 },
      label: 1,
    },
    {
      text: "Car theft in Aurangabad downtown",
      location: { lat: 19.8762, lng: 75.3433 },
      label: 0,
    },
    {
      text: "Chain snatching in Kolhapur bus stand",
      location: { lat: 16.705, lng: 74.2433 },
      label: 1,
    },
    {
      text: "Rape reported in Jalna village",
      location: { lat: 19.832, lng: 75.886 },
      label: 2,
    },
    {
      text: "Pickpocketing in Chandrapur market",
      location: { lat: 19.96, lng: 79.3 },
      label: 0,
    },
    {
      text: "Armed robbery in Latur city",
      location: { lat: 18.4088, lng: 76.5603 },
      label: 2,
    },
    {
      text: "Minor theft in Akola residential area",
      location: { lat: 20.71, lng: 77.0059 },
      label: 0,
    },
    {
      text: "Kidnapping in Buldhana town",
      location: { lat: 20.541, lng: 76.182 },
      label: 1,
    },
    {
      text: "Murder in Nanded downtown",
      location: { lat: 19.1383, lng: 77.321 },
      label: 2,
    },
    {
      text: "Robbery at Satara jewelry shop",
      location: { lat: 17.6805, lng: 74.0183 },
      label: 1,
    },
    {
      text: "Pickpocketing in Ahmednagar market",
      location: { lat: 19.0952, lng: 74.7496 },
      label: 0,
    },
    {
      text: "Arson in Ratnagiri village",
      location: { lat: 16.99, lng: 73.312 },
      label: 2,
    },
    {
      text: "Minor theft in Sindhudurg city",
      location: { lat: 16.1297, lng: 73.512 },
      label: 0,
    },
    {
      text: "Robbery at Nagpur mall",
      location: { lat: 21.1458, lng: 79.0882 },
      label: 1,
    },
    {
      text: "Murder over political rivalry in Nashik",
      location: { lat: 19.9975, lng: 73.7898 },
      label: 2,
    },
    {
      text: "Gold chain theft in Pune market",
      location: { lat: 18.5204, lng: 73.8567 },
      label: 1,
    },
    {
      text: "Mobile snatching in Thane highway",
      location: { lat: 19.2183, lng: 72.9781 },
      label: 0,
    },
    {
      text: "Murder during family feud in Kolhapur",
      location: { lat: 16.705, lng: 74.2433 },
      label: 2,
    },
    {
      text: "Robbery at Aurangabad mall",
      location: { lat: 19.8762, lng: 75.3433 },
      label: 1,
    },
    {
      text: "Pickpocketing in Mumbai suburban train",
      location: { lat: 19.076, lng: 72.8777 },
      label: 0,
    },
    {
      text: "Armed robbery at Pune bank",
      location: { lat: 18.5204, lng: 73.8567 },
      label: 2,
    },
    {
      text: "Minor theft at Nashik market",
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
      text: "Robbery at Kolhapur jewelry shop",
      location: { lat: 16.705, lng: 74.2433 },
      label: 1,
    },
    {
      text: "Murder in Aurangabad village",
      location: { lat: 19.8762, lng: 75.3433 },
      label: 2,
    },
    {
      text: "Pickpocketing in Mumbai railway station",
      location: { lat: 19.076, lng: 72.8777 },
      label: 0,
    },
    {
      text: "Gold chain theft in Pune suburb",
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
      text: "Mobile theft in Thane station",
      location: { lat: 19.2183, lng: 72.9781 },
      label: 0,
    },
    {
      text: "Rape reported in Kolhapur urban area",
      location: { lat: 16.705, lng: 74.2433 },
      label: 2,
    },
    {
      text: "Chain snatching in Aurangabad",
      location: { lat: 19.8762, lng: 75.3433 },
      label: 1,
    },
    {
      text: "Pickpocketing in Mumbai night market",
      location: { lat: 19.076, lng: 72.8777 },
      label: 0,
    },
    {
      text: "Robbery in Pune residential area",
      location: { lat: 18.5204, lng: 73.8567 },
      label: 1,
    },
    {
      text: "Minor theft in Nashik market",
      location: { lat: 19.9975, lng: 73.7898 },
      label: 0,
    },
    {
      text: "Murder over property dispute in Nagpur",
      location: { lat: 21.1458, lng: 79.0882 },
      label: 2,
    },
    {
      text: "Theft at Solapur bus stand",
      location: { lat: 17.6599, lng: 75.9064 },
      label: 0,
    },
    {
      text: "Mobile snatching incident in Thane",
      location: { lat: 19.2183, lng: 72.9781 },
      label: 0,
    },
    {
      text: "Robbery at Kolhapur city center",
      location: { lat: 16.705, lng: 74.2433 },
      label: 1,
    },
    {
      text: "Murder in Aurangabad downtown area",
      location: { lat: 19.8762, lng: 75.3433 },
      label: 2,
    },
    {
      text: "Pickpocketing in Mumbai night market",
      location: { lat: 19.076, lng: 72.8777 },
      label: 0,
    },
    {
      text: "Gold chain theft in Pune suburb",
      location: { lat: 18.5204, lng: 73.8567 },
      label: 1,
    },
    // ... continue similarly to reach 100 entries
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
