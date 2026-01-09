import { google } from "googleapis";

const KEYFILEPATH = "./credentials.json"; // file JSON key của service account
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

// Sheet response mới của bạn
const SPREADSHEET_ID = "1M6VPC1sYNfMNe4gsP597oCm7tdh-RU1aR50kJgTZF44";

// Tab mặc định của Google Form thường là "Form Responses 1"
// (Bạn có thể đổi range A:Z tuỳ số cột)
const RANGE = "Form Responses 1!A1:Z1000";

async function run() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueRenderOption: "FORMATTED_VALUE",
    });

    const values = res.data.values || [];
    if (values.length === 0) {
      console.log("No data found.");
      return;
    }

    // In raw rows
    console.log("Raw rows:");
    values.forEach((row, i) => console.log(i + 1, row));

    // Bonus: convert to objects using header row
    const [headers, ...rows] = values;
    const objects = rows.map((r) =>
      Object.fromEntries(headers.map((h, idx) => [h, r[idx] ?? ""]))
    );

    console.log("\nAs objects (first 5):");
    console.log(objects.slice(0, 5));
  } catch (err) {
    console.error("Error:", err?.message || err);
    // Nếu lỗi 403: gần như chắc là chưa share sheet cho service account
  }
}

run();
