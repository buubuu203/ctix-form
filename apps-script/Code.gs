const SHEET_FORM = "Form Responses 1";
const UPLOAD_FOLDER_ID = "1z6TTaakDi23049GHa8_5qoLhfGNS5axv_Wyq8B-LLJwjOmwUz13OZ_x-v6cFYz_x-uBAuEuL";

/**
 * POST body (text/plain JSON) từ index.html:
 * {
 *   emailAddress, complaint, fullName, contactEmail, phone, contactPerson,
 *   companyName?, taxCode?,
 *   file: { name, mimeType, base64 } | null
 * }
 *
 * Supports older payloads too:
 * { fullName, email, phone, message, ... }
 */
function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) ? e.postData.contents : "{}");

    // ---- 1) Normalize payload to ONE schema (works with old/new index.html) ----
    const emailAddress = payload.emailAddress || payload.contactEmail || payload.email || "";
    const complaint = payload.complaint || payload.message || "";
    const fullName = payload.fullName || payload.full_name || payload.name || "";
    const email = payload.contactEmail || payload.email || "";
    const phone = payload.phone || "";
    const contactPerson = payload.contactPerson || payload.contact_person || "";

    // Optional: if you later add these fields to UI
    const companyName = payload.companyName || payload.company || payload.tenCongTy || "";
    const taxCode = payload.taxCode || payload.mst || payload.maSoThue || "";

    // ---- 2) Upload file (optional) ----
    let fileUrl = "";
    let fileName = "";
    if (payload.file && payload.file.base64 && payload.file.name) {
      const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
      const bytes = Utilities.base64Decode(payload.file.base64);
      const mimeType = payload.file.mimeType || "application/octet-stream";
      const blob = Utilities.newBlob(bytes, mimeType, payload.file.name);

      const f = folder.createFile(blob);
      fileUrl = f.getUrl();
      fileName = f.getName();

      // Optional public link (cẩn thận privacy):
      // f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }

    // ---- 3) Append EXACTLY to columns A..J (no header guessing) ----
    // A Timestamp
    // B Email Address
    // C Gửi phản ánh/ Khiếu nại
    // D Họ tên
    // E Email
    // F SDT
    // G Thông tin đầu mối
    // H Tên công ty
    // I Mã số thuế
    // J Test file (file URL)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_FORM) || ss.getSheets()[0];

    sh.appendRow([
      new Date(),         // A
      emailAddress,       // B
      complaint,          // C
      fullName,           // D
      email,              // E
      phone,              // F
      contactPerson,      // G
      companyName,        // H
      taxCode,            // I
      fileUrl             // J
    ]);

    return jsonOut({ ok: true, fileUrl, fileName });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action) : "ping";

    if (action === "list") {
      const sheetName = (e && e.parameter && e.parameter.sheetName) ? String(e.parameter.sheetName) : SHEET_FORM;
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sh = ss.getSheetByName(sheetName);
      if (!sh) return jsonOut({ ok: false, error: `Sheet not found: ${sheetName}` });

      const values = sh.getDataRange().getValues();
      return jsonOut({ ok: true, sheetName: sh.getName(), values });
    }

    return jsonOut({ ok: true, message: "Endpoint alive" });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional utilities (keep)
function authorizeDrive() {
  const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
  Logger.log(folder.getName());
}
function forceDriveWriteScope() {
  const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
  const blob = Utilities.newBlob("scope test", "text/plain", "scope_test.txt");
  const f = folder.createFile(blob);
  Logger.log(f.getUrl());
}
