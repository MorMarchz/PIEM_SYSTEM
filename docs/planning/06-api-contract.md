# 06. REST API Contract Document

**Project Name:** Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)  
**Document Version:** 1.0.0  
**Phase:** Phase 2 - RESTful API Specification  
**Authors:** Senior Backend Architect & API Specialist  

---

## 1. API Overview
เอกสารฉบับนี้เป็นการกำหนดข้อตกลงการเชื่อมต่อ RESTful API (REST API Contract) สำหรับ **Personal Income & Expense Management System** เพื่อใช้เป็นมาตรฐานการสื่อสารระหว่าง Frontend (React 18 + Vite 5) และ Backend (Node.js 20 LTS + Express 4)

การออกแบบ API มุ่งเน้นการปฏิบัติตามมาตรฐาน RESTful Architecture, ความปลอดภัยด้วยระบบยืนยันตัวตน (Authentication & Authorization), การแยกสิทธิ์ข้อมูลเด็ดขาดระดับผู้ใช้ (User-Level Data Isolation), ความสอดคล้องกับสคีมาฐานข้อมูล (Database Schema `05`) และข้อกำหนดเชิงฟังก์ชัน (`02`)

---

## 2. API Conventions & Standards
* **API Prefix & Versioning:** `/api/v1/` เพื่อความยืดหยุ่นในการปรับเปลี่ยนเวอร์ชัน API ในอนาคตโดยไม่กระทบ Client เดิม
* **Resource Naming:** ใช้ คำนามพหูพจน์ (Plural Nouns) ตัวอักษรพิมพ์เล็ก (kebab-case/lowercase) เช่น `/api/v1/transactions`, `/api/v1/categories`
* **HTTP Methods:**
  - `GET`: ดึงข้อมูล (Read)
  - `POST`: สร้างข้อมูลใหม่ (Create)
  - `PATCH`: แก้ไขข้อมูลบางส่วน (Update)
  - `DELETE`: ลบข้อมูล (Delete)
* **Content-Type:** บังคับใช้ `application/json` ทั้งใน Request Body และ Response Payload

---

## 3. Authentication & Session Strategy
* **Mechanism:** ใช้ **JWT (JSON Web Token)** ในการยืนยันตัวตน
* **Access Token:** ส่งผ่าน Header `Authorization: Bearer <access_token>` มีอายุสั้น (เช่น 15-30 นาที)
* **Refresh Token:** ส่งผ่าน **HTTP-Only, Secure, SameSite Cookie** มีอายุยาวกว่า (เช่น 7 วัน) เพื่อป้องกันโจรกรรมผ่าน XSS
* **Protected Routes:** API ทุกเส้นยกเว้น `/api/v1/auth/register` และ `/api/v1/auth/login` จำเป็นต้องระบุ Access Token ที่ถูกต้อง

---

## 4. API Endpoints Summary Matrix (ตารางรวมสัญญา API)

| Module | Method | Endpoint | Description | Request Body (สรุป) | Query Params | Response (สรุป) | Auth | Roles | Error Cases | หมายเหตุ |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| **Auth** | POST | `/api/v1/auth/register` | สมัครสมาชิก | email, password, display_name | - | user_id, email, display_name | No | Guest | 400 (Bad Data), 409 (Email Exists) | สร้างบัญชีใหม่ |
| **Auth** | POST | `/api/v1/auth/login` | เข้าสู่ระบบ | email, password | - | access_token, user object | No | Guest | 400 (Missing), 401 (Invalid Credentials) | เซ็ต Refresh Cookie |
| **Auth** | POST | `/api/v1/auth/logout` | ออกจากระบบ | - | - | message: "Logged out successfully" | Yes | User | 401 (Unauthorized) | ล้าง Refresh Cookie |
| **Auth** | GET | `/api/v1/auth/me` | ดึงข้อมูล User ปัจจุบัน | - | - | user_id, email, display_name | Yes | User | 401 (Unauthorized) | เช็กสถานะการเชื่องต่อ |
| **Auth** | POST | `/api/v1/auth/refresh` | ขอ Token ใหม่ | - | - | access_token | No* | User | 401 (Invalid/Expired Refresh Cookie) | อ่าน Refresh Cookie |
| **Users** | GET | `/api/v1/users/me` | ดูโปรไฟล์ตนเอง | - | - | user_id, email, display_name, created_at | Yes | User | 401 (Unauthorized) | ข้อมูลตนเองเท่านั้น |
| **Users** | PATCH | `/api/v1/users/me` | แก้ไขโปรไฟล์ | display_name | - | user_id, display_name | Yes | User | 400 (Bad Format), 401 | แก้ไขชื่อแสดงผล |
| **Users** | PATCH | `/api/v1/users/me/password` | เปลี่ยนรหัสผ่าน | current_password, new_password | - | message: "Password updated" | Yes | User | 400 (Bad Length), 401 (Wrong Password) | ยืนยัน Pass ปัจจุบัน |
| **Category**| GET | `/api/v1/categories` | ดูรายการหมวดหมู่ | - | type (income/expense) | List of categories (id, name, type, icon, color) | Yes | User | 401 (Unauthorized) | ดึงหมวดหมู่ตามประเภท |
| **Category**| GET | `/api/v1/categories/:id` | ดูรายละเอียดหมวดหมู่ | - | - | category object | Yes | User | 401, 404 (Category Not Found) | รายละเอียดหมวดหมู่ |
| **Tx** | GET | `/api/v1/transactions` | ดูประวัติ/กรองรายการ | - | type, category_id, start_date, end_date, search, page, limit | List of transactions + pagination metadata | Yes | User | 400 (Invalid Date), 401 | กรองเฉพาะ User ปัจจุบัน |
| **Tx** | GET | `/api/v1/transactions/:id` | ดูรายละเอียดรายการ | - | - | transaction object (with category details) | Yes | User | 401, 403 (Forbidden), 404 (Not Found) | ตรวจสิทธิ์ Ownership |
| **Tx** | POST | `/api/v1/transactions` | สร้างรายการใหม่ | title, amount, type, category_id, date, note | - | created transaction object | Yes | User | 400 (Amount ≤ 0 / Mismatch Cat), 401 | คำนวณ Dashboard ใหม่ |
| **Tx** | PATCH | `/api/v1/transactions/:id` | แก้ไขรายการ | title, amount, type, category_id, date, note | - | updated transaction object | Yes | User | 400 (Validation), 401, 403 (Not Owner), 404 | อัปเดตข้อมูลรายการ |
| **Tx** | DELETE | `/api/v1/transactions/:id` | ลบรายการ | - | - | message: "Transaction deleted" | Yes | User | 401, 403 (Not Owner), 404 | Hard Delete ออกจาก DB |
| **Dash** | GET | `/api/v1/dashboard/summary` | ดูยอดสรุป Dashboard | - | start_date, end_date | total_income, total_expense, net_balance | Yes | User | 400 (Invalid Date), 401 | คำนวณยอดเฉพาะ User |
| **Dash** | GET | `/api/v1/dashboard/charts` | ดูกราฟสถิติ | - | start_date, end_date, view (daily/monthly) | category_breakdown, trend_series | Yes | User | 400, 401 | ดึงข้อมูลแสดง กราฟ |
| **Reports** | GET | `/api/v1/reports/summary` | ดูรายงานสรุปทางการเงิน | - | start_date, end_date | detailed_breakdown, totals | Yes | User | 400, 401 | สรุปรายงานรายไตรมาส/ปี |

---

## 5. Request Validation Rules
1. **Transaction Validation:**
   - `amount`: ต้องเป็นตัวเลขจำนวนจริง และมีค่ามากกว่า 0 (`amount > 0`)
   - `type`: ต้องเป็น `income` หรือ `expense` เท่านั้น
   - `category_id`: ต้องมีอยู่จริงในระบบ และประเภทหมวดหมู่ต้องตรงกับ `type` ของ Transaction (เช่น ห้ามใช้ Category `income` กับ Transaction `expense`)
   - `date`: ต้องระบุในรูปแบบวันที่ ISO `YYYY-MM-DD` ที่ถูกต้อง
2. **User Validation:**
   - `email`: ต้องถูกต้องตามรูปแบบอีเมล (RFC 5322) และไม่ซ้ำซ้อนในระบบ
   - `password`: ต้องมีความยาวอย่างน้อย 8 ตัวอักษร

---

## 6. Standard Response Envelope (โครงสร้าง Response มาตรฐาน)

### 6.1 Success Response Envelope
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### 6.2 Success List Response Envelope (พร้อม Pagination)
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_items": 45,
    "total_pages": 5
  }
}
```

---

## 7. Error Handling & Standard Error Envelope

### 7.1 Error Response Structure
```json
{
  "success": false,
  "error_code": "ERROR_CODE_IDENTIFIER",
  "message": "Human readable error description",
  "details": [ ... ]
}
```

### 7.2 Standard Error Codes Taxonomy
- `AUTH_INVALID_CREDENTIALS`: อีเมลหรือรหัสผ่านไม่ถูกต้อง
- `AUTH_TOKEN_EXPIRED`: Access Token หมดอายุ
- `AUTH_UNAUTHORIZED`: ไม่ได้ส่ง Token หรือ Token ไม่ถูกต้อง
- `FORBIDDEN_RESOURCE`: พยายามเข้าถึง/จัดการ ข้อมูลที่ไม่ใช่ของตนเอง (IDOR Security Protection)
- `VALIDATION_ERROR`: ข้อมูลอินพุตที่ส่งมาไม่ผ่านเงื่อนไขการตรวจสอบ
- `TRANSACTION_NOT_FOUND`: ไม่พบรายการที่ระบุในระบบ
- `CATEGORY_NOT_FOUND`: ไม่พบหมวดหมู่ที่อ้างอิง
- `CATEGORY_TYPE_MISMATCH`: หมวดหมู่ที่เลือกไม่ตรงกับประเภทรายการ
- `INTERNAL_SERVER_ERROR`: ข้อผิดพลาดทางเทคนิคฝั่ง Server

---

## 8. HTTP Status Codes Standards
* **`200 OK`:** ดึง แก้ไข หรือลบข้อมูลสำเร็จ
* **`201 Created`:** สมัครสมาชิก หรือสร้างรายการใหม่สำเร็จ
* **`400 Bad Request`:** ข้อมูลอินพุตไม่ถูกต้องตามหลัก Validation
* **`401 Unauthorized`:** ไม่ได้เข้าสู่ระบบ หรือ Token หมดอายุ
* **`403 Forbidden`:** สิทธิ์ไม่เพียงพอ หรือพยายามเข้าถึงข้อมูลผู้ใช้อื่น
* **`404 Not Found`:** ไม่พบ Resource ที่อ้างอิง
* **`409 Conflict`:** ข้อมูลซ้ำซ้อน เช่น อีเมลมีผู้ใช้งานแล้ว
* **`422 Unprocessable Entity`:** ข้อมูลถูกต้องตามหลัก Syntax แต่ละเมิด Business Logic
* **`500 Internal Server Error`:** เกิดข้อผิดพลาดฝั่ง Database หรือ Server

---

## 9. Authorization Rules & User Data Isolation
- **Rule 1 (Row-Level Security):** Backend Express Controller ต้องสกัด `user_id` จาก JWT Access Token ที่ผ่านการตรวจสอบแล้ว (`req.user.id`) และนำไปกรองใน Query Database ทุกครั้ง
- **Rule 2 (No Parameter Trust):** ห้ามรับ `user_id` จาก Request Body หรือ Query Parameters เพื่อป้องกันการสวมรอยข้ามบัญชี

---

## 10. API Security Considerations
1. **IDOR Protection:** ตรวจสอบ Ownership ของ `transaction_id` ในทุกคำขอ `GET`, `PATCH`, `DELETE` ก่อนประมวลผล
2. **SQL Injection Protection:** ใช้ Prepared Statements (`mysql2` Parameterized Queries `?`) ในการสืบค้นข้อมูลทั้งหมด
3. **Password Hash Security:** รหัสผ่านต้องถูก Hash ด้วย `bcrypt` ก่อนบันทึก
4. **Rate Limiting:** จำกัดจำนวนคำขอ (เช่น 100 requests / 15 นาที ต่อ IP) บน API Endpoint เพื่อป้องกัน Brute Force & DDoS

---

## 11. Pagination & Filtering Specification
- **Default Limit:** `10` รายการต่อหน้า
- **Max Limit:** `100` รายการต่อหน้า (ป้องกัน Memory Bloat)
- **Supported Parameters for `/api/v1/transactions`:**
  - `page` (Default: `1`)
  - `limit` (Default: `10`, Max: `100`)
  - `sort` (Default: `date`)
  - `order` (Default: `desc`)
  - `type` (`income` | `expense`)
  - `category_id` (Integer)
  - `start_date` & `end_date` (`YYYY-MM-DD`)
  - `search` (ค้นหาจากคำใน `title` และ `note`)

---

## 12. Frontend Integration Guidelines (React + Vite + MUI 5)
- **State Integration:** ใช้ Axios Interceptor ในการแนบ `Authorization: Bearer <access_token>` อัตโนมัติทุกคำขอ
- **Token Refresh Flow:** เมื่อได้รับ `401 AUTH_TOKEN_EXPIRED` ให้ Axios Interceptor ส่งคำขอไปยัง `/api/v1/auth/refresh` เพื่อขอ Token ใหม่โดยอัตโนมัติแบบ Seamless
- **Error Display:** นำ `message` จาก Error Response Envelope ไปแสดงผลผ่าน MUI Snackbar / Alert Component

---

## 13. Open Questions & Assumptions

### Assumptions
1. สื่อสารการจัดการ Refresh Token ผ่าน HTTP-Only Cookies ปลอดภัยสูงสุดบนเบราว์เซอร์
2. Dashboard API `/api/v1/dashboard/summary` สรุปผลยอดคงเหลือและกราฟแยกตามช่วงเวลาได้ใน Response เดียวเพื่อลดจำนวน RTT HTTP Requests

### Open Questions
> [!IMPORTANT]
> 1. **Batch Deletion API:** ควรเปิด Endpoint `POST /api/v1/transactions/bulk-delete` สำหรับลบหลายรายการพร้อมกันหรือไม่?

---

## 14. Recommendations
1. **Clean Route Architecture:** จัดกลุ่ม Express Routers เป็น `auth.routes.js`, `users.routes.js`, `categories.routes.js`, `transactions.routes.js`, `dashboard.routes.js`
2. **Centralized Middleware:** จัดทำ `authenticateToken` middleware และ `validateRequest` middleware เพื่อใช้ตรวจสอบสิทธิ์และกรองอินพุตอย่างเป็นศูนย์กลาง
