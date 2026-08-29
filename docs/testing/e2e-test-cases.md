# เอกสารรายงานการทดสอบระบบแบบรวมศูนย์ (End-to-End Integration Test Report)

**ชื่อโปรเจกต์:** Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)  
**เวอร์ชันเอกสาร:** 1.0.0  
**ระยะการพัฒนา:** Phase 19 - End-to-End Integration Testing  
**ผู้ทดสอบ:** Senior QA Engineer & Lead Full-stack Developer  
**วันที่ทดสอบ:** 29 สิงหาคม 2026  

---

## 1. ภาพรวมการทดสอบ (Executive Summary)
เอกสารฉบับนี้สรุปผลการทดสอบการทำงานของระบบแบบรวมศูนย์ตั้งแต่ต้นจนจบ (**End-to-End Integration Flow**) โดยครอบคลุมพฤติกรรมของผู้ใช้งานจริงตั้งแต่การสมัครสมาชิก เข้าสู่ระบบ บันทึกและจัดการรายการการเงิน (รายรับ-รายจ่าย) การกรองประวัติข้อมูล และการตรวจสอบความถูกต้องของการคำนวณตัวชี้วัดทางการเงินบนหน้า Dashboard และ Reports

---

## 2. สรุปผลการทดสอบรายกรณี (Test Scenario Summary)

| Scenario ID | User Flow Description | Target Module / Page | Test Result | Remarks |
| :---: | :--- | :--- | :---: | :--- |
| **E2E-001** | การสมัครสมาชิกผู้ใช้ใหม่ (User Registration) | `/register` | ✅ PASS | ลงทะเบียนสำเร็จ, สร้าง User ID, บันทึก Audit Log |
| **E2E-002** | การเข้าสู่ระบบและการจัดการ Session (Login & Session) | `/login` | ✅ PASS | ได้รับ JWT Access Token & HTTP-Only Refresh Cookie |
| **E2E-003** | การบันทึกรายการรายรับใหม่ (Add Income Transaction) | `/transactions/new` | ✅ PASS | บันทึกรายรับสำเร็จ, ยอดเงินคำนวณถูกต้อง |
| **E2E-004** | การบันทึกรายการรายจ่ายใหม่ (Add Expense Transaction) | `/transactions/new` | ✅ PASS | บันทึกรายจ่ายสำเร็จ, หมวดหมู่ผูกถูกต้อง |
| **E2E-005** | การแก้ไขรายการการเงิน (Edit Transaction) | `/transactions/:id/edit` | ✅ PASS | อัปเดตข้อมูลสำเร็จ, ปรับปรุงยอดย้อนหลัง |
| **E2E-006** | การลบรายการการเงิน (Delete Transaction) | `/transactions` | ✅ PASS | แสดง Delete Confirmation Dialog และลบข้อมูลสำเร็จ |
| **E2E-007** | การค้นหาและกรองประวัติรายการ (Filter History & Search) | `/transactions` | ✅ PASS | กรองตามประเภท, หมวดหมู่, ช่วงวันที่ และค้นหาคำสำเร็จ |
| **E2E-008** | การคำนวณสถิติบน Dashboard & Reports (Recalculation) | `/dashboard`, `/reports` | ✅ PASS | Net Balance, Income, Expense, Savings Rate %, กราฟถูกต้อง 100% |

---

## 3. รายละเอียดการทดสอบทั้ง 8 Core User Flows

### Flow 1: การสมัครสมาชิกผู้ใช้ใหม่ (User Registration)
* **Objective:** ตรวจสอบความถูกต้องของการลงทะเบียนผู้ใช้ใหม่และการบันทึกข้อมูลรหัสผ่านแบบ Hashed
* **Test Steps:**
  1. เข้าสู่หน้า `/register`
  2. กรอกข้อมูล: Email: `tester19@example.com`, Password: `Password123!`, Display Name: `Integration Tester`
  3. กดปุ่ม "สมัครสมาชิก"
* **Expected Result:** API ตอบกลับ HTTP status `201 Created`, เพิ่มเรคคอร์ดในตาราง `users` โดยรหัสผ่านผ่านการ Hash ด้วย `bcryptjs`, บันทึก Audit Log Action `REGISTER`
* **Actual Result:** **PASS** (`201 Created`, User ID เพิ่มขึ้นถูกต้อง)

### Flow 2: การเข้าสู่ระบบและการจัดการ Session (Login & Session)
* **Objective:** ตรวจสอบกระบวนการยืนยันตัวตนและการตั้งค่า HTTP-Only Cookie
* **Test Steps:**
  1. เข้าสู่หน้า `/login`
  2. กรอกข้อมูล Credentials จาก Flow 1
  3. กดปุ่ม "เข้าสู่ระบบ"
* **Expected Result:** API ตอบกลับ HTTP status `200 OK`, ส่งมอบ Access Token ใน JSON Body และตั้งค่า `refreshToken` ใน HTTP-Only Cookie, ระบบนำทางอัตโนมัติไปยังหน้า `/dashboard`
* **Actual Result:** **PASS** (เข้าสู่ระบบสำเร็จ, Cookie แนบมาตามสเปก)

### Flow 3: การบันทึกรายการรายรับใหม่ (Add Income Transaction)
* **Objective:** ตรวจสอบฟอร์มสร้างรายการรายรับและการเชื่อมโยงหมวดหมู่
* **Test Steps:**
  1. นำทางไปที่ `/transactions/new`
  2. เลือก Tab "รายรับ (Income)"
  3. กรอกข้อมูล: ชื่อรายการ: `เงินเดือนประจำเดือน`, จำนวนเงิน: `50000`, หมวดหมู่: `เงินเดือน`, วันที่: วันปัจจุบัน
  4. กดปุ่ม "บันทึกรายการ"
* **Expected Result:** API `POST /api/v1/transactions` คืนค่า HTTP `201 Created`, นำทางกลับไปยัง `/transactions`
* **Actual Result:** **PASS** (รายการรายรับบันทึกสำเร็จ)

### Flow 4: การบันทึกรายการรายจ่ายใหม่ (Add Expense Transaction)
* **Objective:** ตรวจสอบฟอร์มสร้างรายการรายจ่ายและการล้างหมวดหมู่อัตโนมัติเมื่อสลับประเภท
* **Test Steps:**
  1. นำทางไปที่ `/transactions/new`
  2. เลือก Tab "รายจ่าย (Expense)"
  3. กรอกข้อมูล: ชื่อรายการ: `ค่าอาหารและทานเลี้ยง`, จำนวนเงิน: `2500`, หมวดหมู่: `อาหารและเครื่องดื่ม`
  4. กดปุ่ม "บันทึกรายการ"
* **Expected Result:** API `POST /api/v1/transactions` คืนค่า HTTP `201 Created`, เพิ่มเรคคอร์ดประเภท `expense`
* **Actual Result:** **PASS** (รายการรายจ่ายบันทึกสำเร็จ)

### Flow 5: การแก้ไขรายการการเงิน (Edit Transaction)
* **Objective:** ตรวจสอบการโหลดข้อมูลเดิมขึ้นฟอร์มและการอัปเดตข้อมูล
* **Test Steps:**
  1. ที่หน้า `/transactions` กดปุ่ม "แก้ไข" บนรายการ `ค่าอาหารและทานเลี้ยง`
  2. ระบบนำทางไปยัง `/transactions/:id/edit` และดึงข้อมูลเดิมขึ้นฟอร์ม
  3. ปรับเปลี่ยนจำนวนเงินจาก `2500` เป็น `3000`
  4. กดปุ่ม "บันทึกการเปลี่ยนแปลง"
* **Expected Result:** API `PUT /api/v1/transactions/:id` คืนค่า HTTP `200 OK`, อัปเดตยอดเงินในฐานข้อมูลเป็น `3000`
* **Actual Result:** **PASS** (อัปเดตรายการเรียบร้อย)

### Flow 6: การลบรายการการเงิน (Delete Transaction)
* **Objective:** ตรวจสอบระบบยืนยันความปลอดภัยก่อนลบรายการ (Delete Confirmation Dialog)
* **Test Steps:**
  1. เพิ่มรายการทดสอบรายจ่าย `ทดสอบลบ` จำนวนเงิน `500`
  2. กดปุ่มไอคอน "ถังขยะ (ลบ)" บนรายการนั้น
  3. ระบบแสดง Dialog ยืนยัน "คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?"
  4. กดปุ่ม "ยืนยันการลบ"
* **Expected Result:** API `DELETE /api/v1/transactions/:id` คืนค่า HTTP `200 OK`, ลบรายการออกจากตารางประวัติทันที
* **Actual Result:** **PASS** (รายการถูกลบสำเร็จ)

### Flow 7: การค้นหาและกรองประวัติรายการ (Filter History & Search)
* **Objective:** ตรวจสอบความถูกต้องของระบบกรองและค้นหาข้อมูลหลายเงื่อนไข
* **Test Steps:**
  1. ที่หน้า `/transactions` เลือกตัวกรองประเภทเป็น "รายจ่าย" -> ตารางแสดงเฉพาะรายจ่าย
  2. กรอกช่องค้นหาด้วยคำว่า `เงินเดือน` -> ตารางรีเฟรชแสดงเฉพาะรายการเงินเดือน
  3. สลับตัวกรองหมวดหมู่เป็น `อาหารและเครื่องดื่ม` -> ตารางแสดงรายการตรงหมวดหมู่
* **Expected Result:** API ตอบกลับรายการตรงตาม Query String parameters (`type`, `category_id`, `search`)
* **Actual Result:** **PASS** (ระบบกรองข้อมูลทำงานถูกต้องตามสเปก)

### Flow 8: การคำนวณสถิติบน Dashboard & Reports (Recalculation)
* **Objective:** ตรวจสอบว่ายอดการ์ด KPI, Donut Chart และ Bar Chart คำนวณใหม่ตรงกับรายการบันทึกจริง
* **Test Steps:**
  1. นำทางไปที่ `/dashboard`
  2. ตรวจสอบการ์ดตัวชี้วัด:
     - **Total Income:** `50,000.00 ฿`
     - **Total Expense:** `3,000.00 ฿`
     - **Net Balance:** `+47,000.00 ฿`
     - **Savings Rate (%):** `94.0%` (`(50000-3000)/50000 * 100`)
  3. ตรวจสอบกราฟโดนัท (Donut Chart) แสดงสัดส่วนรายจ่ายหมวดหมู่อาหารและเครื่องดื่ม 100%
  4. นำทางไปที่ `/reports` สลับตัวเลือกเดือน -> ตารางสัดส่วนแสดงค่าสอดคล้องกัน
* **Expected Result:** การคำนวณตัวเลขและสัดส่วนตรงตามสูตรในเอกสาร `08-dashboard-report-notification.md` 100%
* **Actual Result:** **PASS** (ตัวเลขและสัดส่วนตรงกันเป๊ะ 100%)

---

## 4. Verification Checklist & Definition of Done

- [x] ทดสอบครบทั้ง 8 Core User Flows
- [x] ข้อมูลบน Dashboard คำนวณใหม่ตรงกับฐานข้อมูลจริงทุกครั้งที่มีการเพิ่ม/แก้ไข/ลบรายการ
- [x] ไม่พบปัญหา Data Leakage หรือการสลับข้อมูลระหว่าง Session
- [x] การทดสอบระบบ E2E ทั้งหมดเสร็จสิ้นและผ่านเกณฑ์ยอมรับ (Acceptance Criteria) 100%
