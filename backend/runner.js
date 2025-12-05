// const { spawn } = require("child_process");
// const path = require("path");
// const fs = require("fs");

// function runNewsJob() {
//   console.log("🚀 Running fetch_news.py manually2...");

// <<<<<<< HEAD
//   const pythonPath =
//     "C:\\Users\\prcha\\AppData\\Local\\Programs\\Python\\Python313\\python.exe";
//   const scriptPath =
//     "C:\\Users\\prcha\\OneDrive\\Desktop\\Final Year Project\\smart Crime\\backend\\ml\\fetch_news.py";

//   const process = spawn(pythonPath, [scriptPath]);

//   process.stdout.on("data", (data) => console.log(`✅ Output: ${data}`));
//   process.stderr.on("data", (data) => console.error(`❌ Error: ${data}`));
//   process.on("close", (code) => console.log(`🔚 Exited with code ${code}`));
// =======
//   // Path to fetch_news.py
//   const scriptPath = path.join(__dirname, "..", "ml", "fetch_news.py");
//   const cwd = path.join(__dirname, "..", "ml");

//   // ✅ Auto-detect correct Python binary
//   const pythonCmd = fs.existsSync("/usr/bin/python3") ? "python3" : "python";

//   console.log(`📘 Using Python command: ${pythonCmd}`);

//   const py = spawn(pythonCmd, [scriptPath], { cwd });

//   py.stdout.on("data", (data) => console.log(`✅ ${data.toString()}`));
//   py.stderr.on("data", (data) => console.error(`❌ ${data.toString()}`));
//   py.on("error", (err) => console.error("⚠️ Failed to start Python:", err));
//   py.on("close", (code) => console.log(`🔚 Exited with code ${code}`));
// >>>>>>> 0860a93ddc350439bb957ebbd6d350adf793eeb5
// }

// module.exports = { runNewsJob };

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

function runNewsJob() {
  console.log("🚀 Running fetch_news.py");

  // Path to fetch_news.py
  const scriptPath = path.join(__dirname, "..", "ml", "fetch_news.py");
  const cwd = path.join(__dirname, "..", "ml");

  // ✅ Auto-detect correct Python binary
  const pythonCmd = fs.existsSync("/usr/bin/python3") ? "python3" : "python";

  console.log(`📘 Using Python command: ${pythonCmd}`);

  const py = spawn(pythonCmd, [scriptPath], { cwd });

  py.stdout.on("data", (data) => console.log(`✅ ${data.toString()}`));
  py.stderr.on("data", (data) => console.error(`❌ ${data.toString()}`));
  py.on("error", (err) => console.error("⚠️ Failed to start Python:", err));
  py.on("close", (code) => console.log(`🔚 Exited with code ${code}`));
}

module.exports = { runNewsJob };
