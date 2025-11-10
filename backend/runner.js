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
  console.log("🚀 Running fetch_news.py");

  // Path to fetch_news.py (relative to news/)
  const scriptPath = path.join(__dirname, "..", "ml", "fetch_news.py");

  // Use the folder of fetch_news.py as cwd so Python finds .pkl files
  const cwd = path.join(__dirname, "..", "ml");

  const py = spawn("python3", [scriptPath], { cwd });

  py.stdout.on("data", (data) => console.log(`✅ ${data.toString()}`));
  py.stderr.on("data", (data) => console.error(`❌ ${data.toString()}`));
  py.on("close", (code) => console.log(`🔚 Exited with code ${code}`));
}

module.exports = { runNewsJob };

