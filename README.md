# CTIX – Custom Form + Google Sheet Listing

Custom UI thay thế Google Form, cho phép:
- Người dùng gửi phản ánh / khiếu nại qua web
- Upload file đính kèm (ảnh / PDF / tài liệu)
- Lưu dữ liệu vào Google Sheet
- Trang admin hiển thị danh sách phản ánh + mở file từ Google Drive

> Dự án phục vụ demo nội bộ / PoC, không dùng framework, không build step.

---

## 🎥 Demo

- Xem video demo tại: `assets/demo.mp4`
- (Nếu không có video trong repo)  
  👉 Video/GIF demo có thể được đính kèm sau hoặc chia sẻ qua Google Drive.

**Flow demo:**
1. Điền form + upload file
2. Submit → dữ liệu được ghi vào Google Sheet
3. Mở “Danh sách phản ánh”
4. Tìm kiếm & click mở file đính kèm

---

## ✨ Features

- Custom UI giống Google Form (HTML/CSS thuần)
- Upload file → Google Drive (qua Apps Script)
- Ghi dữ liệu **đúng cột** trong Google Sheet (schema cố định)
- Listing page:
  - Load dữ liệu qua Web App (`?action=list`)
  - Search theo nội dung
  - Click mở file Drive
- Không cần backend server riêng

---

## 🧱 Tech Stack

- **Frontend:** HTML, CSS, Vanilla JS
- **Backend:** Google Apps Script (Web App)
- **Storage:** Google Sheet + Google Drive
- **Auth:** Execute as deployer (Apps Script)

---

## 📁 Project Structure

