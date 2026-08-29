# เอกสารรายงานการทดสอบความปลอดภัยและการปกป้องข้อมูลส่วนบุคคล (Security & Privacy Test Report)

**ชื่อโปรเจกต์:** Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)  
**เวอร์ชันเอกสาร:** 1.0.0  
**ระยะการพัฒนา:** Phase 20 - Security & Privacy Testing  
**ผู้ทดสอบ:** Senior Security Engineer & QA Lead  
**วันที่ทดสอบ:** 29 สิงหาคม 2026  

---

## 1. ภาพรวมการทดสอบความปลอดภัย (Executive Summary)
เอกสารฉบับนี้สรุปผลการทดสอบการรักษาความปลอดภัยของระบบและการแยกสิทธิ์ข้อมูลส่วนบุคคล (**Security & User Data Isolation**) เพื่อยืนยันว่าระบบมีความปลอดภัยระดับมาตรฐาน ปราศจากช่องโหว่ **IDOR (Insecure Direct Object Reference)**, มีการแยกสิทธิ์ข้อมูลของผู้ใช้แต่ละคนอย่างเด็ดขาด (Data Isolation 100%), การเข้ารหัสรหัสผ่าน (Password Hashing) และความปลอดภัยของ Session คุ้มครองด้วยระบบ JWT & HTTP-Only Cookie

---

## 2. ผลการสอบทานความปลอดภัยรายหัวข้อ (Security Assessment Summary)

| Domain ID | Security Assessment Area | Target Component / API | Status | Result & Mitigation |
| :---: | :--- | :--- | :---: | :--- |
| **SEC-001** | IDOR Vulnerability (Transactions API) | `/api/v1/transactions/:id` | ✅ PASS | ถูกปฏิเสธสิทธิ์ (403/404) 100% ไม่สามารถเข้าถึงข้อมูลต่าง User ได้ |
| **SEC-002** | User Data Isolation (Categories API) | `/api/v1/categories` | ✅ PASS | คืนเฉพาะ System Default + Custom Categories ของตนเอง |
| **SEC-003** | User Data Isolation (Dashboard API) | `/api/v1/dashboard/*` | ✅ PASS | คำนวณยอดเงินแยกตาม `user_id` จาก JWT Token เท่านั้น |
| **SEC-004** | Password Hashing Inspection | Database Table `users` | ✅ PASS | เข้ารหัสด้วย `bcryptjs` (Cost Factor 10) ไม่มี Plaintext |
| **SEC-005** | JWT & Cookie Security Policy | `cookie-parser` & JWT Middleware | ✅ PASS | แนบ `HttpOnly`, `SameSite=Lax`, Short-lived Access Token |
| **SEC-006** | SQL Injection Protection | MySQL2 Prepared Statements | ✅ PASS | ใช้ Parameterized Queries (`?`) ป้องกัน SQL Injection 100% |
| **SEC-007** | Cross-Site Scripting (XSS) | React JSX Auto-escaping | ✅ PASS | React 18 Escape HTML Output อัตโนมัติ |

---

## 3. รายละเอียดผลการทดสอบเชิงลึก (Detailed Penetration Test Results)

### Test Case SEC-001: การทดสอบช่องโหว่ IDOR บน Transactions API
* **Objective:** ทดสอบนำ JWT Token ของ User A ไปพยายามดึง/แก้ไข/ลบ รายการของ User B
* **Test Steps:**
  1. สร้างผู้ใช้ทดสอบ 2 คน: `User A` (`user_id: 10`) และ `User B` (`user_id: 11`)
  2. `User B` สร้างรายการการเงิน ID `99` (`ค่าใช้จ่ายส่วนตัว User B`)
  3. `User A` ส่งคำขอ API พร้อมแนบ `Authorization: Bearer <User_A_Token>`:
     - `GET /api/v1/transactions/99`
     - `PUT /api/v1/transactions/99` (Body: `{ "amount": 99999 }`)
     - `DELETE /api/v1/transactions/99`
* **Expected Result:** API ต้องปฏิเสธคำขอและคืนค่า HTTP Status Code `404 Not Found` หรือ `403 Forbidden` พร้อมข้อความแจ้งเตือน "Transaction not found or access denied"
* **Actual Result:** **PASS** (คำขอทั้ง 3 ถูกสกัดกั้นสำเร็จด้วย HTTP Status `404/403` ข้อมูลของ User B ไม่รั่วไหล)

### Test Case SEC-002: การทดสอบการแยกสิทธิ์ข้อมูลหมวดหมู่ (Categories Data Isolation)
* **Objective:** ยืนยันว่าผู้ใช้แต่ละคนจะเห็นเฉพาะหมวดหมู่พื้นฐานของระบบ และหมวดหมู่ที่ตนเองสร้างขึ้นเท่านั้น
* **Test Steps:**
  1. `User B` สร้างหมวดหมู่ส่วนตัวชื่อ `หมวดหมู่ลับเฉพาะ User B`
  2. `User A` ส่งคำขอ `GET /api/v1/categories`
* **Expected Result:** รายการหมวดหมู่ที่ส่งกลับมายัง `User A` ต้องไม่ปรากฏ `หมวดหมู่ลับเฉพาะ User B`
* **Actual Result:** **PASS** (SQL Query ใช้เงื่อนไข `WHERE is_system = TRUE OR user_id = ?` แยกสิทธิ์สมบูรณ์)

### Test Case SEC-003: การตรวจสอบความปลอดภัยการจัดเก็บรหัสผ่าน (Password Hashing)
* **Objective:** ตรวจสอบฐานข้อมูลตาราง `users` เพื่อยืนยันว่าไม่มีการจัดเก็บรหัสผ่านเป็นข้อความธรรมดา (Plaintext)
* **Test Steps:**
  1. ดำเนินการสืบค้นฐานข้อมูล `SELECT id, email, password FROM users;`
* **Expected Result:** ฟิลด์ `password` ของทุกเรคคอร์ดต้องถูกเข้ารหัสขึ้นต้นด้วยสัญลักษณ์ `$2a$10$` หรือ `$2b$10$`
* **Actual Result:** **PASS** (รหัสผ่านทุกเรคคอร์ดถูก Hash ด้วย `bcryptjs` ปลอดภัยตามมาตรฐาน)

### Test Case SEC-004: การทดสอบความปลอดภัย Cookie และ JWT Token
* **Objective:** ตรวจสอบการตั้งค่าคุณสมบัติความปลอดภัยของ Cookie
* **Test Steps:**
  1. ตรวจสอบ HTTP Response Header `Set-Cookie` จากคำขอเข้าสู่ระบบ (`POST /api/v1/auth/login`)
* **Expected Result:** มีการระบุ `HttpOnly`, `SameSite=Lax` (หรือ `Strict`) เพื่อป้องกันการเข้าถึง Cookie จาก JavaScript (ป้องกัน XSS Cookie Theft)
* **Actual Result:** **PASS** (ตั้งค่า Cookie Security Flags ครบถ้วน)

---

## 4. Verification Checklist & Definition of Done

- [x] ไม่เกิดช่องโหว่ IDOR หรือ Data Leakage ระหว่างผู้ใช้ 100%
- [x] สกัดคำขอต่างผู้ใช้อย่างรวดเร็วด้วย HTTP Status 403 Forbidden / 404 Not Found
- [x] รหัสผ่านในฐานข้อมูลถูก Hash ด้วย `bcryptjs` 100% ไม่มี Plaintext
- [x] ใช้ Parameterized Queries ป้องกัน SQL Injection ทุกจุด
- [x] การทดสอบความปลอดภัยผ่านเกณฑ์ร้อยละ 100
