// const { spawn } = require("child_process");
// const path = require("path");

// function runNewsJob() {
//   console.log("🚀 Running fetch_news.py manually2...");

//   const pythonPath =
//     "C:\\Users\\prcha\\AppData\\Local\\Programs\\Python\\Python313\\python.exe";
//   const scriptPath =
//     "C:\\Users\\prcha\\OneDrive\\Desktop\\Final Year Project\\smart Crime\\backend\\ml\\fetch_news.py";

//   const process = spawn(pythonPath, [scriptPath]);

//   process.stdout.on("data", (data) => console.log(`✅ Output: ${data}`));
//   process.stderr.on("data", (data) => console.error(`❌ Error: ${data}`));
//   process.on("close", (code) => console.log(`🔚 Exited with code ${code}`));
// }

// module.exports = { runNewsJob };

const { spawn } = require("child_process");
const path = require("path");

function runNewsJob() {
  console.log("🚀 Running fetch_news.py on Render...");

  // ✅ Use relative path to backend/ml/fetch_news.py
  const pythonPath = "python3"; // Render uses python3 globally
  const scriptPath = path.join(__dirname, "ml", "fetch_news.py");

  const process = spawn(pythonPath, [scriptPath]);

  process.stdout.on("data", (data) => console.log(`✅ Output: ${data}`));
  process.stderr.on("data", (data) => console.error(`❌ Error: ${data}`));
  process.on("close", (code) => console.log(`🔚 Exited with code ${code}`));
}

module.exports = { runNewsJob };
