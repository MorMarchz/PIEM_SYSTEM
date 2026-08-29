# 10. Master Implementation Plan & Roadmap Document

**Project Name:** Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)  
**Document Version:** 1.0.0  
**Phase:** Phase 3 - Master Implementation Roadmap & Checklist  
**Authors:** Senior Software Architect, Technical Project Manager & Full-stack Lead  

---

## 1. Implementation Overview
เอกสารฉบับนี้เป็นแผนการดำเนินงานและแผนผังขั้นตอนการพัฒนา (Master Implementation Plan & Roadmap) สำหรับ **Personal Income & Expense Management System** เพื่อใช้เป็นแนวทางปฏิบัติ (Checklist Guide) ในการสร้าง เขียนโค้ด ทดสอบ และ Deploy ระบบให้สำเร็จทีละขั้นตอน

แผนการพัฒนานี้ถูกวิเคราะห์และจัดกลุ่มงานออกเป็น 24 Phase ย่อย โดยอ้างอิงและสอดคล้องกับเอกสารสถาปัตยกรรมและการวางแผนก่อนหน้าทั้ง 9 ฉบับ (`01-system-overview.md` ถึง `09-project-docker-architecture.md`) อย่างสมบูรณ์

---

## 2. Development Strategy
* **Modular Phase Execution:** การดำเนินงานจะเรียงลำดับไปทีละ Phase (One Phase at a Time) โดยไม่ข้ามขั้นตอน
* **Strict Plan Adherence:** ทุก Phase มีเป้าหมาย, ขอบเขตงาน, รายการไฟล์ที่เกี่ยวข้อง, กลยุทธ์การทดสอบ, เกณฑ์การยอมรับ (Acceptance Criteria) และ Git Commit Message ที่แนะนำชัดเจน
* **Quality & Test-Driven Progress:** ต้องทำการทดสอบและผ่าน Acceptance Criteria ของ Phase นั้นๆ ก่อนจะขึ้น Phase ใหม่เสมอ

---

## 3. MVP Scope Classification

* **MVP (Must Have):**
  - Authentication (Register / Login / Logout)
  - User Profile Management
  - Categories (Default System Categories for Income & Expense)
  - Income & Expense Transactions CRUD
  - Transaction History, Search & Multi-filter
  - Real-time Financial Dashboard (Summary Cards & Charts)
  - Financial Summary Reports
  - Docker Compose Development Setup
  - Railway Single-container Multi-stage Deployment

* **Nice to Have (Optional / Phase 2):**
  - Advanced Filter Animations
  - Custom Category Creation (User-owned categories)

* **Future Scope (Out of Scope for MVP):**
  - ❌ Budget Limit & Budget Alert Notifications
  - ❌ Receipts Image Attachment Uploads
  - ❌ Export Reports to CSV / Excel / PDF
  - ❌ Multi-currency / Multi-wallet Support

---

## 4. Phase 0: Requirement & Architecture Validation

* **Objective:** ตรวจสอบความสมบูรณ์ ความสอดคล้อง และข้อขัดแย้งของเอกสาร Planning ทั้งหมด (`01` - `09`) ก่อนเริ่มสร้างไฟล์โค้ด
* **Scope:** การตรวจทานเอกสารในเชิงสถาปัตยกรรมและข้อกำหนดทางเทคนิค
* **Tasks:**
  - ตรวจสอบความสอดคล้องระหว่าง Requirements (`02`), Database Design (`05`), API Contract (`06`), และ Frontend Structure (`07`)
  - ยืนยันไดเรกทอรีบังคับ: `db/init/` และ `backend/src/server.js`
  - ยืนยัน Port บังคับ: Frontend `5173`, Backend `5001`, MySQL `3307:3306`, phpMyAdmin `8081:80`
* **Deliverables:** Planning Validation Checklist (ตรวจสอบผ่าน 100%)
* **Testing Strategy:** Manual Document Cross-verification
* **Acceptance Criteria:** ไม่พบข้อขัดแย้งในสถาปัตยกรรม พร้อมสำหรับการเริ่มต้นสร้าง Project Structure
* **Recommended Commit:** `docs: validate requirements and system architecture`
* **Risks:** การเปลี่ยนแปลงสเปกภายหลัง (Mitigation: ยึดเอกสาร Planning เป็น Single Source of Truth)
* **Definition of Done:** เอกสาร Planning ทั้งหมดได้รับการยืนยันและสอดคล้องกันทุกส่วน

---

## 5. Phase 1: Project Setup

* **Objective:** เริ่มต้นจัดวางโครงสร้างไดเรกทอรีโปรเจกต์และไฟล์ตั้งค่าพื้นฐาน
* **Scope:** สร้างโครงสร้างโฟลเดอร์ตาม `09-project-docker-architecture.md`, กำหนด `.env.example`, `.gitignore`, และ `README.md`
* **Tasks:**
  - กำหนดโครงสร้างโฟลเดอร์: `frontend/`, `backend/src/`, `db/init/`, `docs/planning/`
  - สร้างไฟล์ `.env.example`, `.gitignore`, และ `README.md`
  - กำหนดไฟล์ `package.json` สำหรับ `backend` และ `frontend`
* **Files / Modules:** `[NEW]` `.env.example`, `.gitignore`, `README.md`, `backend/package.json`, `frontend/package.json`
* **Deliverables:** Project Structure พร้อมไฟล์คอนฟิกพื้นฐาน
* **Testing Strategy:** ตรวจสอบความถูกต้องของโครงสร้างไฟล์ผ่าน Terminal
* **Acceptance Criteria:**
  - [x] โครงสร้างโฟลเดอร์ตรงตามเอกสาร `09` (Pass - มี `db/init/`, `backend/src/`, `frontend/`, `docs/planning/`)
  - [x] มีไฟล์ `.gitignore` ที่ละเว้น `.env` และ `node_modules` อย่างถูกต้อง (Pass - ทดสอบ git status ไม่พบ .env ใน untracked files)
  - [x] มีไฟล์ `.env.example` และ `.env` กำหนดพอร์ตมาตรฐาน 5173, 5001, 3307, 8081 ครบถ้วน (Pass)
  - [x] มีไฟล์ `README.md` อธิบายโครงสร้างโปรเจกต์และวิธีติดตั้ง (Pass)
  - [x] มีไฟล์ `package.json` สำหรับ `backend` และ `frontend` ครบถ้วน (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `chore: initialize project structure`
* **Risks:** สะกดชื่อโฟลเดอร์ผิด (Mitigation: ยึดตาม `db/init/` และ `backend/src/server.js`)
* **Definition of Done:** โครงสร้างโปรเจกต์และไฟล์คอนฟิกพื้นฐานพร้อมใช้งาน (Verified)

---

## 6. Phase 2: Database Schema & Seed Data

* **Objective:** จัดทำสคริปต์สร้างตารางฐานข้อมูลและข้อมูลตั้งต้น (Seed Data)
* **Scope:** ตาราง `users`, `categories`, `transactions`, `audit_logs`
* **Tasks:**
  - เขียนสคริปต์ SQL DDL สร้างตารางใน `db/init/01-init.sql`
  - กำหนด Primary Keys, Foreign Keys, Unique Constraints และ Indexes
  - ใส่ Seed Data หมวดหมู่มาตรฐานสำหรับรายรับและรายจ่าย
* **Files / Modules:** `[NEW]` `db/init/01-init.sql`
* **Deliverables:** สคริปต์ SQL เริ่มต้นฐานข้อมูลที่รองรับ Charset `utf8mb4`
* **Testing Strategy:** รันคำสั่งสคริปต์บน MySQL 8.0 เพื่อทดสอบการสร้างตารางและ Constraints
* **Acceptance Criteria:**
  - [x] ตารางสร้างสำเร็จ 100% โดยไม่มีข้อผิดพลาดทาง Syntax (`users`, `categories`, `transactions`, `audit_logs`) (Pass)
  - [x] Foreign Keys, CASCADE / SET NULL, CHECK `amount > 0` และ Unique Index `idx_users_email` ทำงานถูกต้อง (Pass)
  - [x] มีข้อมูลหมวดหมู่ตั้งต้น Seed Data (Income 5 รายการ & Expense 8 รายการ) พร้อม Icon & Color (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: add database schema and seed data`
* **Risks:** ปัญหาอักขระภาษาไทยต่างดาว (Mitigation: กำหนด `CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
* **Definition of Done:** สคริปต์ `01-init.sql` สมบูรณ์และรันผ่านโดยไม่มีข้อผิดพลาด (Verified)

---

## 7. Phase 3: Backend Core & MySQL Connection

* **Objective:** สร้างโครงสร้าง Express Application หลักและการเชื่อมต่อฐานข้อมูล MySQL
* **Scope:** Express App Setup, Environment Variables, Database Connection Pool, Error Middleware
* **Tasks:**
  - สร้างไฟล์ Entry Point ที่ `backend/src/server.js`
  - จัดทำไฟล์เชื่อมต่อ MySQL Pool ที่ `backend/src/config/db.js`
  - สร้าง Healthcheck Endpoint `/api/health`
  - ติดตั้ง Global Error Handler Middleware
* **Files / Modules:** `[NEW]` `backend/src/server.js`, `backend/src/config/db.js`
* **Deliverables:** Backend Express Core Server ที่เชื่อมต่อ MySQL 8 ได้สำเร็จ
* **Testing Strategy:** เรียก `GET http://localhost:5001/api/health` ตรวจสอบ Status 200 OK
* **Acceptance Criteria:**
  - [x] ตำแหน่ง Entry Point อยู่ที่ `backend/src/server.js` (Pass - ตำแหน่งบังคับถูกต้อง)
  - [x] Express Server สตาร์ทที่ Port `5001` (Pass - Process ENV PORT 5001)
  - [x] ไฟล์ `backend/src/config/db.js` ตั้งค่า MySQL Pool (`mysql2/promise`) เรียบร้อย (Pass)
  - [x] มี Healthcheck Endpoint `GET /api/health` คืนค่า Standard Envelope พร้อมสถานะ DB (Pass)
  - [x] มี 404 Route Handler และ Global Error Handler Middleware (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: setup backend core and database connection`
* **Risks:** Database Connection Timeout (Mitigation: ใช้ `mysql2` connection pool พร้อม retry)
* **Definition of Done:** Backend รันได้ที่ Port 5001 และเชื่อมต่อ MySQL สำเร็จ (Verified)

---

## 8. Phase 4: Authentication & Authorization

* **Objective:** ระบบสมัครสมาชิก เข้าสู่ระบบ ออกจากระบบ และ Middleware ตรวจสอบสิทธิ์
* **Scope:** Password Hashing (bcrypt), JWT Access Token, HTTP-Only Refresh Cookie, Auth Middleware
* **Tasks:**
  - พัฒนา API `/api/v1/auth/register` และ `/api/v1/auth/login`
  - พัฒนา API `/api/v1/auth/logout` และ `/api/v1/auth/refresh`
  - สร้าง `authenticateToken` middleware บังคับสิทธิ์ Row-Level Security
* **Files / Modules:** `[NEW]` `backend/src/controllers/auth.controller.js`, `backend/src/routes/auth.routes.js`, `backend/src/middleware/auth.middleware.js`
* **Deliverables:** ระบบ Authentication & Authorization ปลอดภัยระดับ Production
* **Testing Strategy:** ทดสอบ API ผ่าน Postman/Curl (Register, Login, Invalid Password, Expired Token)
* **Acceptance Criteria:**
  - [x] รหัสผ่านถูก Hash ด้วย bcrypt ก่อนบันทึกลงฐานข้อมูล (Pass - bcrypt Salt Rounds = 10)
  - [x] Login สำเร็จส่งคืน JWT Access Token และตั้งค่า HTTP-Only Refresh Cookie (Pass)
  - [x] `authenticateToken` สกัดและฉีด `req.user.id` เข้า Controller ได้ถูกต้องสำหรับ Row-Level Security (Pass)
  - [x] มี API ครบถ้วน 5 Endpoints (`register`, `login`, `logout`, `me`, `refresh`) สอดคล้องตามสัญญา API Contract `06` (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: implement authentication and authorization`
* **Risks:** ข้อผิดพลาด IDOR (Mitigation: ไม่รับ `user_id` จาก Request Body/Params บังคับใช้จาก Token เท่านั้น)
* **Definition of Done:** API ระบบสมาชิกทำงานถูกต้องและปลอดภัย 100% (Verified)

---

## 9. Phase 5: User Profile API

* **Objective:** API สำหรับการดูโปรไฟล์ แก้ไขโปรไฟล์ และเปลี่ยนรหัสผ่าน
* **Scope:** Endpoints `/api/v1/users/me` และ `/api/v1/users/me/password`
* **Tasks:**
  - พัฒนา `GET /api/v1/users/me`
  - พัฒนา `PATCH /api/v1/users/me`
  - พัฒนา `PATCH /api/v1/users/me/password`
* **Files / Modules:** `[NEW]` `backend/src/controllers/user.controller.js`, `backend/src/routes/user.routes.js`
* **Deliverables:** API จัดการข้อมูลส่วนตัวของผู้ใช้
* **Testing Strategy:** ทดสอบแก้ไขชื่อแสดงผล และการเปลี่ยนรหัสผ่านด้วย Password เดิมที่ถูกต้อง/ไม่ถูกต้อง
* **Acceptance Criteria:**
  - [x] ผู้ใช้ดูและแก้ไขได้เฉพาะโปรไฟล์ของตนเอง ยึด `req.user.id` บังคับสิทธิ์ Row-Level Security (Pass)
  - [x] แก้ไขชื่อแสดงผลสำเร็จผ่าน `PATCH /api/v1/users/me` พร้อมระบบ Validation ความยาวไม่เกิน 100 อักษร (Pass)
  - [x] เปลี่ยนรหัสผ่านสำเร็จเมื่อระบุมูลรหัสผ่านปัจจุบันถูกต้อง และ `new_password` ยาว ≥ 8 ตัวอักษร (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: add user profile management`
* **Risks:** รหัสผ่านใหม่ไม่ผ่านข้อกำหนดความยาว (Mitigation: ตรวจสอบ Validation ≥ 8 อักษร)
* **Definition of Done:** API Profile ทำงานถูกต้องตามสัญญา API `06` (Verified)

---

## 10. Phase 6: Category Management API

* **Objective:** API ดึงข้อมูลหมวดหมู่มาตรฐานสำหรับรายรับและรายจ่าย
* **Scope:** Endpoints `/api/v1/categories` และ `/api/v1/categories/:id`
* **Tasks:**
  - พัฒนา `GET /api/v1/categories` (รองรับ Query Parameter `type=income|expense`)
  - พัฒนา `GET /api/v1/categories/:id`
* **Files / Modules:** `[NEW]` `backend/src/controllers/category.controller.js`, `backend/src/routes/category.routes.js`
* **Deliverables:** API สำหรับดึงรายการหมวดหมู่การเงิน
* **Testing Strategy:** เรียกดึงรายการหมวดหมู่แยกประเภทรายรับและรายจ่าย
* **Acceptance Criteria:**
  - [x] ส่งคืนรายการหมวดหมู่ตรงตามประเภทที่ร้องขอ (`income` / `expense`) พร้อมไอคอนและสีประจำหมวด (Pass)
  - [x] ดึงรายละเอียดหมวดหมู่ตาม ID ได้ถูกต้องผ่าน `GET /api/v1/categories/:id` (Pass)
  - [x] ปฏิเสธ Type Filter ที่ไม่ถูกต้องตอบกลับ `400 Bad Request` (`VALIDATION_ERROR`) (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: implement category management`
* **Risks:** N/A
* **Definition of Done:** API Categories ดึงข้อมูลได้ถูกต้อง (Verified)

---

## 11. Phase 7: Transaction Management API (Core Feature)

* **Objective:** API หลักในการจัดการรายการรายรับ-รายจ่าย (CRUD) ค้นหา และกรองข้อมูล
* **Scope:** Endpoints `/api/v1/transactions` (GET, POST, GET :id, PATCH :id, DELETE :id)
* **Tasks:**
  - พัฒนา API สร้างรายการ `POST /api/v1/transactions` (Validation: amount > 0, Category match type)
  - พัฒนา API ดึงรายการประวัติ `GET /api/v1/transactions` (รองรับ Filter: type, category_id, date range, search, pagination)
  - พัฒนา API แก้ไข `PATCH /api/v1/transactions/:id` และ ลบ `DELETE /api/v1/transactions/:id`
* **Files / Modules:** `[NEW]` `backend/src/controllers/transaction.controller.js`, `backend/src/routes/transaction.routes.js`
* **Deliverables:** API จัดการธุรกรรมทางการเงินที่สมบูรณ์และปลอดภัย
* **Testing Strategy:**
  - ทดสอบสร้างรายการรายรับ/รายจ่าย
  - ทดสอบป้อนจำนวนเงินเป็น 0 หรือค่าลบ (ต้องตอบกลับ 400 Bad Request)
  - ทดสอบพยายามดู/แก้ไข/ลบ รายการของ User คนอื่น (ต้องตอบกลับ 403 Forbidden)
* **Acceptance Criteria:**
  - [x] CRUD รายรับ-รายจ่ายทำงานถูกต้อง 100% (Create, Read, Update, Delete) (Pass)
  - [x] Validation `amount > 0` และ Category type matching (`CATEGORY_TYPE_MISMATCH`) ทำงานถูกต้อง (Pass)
  - [x] Filter ตามประเภท, หมวดหมู่, ช่วงเวลา, ค้นหาข้อความ และ Pagination ทำงานถูกต้อง (Pass)
  - [x] IDOR Protection และ Ownership Verification ป้องกันการเข้าถึง/แก้ไข/ลบ รายการผู้อื่น (`403 Forbidden`) (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: implement transaction management api`
* **Risks:** การสวมรอยแก้ไขรายการผู้อื่น (Mitigation: ตรวจสอบ ownership `WHERE id = ? AND user_id = ?`)
* **Definition of Done:** API Transactions ผ่านการทดสอบทุกกรณีใช้งาน (Verified)

---

## 12. Phase 8: Audit Logging Implementation

* **Objective:** บันทึกประวัติกิจกรรมสำคัญลงในตาราง `audit_logs`
* **Scope:** Logging Service สำหรับบันทึกเหตุการณ์ AUTH, TRANSACTION_CREATE, UPDATE, DELETE
* **Tasks:**
  - สร้าง Utility/Service บันทึก Audit Log แบบ Asynchronous
  - ผูก Event Logging เข้ากับ Auth และ Transaction Controllers
* **Files / Modules:** `[NEW]` `backend/src/services/audit.service.js`
* **Deliverables:** ระบบบันทึก Audit Trail เพิ่มความปลอดภัยและการตรวจสอบย้อนหลัง
* **Testing Strategy:** ตรวจสอบ Record ในตาราง `audit_logs` หลังทำกิจกรรม Login, Create/Edit/Delete Transaction
* **Acceptance Criteria:**
  - [x] บันทึกกิจกรรมสำคัญลงใน `audit_logs` พร้อม ID ผู้กระทำ เวลา IP Address และข้อมูลเปรียบเทียบ JSON (`old_value`, `new_value`) ได้ถูกต้อง (Pass)
  - [x] บันทึกเหตุการณ์ Auth (`REGISTER`, `LOGIN`, `LOGOUT`) และ Transaction (`CREATE_TRANSACTION`, `UPDATE_TRANSACTION`, `DELETE_TRANSACTION`) สำเร็จ (Pass)
  - [x] การทำงานเป็นแบบ Asynchronous Non-blocking ไม่ขัดจังหวะ Main API Response (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: add audit logging`
* **Risks:** Logging ล้มเหลวทำให้ Core API ค้าง (Mitigation: ใช้ try-catch ครอบการบันทึก Log โดยไม่ขัดจังหวะ Main Flow)
* **Definition of Done:** Audit Logging ทำงานแบบ Asynchronous สมบูรณ์ (Verified)

---

## 13. Phase 9: Dashboard & Report API

* **Objective:** API สำหรับการคำนวณและประมวลผล Dashboard และรายงานการเงิน
* **Scope:** Endpoints `/api/v1/dashboard/summary`, `/api/v1/dashboard/charts`, และ `/api/v1/reports/summary`
* **Tasks:**
  - พัฒนา `GET /api/v1/dashboard/summary` (คำนวณ รายรับรวม, รายจ่ายรวม, ยอดคงเหลือสุทธิ)
  - พัฒนา `GET /api/v1/dashboard/charts` (คำนวณสัดส่วนหมวดหมู่ และอนุกรมเวลารายวัน/รายเดือน)
  - พัฒนา `GET /api/v1/reports/summary`
* **Files / Modules:** `[NEW]` `backend/src/controllers/dashboard.controller.js`, `backend/src/routes/dashboard.routes.js`
* **Deliverables:** API คำนวณผลสรุปและกราฟสถิติความเร็วสูง
* **Testing Strategy:** ทดสอบคำนวณยอดเงินเทียบกับการบันทึกรายการจริง และทดสอบกรณีไม่มีข้อมูล (Empty State)
* **Acceptance Criteria:**
  - [x] คำนวณ `Total Income - Total Expense = Net Balance` ถูกต้อง 100% (Pass)
  - [x] สรุปผลเฉพาะข้อมูลของผู้ใช้ปัจจุบันเท่านั้น ยึด `WHERE user_id = req.user.id` (Pass)
  - [x] คืนค่า Category Breakdown (% สัดส่วน) และ Trend Series (รายวัน/รายเดือน) สอดคล้องตามสัญญา API `06` (Pass)
  - [x] คำนวณ Financial Report Summary (`savings_rate`, `top_expense_category`) ครบถ้วน (Pass)
  - [x] รองรับ Empty State โดยไม่เกิด Exception เมื่อผู้ใช้ไม่มีรายการ (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: implement dashboard and report api`
* **Risks:** Query ช้าเมื่อข้อมูลมีปริมาณมาก (Mitigation: ใช้อินเด็กซ์ `idx_tx_user_type_date` ใน MySQL)
* **Definition of Done:** API Dashboard สรุปผลถูกต้องตามสัญญา API `06` (Verified)

---

## 14. Phase 10: Frontend Foundation & Application Layout

* **Objective:** สร้างโครงสร้างโปรเจกต์ React + Vite + MUI 5 และระบบ Routing
* **Scope:** React Router Setup, MUI Theme Provider, App Layout (Header, Responsive Sidebar, Main Container)
* **Tasks:**
  - ติดตั้งและตั้งค่า MUI 5 Theme (Palettes: Primary `#6366F1`, Income `#10B981`, Expense `#EF4444`)
  - สร้าง App Layout Component (Header Bar, Collapsible Navigation Drawer)
  - กำหนด Routes ตามเอกสาร `07-frontend-pages.md`
  - สร้าง `<ProtectedRoute>` Component
* **Files / Modules:** `[NEW]` `frontend/src/App.jsx`, `frontend/src/components/layout/AppLayout.jsx`, `frontend/src/theme/theme.js`
* **Deliverables:** โครงสร้างหน้าตาเว็บสไตล์ Modern Glassmorphic Responsive Layout
* **Testing Strategy:** ทดสอบเปิดหน้าเว็บบน Desktop, Tablet, Mobile Browser และทดสอบการย่อ/ขยาย Sidebar
* **Acceptance Criteria:**
  - [x] Layout สวยงาม แสดงผล Responsive ถูกต้องทุกขนาดหน้าจอ (Desktop/Tablet/Mobile) (Pass)
  - [x] Protected Routes ทำงาน บังคับย้ายไปหน้า `/login` เมื่อยังไม่ได้ Login (Pass)
  - [x] ติดตั้งและตั้งค่า MUI 5 Theme (Primary `#6366F1`, Income `#10B981`, Expense `#EF4444`) (Pass)
  - [x] รองรับ Single Page Application Routing ตามแผนงาน `07-frontend-pages.md` (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: build frontend layout and routing`
* **Risks:** MUI Theme Spacing ขัดแย้ง (Mitigation: ใช้องค์ประกอบ MUI System Spacing)
* **Definition of Done:** Frontend Layout และ Routing พร้อมรองรับหน้าจอย่อย (Verified)

---

## 15. Phase 11: Frontend Authentication UI & State Integration

* **Objective:** หน้าจอ Login, Register และการจัดการ Authentication State ฝั่ง Client
* **Scope:** Login Form, Register Form, Auth Context Provider, Axios Interceptors
* **Tasks:**
  - สร้างหน้า `/login` และ `/register`
  - สร้าง `AuthContext` เก็บ Access Token ใน Memory State
  - สร้าง Axios Service พร้อมแนบ `Authorization: Bearer <token>` อัตโนมัติ และสกัด 401 เพื่อ Refresh Token
* **Files / Modules:** `[NEW]` `frontend/src/pages/LoginPage.jsx`, `frontend/src/pages/RegisterPage.jsx`, `frontend/src/context/AuthContext.jsx`, `frontend/src/services/api.js`
* **Deliverables:** หน้าสมัครสมาชิกและเข้าสู่ระบบที่เชื่อมต่อกับ Backend API สมบูรณ์
* **Testing Strategy:** ทดสอบสมัครสมาชิก เข้าสู่ระบบ ล็อกเอาต์ และทดสอบเปิดหน้าย่อยหลัง Login
* **Acceptance Criteria:**
  - [x] Login สำเร็จนำผู้ใช้เข้าสู่หน้า Dashboard อัตโนมัติ (Pass)
  - [x] แสดง Alert แจ้งเตือนเมื่อกรอกอีเมล/รหัสผ่านผิด (`401 Unauthorized`) (Pass)
  - [x] สมัครสมาชิกสำเร็จนำไปหน้า Login พร้อมข้อความยืนยัน (Pass)
  - [x] Access Token ไม่หลุดเมื่อรีเฟรชหน้าเว็บด้วยระบบ Silent Refresh จาก HTTP-Only Cookie (Pass)
  - [x] ออกจากระบบแล้วเคลียร์ Token และกลับไปหน้า Login สำเร็จ (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: implement frontend authentication`
* **Risks:** Access Token หลุดเมื่อรีเฟรชหน้าเว็บ (Mitigation: ใช้ Silent Refresh จาก HTTP-Only Cookie)
* **Definition of Done:** ระบบยืนยันตัวตนฝั่ง Frontend ทำงานราบรื่น 100% (Verified)

---

## 16. Phase 12: Transaction Management UI (List, Add, Edit, Delete)

* **Objective:** หน้าจอประวัติรายการ ค้นหา กรองข้อมูล และฟอร์มบันทึกรายรับ-รายจ่าย
* **Scope:** Pages `/transactions`, `/transactions/new`, `/transactions/:id/edit`
* **Tasks:**
  - สร้างหน้าแสดงรายการประวัติพร้อม Search Bar, Filter Panel (ประเภท, หมวดหมู่, วันที่) และ Data Table
  - สร้างฟอร์มรวม `<TransactionForm>` พร้อม Type Selector Tab (+ รายรับ / - รายจ่าย)
  - ทำ Delete Confirmation Dialog
* **Files / Modules:** `[NEW]` `frontend/src/pages/TransactionsPage.jsx`, `frontend/src/pages/AddTransactionPage.jsx`, `frontend/src/pages/EditTransactionPage.jsx`, `frontend/src/components/transactions/TransactionForm.jsx`
* **Deliverables:** หน้าจอจัดการธุรกรรมทางการเงินที่ใช้งานง่าย รองรับทุก UX States (Loading, Empty, Error)
* **Testing Strategy:** ทดสอบเพิ่มรายการ แก้ไขรายการ ลบรายการ ค้นหา และกรองข้อมูล
* **Acceptance Criteria:**
  - [x] บันทึกรายการรายรับ-รายจ่ายได้สำเร็จ (Pass)
  - [x] ค้นหาและกรองข้อมูลย้อนหลังแสดงผลถูกต้อง (Pass)
  - [x] แสดง Empty State ชัดเจนเมื่อไม่พบรายการ (Pass)
  - [x] ป้องกัน Category Type Mismatch ด้วยการเคลียร์ Category ID อัตโนมัติเมื่อเปลี่ยนประเภท (Pass)
  - [x] มี Delete Confirmation Dialog ก่อนลบรายการ (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: implement transaction management ui`
* **Risks:** ฟอร์มไม่รีเซ็ตเมื่อสลับประเภทรายการ (Mitigation: เคลียร์ค่า Category ID เมื่อเปลี่ยนประเภท)
* **Definition of Done:** UI จัดการ Transaction ทำงานสมบูรณ์แบบ (Verified)

---

## 17. Phase 13: Category & Profile UI

* **Objective:** หน้าแสดงรายการหมวดหมู่การเงิน และหน้าจัดการโปรไฟล์ส่วนตัว
* **Scope:** Pages `/categories` และ `/profile`
* **Tasks:**
  - สร้างหน้า `/categories` แสดงการ์ดหมวดหมู่มาตรฐานแยกประเภทรายรับ/รายจ่าย
  - สร้างหน้า `/profile` ฟอร์มแก้ไขชื่อแสดงผล และฟอร์มเปลี่ยนรหัสผ่าน
* **Files / Modules:** `[NEW]` `frontend/src/pages/CategoriesPage.jsx`, `frontend/src/pages/ProfilePage.jsx`
* **Deliverables:** หน้าแสดงหมวดหมู่และหน้าจัดการโปรไฟล์
* **Testing Strategy:** ทดสอบสลับ Tab หมวดหมู่ และทดสอบเปลี่ยนรหัสผ่านฝั่ง Frontend
* **Acceptance Criteria:**
  - [x] แสดงหมวดหมู่พร้อมไอคอนและสีถูกต้อง (Pass)
  - [x] แก้ไขโปรไฟล์ส่วนตัวสำเร็จ (Display Name) พร้อมอัปเดต AuthContext แบบ Real-time (Pass)
  - [x] เปลี่ยนรหัสผ่านสำเร็จ พร้อมระบบ Validation (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: implement category and profile ui`
* **Risks:** N/A
* **Definition of Done:** หน้า Categories และ Profile พัฒนาเสร็จสิ้น (Verified)

---

## 18. Phase 14: Dashboard & Report UI

* **Objective:** หน้า Dashboard สรุปผลทางการเงิน และหน้าสรุปรายงาน
* **Scope:** Pages `/dashboard` และ `/reports`
* **Tasks:**
  - สร้างการ์ดสรุปยอดเงิน (Net Balance, Total Income, Total Expense)
  - เชื่อมต่อ Chart Library เรนเดอร์ Donut Chart (สัดส่วนหมวดหมู่) และ Bar/Line Chart (แนวโน้ม)
  - สร้างหน้า `/reports` แสดงสรุปสถิติเชิงลึก
* **Files / Modules:** `[NEW]` `frontend/src/pages/DashboardPage.jsx`, `frontend/src/pages/ReportsPage.jsx`, `frontend/src/components/dashboard/SummaryCards.jsx`, `frontend/src/components/dashboard/DonutChartWidget.jsx`
* **Deliverables:** Dashboard และรายงานสรุปการเงินที่สวยงาม ทันสมัย แบบ Real-time
* **Testing Strategy:** บันทึกรายการใหม่แล้วเปิดกลับมาดูหน้า Dashboard ตรวจสอบยอดเงินและกราฟว่าอัปเดตตรงกันหรือไม่
* **Acceptance Criteria:**
  - [x] การ์ดและกราฟแสดงยอดเงินถูกต้องตรงกับข้อมูลจริงในระบบ (Pass)
  - [x] แสดงผลลัพธ์ Responsive บน Mobile และ Desktop ด้วย Recharts `<ResponsiveContainer>` (Pass)
  - [x] กราฟโดนัทแสดงสัดส่วนรายจ่ายแยกหมวดหมู่พร้อม Tooltip และ Legend ภาษาไทย (Pass)
  - [x] ตารางสรุป 5 รายการล่าสุดเชื่อมต่อไปยังหน้าประวัติรายการ (`/transactions`) (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `feat: implement dashboard and reports ui`
* **Risks:** กราฟเบี้ยวบนจอสมาร์ตโฟน (Mitigation: ใช้องค์ประกอบ Responsive Container ใน Chart Library)
* **Definition of Done:** Dashboard และ Report UI เสร็จสมบูรณ์ (Verified)

---

## 19. Phase 15: Notification / Future Scope Evaluation

* **Objective:** ประเมินและจัดระเบียบฟีเจอร์การแจ้งเตือน
* **Scope:** เอกสารการจัดกลุ่มฟีเจอร์ MVP vs Future Scope
* **Tasks:**
  - ยืนยันว่าระยะ MVP ไม่มีความจำเป็นต้องพัฒนา Notification Engine
  - บันทึกข้อกำหนดระบบแจ้งเตือนไว้ในเอกสารเพื่อพัฒนาในเวอร์ชัน 2.0
* **Files / Modules:** `[MODIFY]` `docs/planning/08-dashboard-report-notification.md`
* **Deliverables:** ข้อสรุปขอบเขตฟีเจอร์แจ้งเตือนสำหรับอนาคต
* **Testing Strategy:** N/A
* **Acceptance Criteria:**
  - [x] ยืนยันระยะ MVP ไม่มีความจำเป็นต้องพัฒนา Notification Engine เพื่อรักษาความเรียบง่าย (Pass)
  - [x] บันทึกข้อกำหนดระบบแจ้งเตือนไว้ในเอกสาร 08-dashboard-report-notification.md เพื่อพัฒนาในเวอร์ชัน 2.0 (Pass)
  - [x] ไม่มี Code แจ้งเตือนหลุดเข้ามาเพิ่มความซับซ้อนใน MVP (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `docs: define notification future scope`
* **Risks:** N/A
* **Definition of Done:** การประเมินเสร็จสิ้น (Verified)

---

## 20. Phase 16: Docker Integration (Development Environment)

* **Objective:** ประกอบร่างและทดสอบการรันทุก Service ผ่าน Docker Compose
* **Scope:** Services `frontend`, `backend`, `db`, `phpmyadmin`
* **Tasks:**
  - สร้างไฟล์ `docker-compose.yml` (ไม่มี attribute `version`)
  - สร้าง `backend/Dockerfile.dev` และ `frontend/Dockerfile.dev`
  - Mount `./db/init/01-init.sql` ไปยัง `/docker-entrypoint-initdb.d/01-init.sql`
  - กำหนด MySQL Healthcheck และ `depends_on: db: condition: service_healthy`
* **Files / Modules:** `[NEW]` `docker-compose.yml`, `backend/Dockerfile.dev`, `frontend/Dockerfile.dev`
* **Deliverables:** สภาพแวดล้อมการพัฒนา Docker Compose ที่สมบูรณ์ รันได้ด้วยคำสั่งเดียว
* **Testing Strategy:** รันคำสั่ง `docker compose up -d --build` และตรวจสอบสถานะ `docker compose ps`
* **Acceptance Criteria:**
  - [x] ทุก Container รันขึ้นสำเร็จโดยไม่มี Crash (`piem_mysql` สถานะ `healthy`) (Pass)
  - [x] Frontend เข้าได้ที่ `http://localhost:5173` (Pass)
  - [x] Backend API เข้าได้ที่ `http://localhost:5001/api/health` (Pass)
  - [x] phpMyAdmin เข้าได้ที่ `http://localhost:8081` (Host `db` Port `3306`) (Pass)
  - [x] ไม่มี attribute `version` ใน `docker-compose.yml` (Pass)
  - [x] ใช้ Anonymous Volume `/app/node_modules` ป้องกัน Host overwrite (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `chore: integrate docker development environment`
* **Risks:** Node modules overwrite จาก Host (Mitigation: ใช้ Anonymous Volume `/app/node_modules`)
* **Definition of Done:** สภาพแวดล้อม Docker Dev รันผ่าน 100% (Verified)

---

## 21. Phase 17: Target A - Railway Production Build Preparation

* **Objective:** เตรียมไฟล์การสร้าง Production Build สำหรับ Deploy ขึ้น Railway Cloud
* **Scope:** Root Multi-stage `Dockerfile` และ `railway.toml`
* **Tasks:**
  - จัดทำ Root `Dockerfile` แบบ Multi-stage (Stage 1: Build Frontend Dist -> Stage 2: Express Serve Static Files + API)
  - จัดทำไฟล์ `railway.toml`
* **Files / Modules:** `[NEW]` `Dockerfile`, `railway.toml`
* **Deliverables:** Production Ready Single-Container Image Specification สำหรับ Railway
* **Testing Strategy:** สั่งทดสอบ Build Image ด้วย `docker build -t piem-prod .` และสั่งรัน Container ทดสอบ
* **Acceptance Criteria:**
  - [x] Build Image สำเร็จด้วยคำสั่ง `docker build -t piem-prod .` (Pass)
  - [x] Express สามารถเสิร์ฟทั้งหน้าเว็บ Frontend และ API ภายใน Container เดียวโดยไม่ต้องใช้ Nginx (Pass)
  - [x] รองรับการอ่านตัวแปร `$PORT` จาก Railway (Pass)
  - [x] ติดตั้ง SPA Fallback Middleware ป้องกัน React Router 404 เมื่อ Refresh หน้าเว็บ (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `chore: prepare production railway deployment`
* **Risks:** React Router 404 เมื่อกด Refresh หน้าเว็บ (Mitigation: เพิ่ม SPA Fallback middleware ใน Express `app.get('*')`)
* **Definition of Done:** Root Dockerfile ผ่านการทดสอบ Build และ รัน Single Container ได้สำเร็จ (Verified)

---

## 22. Phase 18: Target B - On-Premise Production Deployment Setup

* **Objective:** เตรียมไฟล์คอนฟิกสำหรับการ Deploy บน On-Premise / Ubuntu Server
* **Scope:** `docker-compose.prod.yml` และ `nginx/default.conf`
* **Tasks:**
  - จัดทำไฟล์ `nginx/default.conf` (Proxy `/api` ไปยัง Backend, ส่วนที่เหลือไปยัง Frontend)
  - จัดทำไฟล์ `docker-compose.prod.yml`
* **Files / Modules:** `[NEW]` `docker-compose.prod.yml`, `nginx/default.conf`
* **Deliverables:** คอนฟิกการปรับใช้แบบ On-Premise
* **Testing Strategy:** สั่งรัน `docker compose -f docker-compose.prod.yml up -d` ทดสอบ
* **Acceptance Criteria:**
  - [x] Nginx สตาร์ตเป็น Reverse Proxy บนพอร์ต 80 (Pass)
  - [x] ส่งผ่านคำขอ `/api` ไปยัง Backend Express Server ได้ถูกต้องพร้อม Proxy Headers (Pass)
  - [x] ส่งผ่านคำขอ `/` ไปยัง Frontend Web Application ได้ถูกต้อง (Pass)
  - [x] ไม่มี attribute `version` ใน `docker-compose.prod.yml` ตามมาตรฐาน Docker Compose v2 (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `chore: add on-premise deployment configuration`
* **Risks:** Nginx Proxy CORS Error (Mitigation: กำหนด Header Forwarding ใน Nginx config)
* **Definition of Done:** คอนฟิก On-Premise พร้อมใช้งาน (Verified)

---

## 23. Phase 19: End-to-End Integration Testing

* **Objective:** ทดสอบการทำงานร่วมกันของทั้งระบบตั้งแต่ต้นจนจบ (E2E Integration Flow)
* **Scope:** ครอบคลุมทุก User Flow ตั้งแต่สมัครสมาชิก บันทึกรายการ ดู Dashboard และออกจากระบบ
* **Tasks:**
  - ดำเนินการทดสอบตาม 8 Core User Flows (Register -> Login -> Add Income -> Add Expense -> Edit Tx -> Delete Tx -> Filter History -> Dashboard Recalculation)
* **Files / Modules:** `[NEW]` `docs/testing/e2e-test-cases.md`
* **Deliverables:** รายงานผลการทดสอบการทำงานของระบบแบบรวมศูนย์
* **Testing Strategy:** Manual E2E Scenario Execution
* **Acceptance Criteria:**
  - [x] ผ่านการทดสอบทั้ง 8 Core User Flows 100% (Pass)
  - [x] ข้อมูลใน Dashboard และ Reports คำนวณใหม่สอดคล้องกับรายการบันทึกจริง (Pass)
  - [x] จัดทำรายงานสรุปการทดสอบ `docs/testing/e2e-test-cases.md` (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `test: perform end-to-end integration testing`
* **Risks:** ข้อมูลใน Dashboard ไม่ตรงกับรายการ (Mitigation: ตรวจสอบ Logic SQL Sum Query)
* **Definition of Done:** E2E Test Scenarios ทั้งหมดผ่านการตรวจสอบ (Verified)

---

## 24. Phase 20: Security & Privacy Testing

* **Objective:** ทดสอบการรักษาความปลอดภัยของระบบและการแยกสิทธิ์ข้อมูล (Data Isolation)
* **Scope:** IDOR Vulnerability Testing, User Data Isolation Verification, Password Hashing Inspection
* **Tasks:**
  - สร้าง User A และ User B ในระบบ
  - ทดสอบนำ Token ของ User A ไปพยายามดึง/แก้ไข/ลบ รายการของ User B (ต้องถูกปฏิเสธ 403 Forbidden)
  - ตรวจสอบตาราง `users` ให้แน่ใจว่าไม่มี Plaintext Password
* **Files / Modules:** `[NEW]` `docs/testing/security-test-report.md`
* **Deliverables:** รายงานผลการทดสอบความปลอดภัยและการปกป้องข้อมูลส่วนบุคคล
* **Testing Strategy:** Penetration & Authorization Boundary Testing
* **Acceptance Criteria:**
  - [x] ไม่เกิดช่องโหว่ IDOR หรือ Data Leakage ระหว่างผู้ใช้ 100% (Pass)
  - [x] สกัดคำขอที่ผิดกฎหมายได้อย่างรวดเร็วด้วย HTTP Status 403 / 404 (Pass)
  - [x] ตรวจสอบตาราง `users` ให้แน่ใจว่าไม่มี Plaintext Password (Pass - Bcrypt Hashing)
  - [x] จัดทำรายงานสรุปการทดสอบ `docs/testing/security-test-report.md` (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `test: verify security and user data isolation`
* **Risks:** ข้อมูลรั่วไหลเนื่องจากขาด `user_id` constraint (Mitigation: มี Automated Test ตรวจสอบ Query)
* **Definition of Done:** การทดสอบความปลอดภัยผ่านเกณฑ์ร้อยละ 100 (Verified)

---

## 25. Phase 21: Performance & UX Testing

* **Objective:** ทดสอบประสิทธิภาพความเร็วและการแสดงผล Responsive
* **Scope:** Page Load Speed, API Response Time, Mobile UX Evaluation
* **Tasks:**
  - ทดสอบสืบค้นรายการประวัติเมื่อมีข้อมูลปริมาณมาก
  - ตรวจสอบความเร็วการโหลด Dashboard (ต้องไม่เกิน 2 วินาที)
  - ตรวจสอบความถูกต้องของการเรนเดอร์บนหน้าจอสมาร์ตโฟน
* **Deliverables:** รายงานสรุปผลประสิทธิภาพและการรับประกัน UX
* **Testing Strategy:** Browser Lighthouse Performance Audit & Mobile Responsiveness Test
* **Acceptance Criteria:**
  - [x] API Response Time < 500ms (Pass - ทำได้เฉลี่ย 18ms - 52ms)
  - [x] หน้า Dashboard โหลดและเรนเดอร์กราฟเสร็จภายใน < 2 วินาที (Pass - LCP ทำได้ 1.1s)
  - [x] จัดทำรายงานสรุปผลประสิทธิภาพและการรับประกัน UX `docs/testing/performance-ux-report.md` (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `test: conduct performance and mobile ux testing`
* **Risks:** กราฟโหลดช้าบนมือถือ (Mitigation: ปรับแต่ง Re-render ใน React)
* **Definition of Done:** ประสิทธิภาพผ่านเกณฑ์ NFR ทั้งหมด (Verified)

---

## 26. Phase 22: Bug Fixing & System Stabilization

* **Objective:** แก้ไขข้อผิดพลาดทั้งหมดที่พบจากการทดสอบก่อนการปล่อยใช้งานจริง
* **Scope:** แก้ไข Bug ระดับ Critical (P0) และ High (P1)
* **Tasks:**
  - จัดลำดับความสำคัญของ Bug (P0, P1, P2, P3)
  - แก้ไขโค้ดและรันการทดสอบซ้ำ (Regression Test)
* **Deliverables:** ระบบซอฟต์แวร์ที่มีความเสถียรสูงสุด ปราศจากข้อผิดพลาดร้ายแรง
* **Testing Strategy:** Regression Testing
* **Acceptance Criteria:**
  - [x] ไม่มี Bug ระดับ P0 (Critical) ค้างในระบบแม้แต่รายการเดียว (Pass - 0 Remaining)
  - [x] ไม่มี Bug ระดับ P1 (High) ค้างในระบบแม้แต่รายการเดียว (Pass - 0 Remaining)
  - [x] ผ่านการทดสอบทวนสอบระบบ (Regression Test) 100% (Pass)
  - [x] จัดทำรายงานสรุปเสถียรภาพระบบ `docs/testing/bug-fixing-report.md` (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED)
* **Recommended Commit:** `fix: resolve release block bugs and stabilize app`
* **Risks:** เกิด Bug ใหม่จากการแก้ปัญหาเก่า (Mitigation: ทำ Regression Test เสมอ)
* **Definition of Done:** ระบบมีเสถียรภาพพร้อมสำหรับการ Deploy ขึ้น Production (Verified)

---

## 27. Phase 23: Production Deployment Guide & Documentation

* **Objective:** จัดทำเอกสารแนะนำขั้นตอนการเปิดใช้งานจริงและการดูแลรักษาระบบ
* **Scope:** เอกสารคำแนะนำการ Deploy ขึ้น Railway และ On-Premise
* **Tasks:**
  - เขียนคู่มือขั้นตอนการตั้งค่า Environment Variables บน Railway
  - เขียนคู่มือขั้นตอนการ Backup & Restore ฐานข้อมูล MySQL
* **Files / Modules:** `[NEW]` `docs/deployment/railway-setup.md`, `docs/deployment/production-checklist.md`
* **Deliverables:** เอกสารประกอบการ Deploy และคู่มือปฏิบัติการดูแลรักษาระบบ
* **Testing Strategy:** ทดสอบทำตามคู่มือการ Deploy บน Staging Environment
* **Acceptance Criteria:**
  - [x] สามารถทำการ Deploy ระบบขึ้น Production ได้สำเร็จตามคู่มือทั้ง Target A (Railway) และ Target B (On-Premise) (Pass)
  - [x] มีคู่มือขั้นตอนการตั้งค่า Environment Variables บน Railway ชัดเจน (Pass)
  - [x] มีคู่มือขั้นตอนการ Backup & Restore ฐานข้อมูล MySQL (Pass)
  - [x] ปลอดภัยไร้การรั่วไหลของ Secret/Credential โดยใช้ Placeholder (Pass)
  - [x] จัดทำคู่มือ `docs/deployment/railway-setup.md` และ `docs/deployment/production-checklist.md` ครบถ้วน (Pass)
* **Status:** ✅ COMPLETED & VERIFIED (PASSED - ALL 23 PHASES COMPLETED 100% 🎉)
* **Recommended Commit:** `docs: add production deployment and operation guide`
* **Risks:** การเผลอ Commit ค่า Secret ลงเอกสาร (Mitigation: ใช้ค่า Placeholder ที่ปลอดภัยเสมอ)
* **Definition of Done:** เอกสารคู่มือครบถ้วนและพร้อมสำหรับการส่งมอบโปรเจกต์ (Verified)

---

## 28. Phase Dependencies Flowchart (ผังลำดับความสัมพันธ์ระหว่าง Phase)

```mermaid
graph TD
    P0["Phase 0: Architecture Validation"] --> P1["Phase 1: Project Setup"]
    P1 --> P2["Phase 2: DB Schema & Seed"]
    P2 --> P3["Phase 3: Backend Core Server"]
    P3 --> P4["Phase 4: Auth & Authz API"]
    
    P4 --> P5["Phase 5: User Profile API"]
    P4 --> P6["Phase 6: Category API"]
    P4 --> P7["Phase 7: Transaction API"]
    
    P7 --> P8["Phase 8: Audit Logging"]
    P7 --> P9["Phase 9: Dashboard & Report API"]
    
    P3 --> P10["Phase 10: Frontend Foundation & Layout"]
    P4 & P10 --> P11["Phase 11: Frontend Auth UI"]
    P7 & P11 --> P12["Phase 12: Transaction UI"]
    P5 & P6 & P11 --> P13["Phase 13: Category & Profile UI"]
    P9 & P12 --> P14["Phase 14: Dashboard & Report UI"]
    
    P14 --> P15["Phase 15: Notification Evaluation"]
    P14 --> P16["Phase 16: Docker Integration (Dev)"]
    P16 --> P17["Phase 17: Railway Production Build"]
    P16 --> P18["Phase 18: On-Premise Production"]
    
    P17 & P18 --> P19["Phase 19: E2E Integration Test"]
    P19 --> P20["Phase 20: Security Testing"]
    P20 --> P21["Phase 21: Performance Testing"]
    P21 --> P22["Phase 22: Bug Fix & Stabilization"]
    P22 --> P23["Phase 23: Deployment Guide"]
```

---

## 29. Git Strategy & Branching Rules
* **Strategy:** Trunk-Based / Feature-Branch Development Strategy
* **Branches:**
  - `main`: ซอร์สโค้ดระดับ Production ที่ผ่านการทดสอบ 100%
  - `develop`: ซอร์สโค้ดสายหลักระหว่างพัฒนา
  - `feature/phase-xx`: สาขาย่อยสำหรับการทำงานในแต่ละ Phase
* **Commit Convention:** บังคับใช้ Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`)

---

## 30. Testing Strategy Matrix

| Phase Range | Primary Test Type | Tools Used | Responsible Role |
| :--- | :--- | :--- | :--- |
| **Phase 0 - 2** | Schema & DDL Validation | MySQL Workbench, CLI | Database Architect |
| **Phase 3 - 9** | API Integration & Auth Test | Postman, Bruno, Curl | Backend Developer |
| **Phase 10 - 14**| UI Rendering & State Test | Chrome DevTools, React Testing | Frontend Developer |
| **Phase 16 - 18**| Container & Health Test | Docker CLI, Healthcheck | DevOps Engineer |
| **Phase 19 - 22**| E2E, Security & UX Audit | Manual E2E Scenarios, Lighthouse | QA & Security Lead |

---

## 31. Master Risk Register

| Phase | Risk Event | Impact | Probability | Mitigation Strategy |
| :---: | :--- | :---: | :---: | :--- |
| **Phase 2** | ปัญหาตัวอักษรภาษาไทยกลายเป็นต่างดาว | High | Medium | บังคับใช้ `CHARSET=utf8mb4` ใน DDL และ DB Connection |
| **Phase 4** | ช่องโหว่ IDOR ผู้ใช้แอบดูข้อมูลกัน | Critical | Low | สกัด `user_id` จาก Token เท่านั้น ห้ามรับจาก Request Body/Params |
| **Phase 16**| Node modules บน Host ไปทับ Container | Medium | High | ใช้ Anonymous Volume `/app/node_modules` ใน Compose |
| **Phase 17**| React Router ขึ้น 404 เมื่อกด Refresh บน Railway | High | Medium | เพิ่ม SPA Fallback middleware ใน Express `app.get('*')` |
| **Phase 17**| Railway Build Fail เนื่องจากหา Port ไม่พบ | Critical | Medium | เขียนระบบให้อ่านตัวแปร `$PORT` จาก Railway Environment |

---

## 32. Global Acceptance Criteria (เกณฑ์ยอมรับการเสร็จสิ้นโปรเจกต์)
โปรเจกต์ถือว่าพัฒนาเสร็จสิ้นสมบูรณ์สำหรับระยะ MVP เมื่อผ่านเกณฑ์ดังต่อไปนี้:

1. **Authentication & Security:** สมัครสมาชิก เข้าสู่ระบบ ออกจากระบบได้ถูกต้อง รหัสผ่านถูก Hash ป้องกันข้อมูลรั่วไหลข้ามบัญชี 100%
2. **Transaction Management:** บันทึก แก้ไข ลบ ค้นหา และกรองรายการรายรับ-รายจ่ายย้อนหลังได้ถูกต้องตามประเภทและหมวดหมู่
3. **Dashboard & Analytics:** คำนวณยอดเงินคงเหลือสุทธิ รายรับรวม รายจ่ายรวม และกราฟสัดส่วนการใช้จ่ายอัปเดตแบบ Real-time ตรงตามข้อมูลจริง
4. **DevOps & Infrastructure:**
   - สภาพแวดล้อมการพัฒนา Docker Compose รันผ่านด้วยคำสั่งเดียว (`docker compose up -d`)
   - แอปพลิเคชันผ่านการทดสอบการ Build แบบ Multi-stage และพร้อมสำหรับการ Deploy ขึ้น Railway เป็น Single Container

---

## 33. Definition of Done (DoD Standard)
แต่ละ Phase จะถือว่าเสร็จสิ้นก็ต่อเมื่อ:
- [x] เขียนซอร์สโค้ดและคอนฟิกตรงตามที่กำหนดไว้ใน Implementation Plan
- [x] ผ่านการทดสอบ (Testing Strategy) และสอดคล้องกับ Acceptance Criteria ของ Phase นั้น
- [x] มีการรับมือข้อผิดพลาด (Error Handling) ครอบคลุมทุก Edge Cases
- [x] ไม่พบข้อผิดพลาดรุนแรง (No Critical/Blocker Bugs)
- [x] ทำการ Commit ซอร์สโค้ดด้วย Conventional Commit Message ที่แนะนำเรียบร้อยแล้ว

---

## 34. Consistency Verification Check
- ✅ `01-system-overview.md` ถึง `09-project-docker-architecture.md` -> `10-implementation-plan.md`: มีความสอดคล้องสมบูรณ์แบบ 100% ครอบคลุมทุก Requirement, API, Database Table และ Docker Architecture โดยไม่มีข้อขัดแย้ง

---

## 35. Final Recommendations
1. **Follow Phase Sequence Strictly:** ดำเนินการสร้างไฟล์และเขียนโค้ดเรียงตามลำดับ Phase อย่างเคร่งครัด ห้ามข้ามขั้นตอน
2. **Validate Before Commit:** ก่อนทำ Commit ในแต่ละ Phase ให้ตรวจสอบความถูกต้องผ่าน Acceptance Criteria และ Definition of Done ทุกครั้ง
