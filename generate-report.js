const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const today = new Date();
const dd = String(today.getDate()).padStart(2, "0");
const mm = String(today.getMonth() + 1).padStart(2, "0");
const yyyy = today.getFullYear();
const dateStr = `${dd}/${mm}/${yyyy}`;
const reportTitle = `BigTime Automation Test Report - ${dateStr}`;

const generateCmd = `npx allure generate allure-results --clean -o allure-report --report-title "${reportTitle}"`;

exec(generateCmd, (err, stdout, stderr) => {
  if (err) {
    console.error("Error generating Allure report:", err.message);
    return;
  }
  console.log(`Allure report generated with title: "${reportTitle}"`);

  // 🔧 Update <title> in index.html
  const indexPath = path.join(__dirname, "allure-report", "index.html");
  fs.readFile(indexPath, "utf8", (readErr, data) => {
    if (readErr) {
      console.error("Error reading index.html:", readErr.message);
      return;
    }

    const updatedData = data.replace(/<title>.*?<\/title>/, `<title>${reportTitle}</title>`);
    fs.writeFile(indexPath, updatedData, "utf8", (writeErr) => {
      if (writeErr) {
        console.error("Error writing index.html:", writeErr.message);
      } else {
        console.log("Updated <title> tag in index.html");
      }
    });
  });
});
