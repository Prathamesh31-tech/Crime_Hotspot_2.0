const cron = require("node-cron");
const { spawn } = require("child_process");
const path = require("path");

function runNewsJob() {
  console.log("🕒 Starting cron job to run fetch_news.py every 1 hour...");

  const pythonPath = process.platform === "win32" ? "python" : "python3";

  const scriptPath = path.join(__dirname, "ml", "fetch_news.py");

  // ✅ 1️⃣ Immediately run once when server starts
  console.log("🚀 Running fetch_news.py immediately on startup...");
  spawn(pythonPath, [scriptPath]);

  // ✅ 2️⃣ Then run every 1 hour automatically
  cron.schedule("0 * * * *", () => {
    console.log("🔁 Running fetch_news.py via cron (hourly)...");
    const process = spawn(pythonPath, [scriptPath]);

    process.stdout.on("data", (data) => console.log(`✅ Output: ${data}`));
    process.stderr.on("data", (data) => console.error(`❌ Error: ${data}`));
    process.on("close", (code) => console.log(`🔚 Exited with code ${code}`));
  });
}

module.exports = { runNewsJob };
