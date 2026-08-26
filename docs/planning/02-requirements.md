# 02. Requirements Specification Document

**Project Name:** Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)  
**Document Version:** 1.0.0  
**Phase:** Phase 1 - Detailed Requirements Analysis  
**Authors:** Senior Business Analyst & Software Project Manager  

---

## 1. System Purpose (วัตถุประสงค์ของระบบ)
ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล จัดทำขึ้นเพื่อเป็นเครื่องมือดิจิทัลสำหรับการบันทึก จัดหมวดหมู่ ค้นหา และวิเคราะห์ข้อมูลทางการเงินส่วนบุคคล ช่วยให้ผู้ใช้งานสามารถติดตามสถานะรายรับ รายจ่าย ยอดเงินคงเหลือสุทธิ และสถิติการใช้จ่ายในชีวิตประจำวันได้อย่างสะดวก รวดเร็ว ถูกต้อง และปลอดภัย

---

## 2. Existing System Problems (ปัญหาของระบบเดิม)
1. **Lack of Tracking & Recall:** ผู้ใช้ไม่สามารถจดจำรายการใช้จ่ายย่อยๆ ในแต่ละวันได้ ส่งผลให้เงินสดหรือยอดในบัญชีลดลงโดยไม่ทราบสาเหตุ
2. **Manual & Unstructured Recording:** การใช้สมุดกระดาษหรือโน้ตทั่วไป ทำให้ข้อมูลไม่เป็นระเบียบ ค้นหาย้อนหลังยาก และไม่สามารถสรุปผลรวมอัตโนมัติได้
3. **Absence of Real-time Financial Overview:** ผู้ใช้ไม่เห็นภาพรวมยอดเงินคงเหลือสุทธิ (รายรับรวม - รายจ่ายรวม) ในแต่ละช่วงเวลา
4. **Unidentified Expense Leakage:** ผู้ใช้ไม่ทราบสัดส่วนค่าใช้จ่ายว่าหมดไปกับหมวดหมู่ใดมากที่สุด ทำให้ไม่สามารถตัดรายจ่ายที่ไม่จำเป็นได้
5. **Inefficient Budget Control:** ขาดสถิติประวัติการเงินย้อนหลังสำหรับนำมาวางแผนงบประมาณและสร้างวินัยทางการเงิน

---

## 3. New System Goals (เป้าหมายของระบบใหม่)
* **Systematic Financial Tracking:** ให้บริการอินเทอร์เฟซที่ใช้งานง่ายสำหรับการบันทึกรายรับ-รายจ่ายอย่างเป็นระบบ
* **Automated Calculation & Real-time Dashboard:** คำนวณและแสดงผลสรุปรายรับรวม รายจ่ายรวม และยอดคงเหลือสุทธิแบบ Real-time
* **Visual Analytics & Category Distribution:** แสดงกราฟแนวโน้มรายรับ-รายจ่ายรายวัน/รายเดือน และสัดส่วนค่าใช้จ่ายตามหมวดหมู่
* **Advanced Search & Filtering:** ค้นหาและกรองข้อมูลย้อนหลังตามประเภท หมวดหมู่ หรือช่วงเวลาที่ต้องการได้อย่างรวดเร็ว

---

## 4. Functional Requirements (ข้อกำหนดเชิงฟังก์ชัน)

### 4.1 Module: Authentication & User Profile Management (AUTH & PROF)

#### `FR-AUTH-001`: User Registration (สมัครสมาชิก)
- **Actor:** Guest (ผู้เยี่ยมชมเว็บ)
- **Input:** อีเมล (Email), รหัสผ่าน (Password), ยืนยันรหัสผ่าน (Confirm Password), ชื่อแสดงผล (Display Name)
- **Process / Business Rule:** 
  1. ระบบตรวจสอบความครบถ้วนของข้อมูล
  2. ระบบตรวจสอบรูปแบบอีเมลว่าถูกต้องตามมาตรฐาน
  3. ระบบตรวจสอบความซ้ำซ้อนของอีเมลในระบบ (ต้องไม่อีเมลซ้ำ)
  4. รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร
  5. ระบบทำการ Hash รหัสผ่านด้วยอัลกอริทึมความปลอดภัย (เช่น bcrypt) ก่อนบันทึก
- **Expected Output:** บัญชีผู้ใช้ถูกสร้างสำเร็จ ระบบแจ้งเตือนสมัครสมาชิกสำเร็จ และนำผู้ใช้ไปยังหน้า Login
- **Validation:** รูปแบบ Email ถูกต้อง, Password ตรงกับ Confirm Password, ความยาว Password ≥ 8 ตัวอักษร
- **Error Handling:** 
  - กรณีอีเมลซ้ำ: แสดงข้อความ "อีเมลนี้ถูกใช้งานในระบบแล้ว"
  - กรณีรหัสผ่านไม่ตรงกัน: แสดงข้อความ "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน"

#### `FR-AUTH-002`: User Login (เข้าสู่ระบบ)
- **Actor:** Guest
- **Input:** อีเมล (Email), รหัสผ่าน (Password)
- **Process / Business Rule:**
  1. ระบบค้นหาบัญชีผู้ใช้จากอีเมล
  2. ระบบเปรียบเทียบรหัสผ่านที่ระบุกับรหัสผ่านที่ Hash ไว้ในระบบ
  3. เมื่อข้อมูลถูกต้อง ระบบสร้าง Session / Access Token เพื่อรักษา trạngสถานะการเข้าสู่ระบบ
- **Expected Output:** เข้าสู่ระบบสำเร็จ ระบบนำผู้ใช้ไปยังหน้า Dashboard
- **Validation:** ตรวจสอบไม่ให้ช่อง Email และ Password เป็นค่าว่าง
- **Error Handling:** กรณีอีเมลหรือรหัสผ่านไม่ถูกต้อง แสดงข้อความ "อีเมลหรือรหัสผ่านไม่ถูกต้อง" (ไม่ระบุเจาะจงเพื่อความปลอดภัย)

#### `FR-AUTH-003`: User Logout (ออกจากระบบ)
- **Actor:** Authenticated User (ผู้ใช้ที่เข้าสู่ระบบแล้ว)
- **Input:** ปุ่มกด "ออกจากระบบ" (Logout Button)
- **Process / Business Rule:** ระบบทำการทำลาย Session / Token ของผู้ใช้ และล้างข้อมูลสิทธิ์ใน Client State
- **Expected Output:** ออกจากระบบสำเร็จ ระบบนำผู้ใช้กลับไปยังหน้า Login/Welcome
- **Validation:** ต้องเป็นผู้ใช้ที่อยู่ในสถานะ Authenticated

#### `FR-PROF-001`: View & Edit Profile (ดูและแก้ไขข้อมูลส่วนตัว)
- **Actor:** Authenticated User
- **Input:** ชื่อแสดงผลใหม่ (Display Name), รหัสผ่านปัจจุบัน (Current Password - กรณีเปลี่ยนรหัสผ่าน), รหัสผ่านใหม่ (New Password)
- **Process / Business Rule:** ผู้ใช้สามารถแก้ไขชื่อแสดงผลและเปลี่ยนรหัสผ่านของตนเองได้ โดยต้องระบุรหัสผ่านปัจจุบันเพื่อยืนยันตัวตน
- **Expected Output:** ข้อมูลโปรไฟล์ถูกอัปเดตสำเร็จ พร้อมแสดงข้อความยืนยัน

---

### 4.2 Module: Income Management (INC)

#### `FR-INC-001`: Add Income Transaction (เพิ่มรายการรายรับ)
- **Actor:** Authenticated User
- **Input:** ชื่อรายการ (Title), จำนวนเงิน (Amount), วันที่ (Date), หมวดหมู่รายรับ (Income Category), หมายเหตุ/รายละเอียด (Note - Optional)
- **Process / Business Rule:**
  1. ระบบผูกรายการรายรับเข้ากับ `user_id` ของผู้ใช้ปัจจุบันเท่านั้น
  2. กำหนดประเภทรายการเป็น `income`
  3. จำนวนเงินต้องเป็นตัวเลขจำนวนจริงและมีค่ามากกว่า 0 (`Amount > 0`)
  4. วันที่ต้องระบุในรูปแบบวันที่ถูกต้อง
- **Expected Output:** รายการรายรับถูกบันทึกสำเร็จ ยอดรวมรายรับและยอดคงเหลือใน Dashboard ถูกคำนวณและอัปเดตใหม่
- **Validation:** ชื่อรายการต้องไม่ว่าง, จำนวนเงิน > 0, ต้องเลือกหมวดหมู่รายรับ, วันที่ถูกต้อง
- **Error Handling:** 
  - ป้อนจำนวนเงิน ≤ 0: แสดงข้อความ "จำนวนเงินต้องมากกว่า 0 บาท"
  - ไม่เลือกหมวดหมู่: แสดงข้อความ "กรุณาเลือกหมวดหมู่รายรับ"

#### `FR-INC-002`: Edit Income Transaction (แก้ไขรายการรายรับ)
- **Actor:** Authenticated User
- **Input:** รหัสรายการ (Transaction ID), ชื่อรายการใหม่, จำนวนเงินใหม่, วันที่ใหม่, หมวดหมู่ใหม่, หมายเหตุใหม่
- **Process / Business Rule:** ตรวจสอบสิทธิ์ว่า `Transaction ID` นั้นเป็นของผู้ใช้ปัจจุบันหรือไม่ ก่อนอนุญาตให้แก้ไข
- **Expected Output:** ข้อมูลรายการรายรับถูกแก้ไขสำเร็จ และคำนวณยอดสรุปใหม่
- **Validation:** ผู้ใช้ต้องเป็นเจ้าของรายการเท่านั้น

#### `FR-INC-003`: Delete Income Transaction (ลบรายการรายรับ)
- **Actor:** Authenticated User
- **Input:** รหัสรายการ (Transaction ID) และการยืนยันการลบ (Confirmation)
- **Process / Business Rule:** ตรวจสอบสิทธิ์เจ้าของรายการ และทำการลบรายการรายรับออกจากระบบ
- **Expected Output:** รายการถูกลบสำเร็จ ยอดสรุปทางการเงินใน Dashboard ถูกคำนวณใหม่

---

### 4.3 Module: Expense Management (EXP)

#### `FR-EXP-001`: Add Expense Transaction (เพิ่มรายการรายจ่าย)
- **Actor:** Authenticated User
- **Input:** ชื่อรายการ (Title), จำนวนเงิน (Amount), วันที่ (Date), หมวดหมู่รายจ่าย (Expense Category), หมายเหตุ/รายละเอียด (Note - Optional)
- **Process / Business Rule:**
  1. ระบบผูกรายการรายจ่ายเข้ากับ `user_id` ของผู้ใช้ปัจจุบันเท่านั้น
  2. กำหนดประเภทรายการเป็น `expense`
  3. จำนวนเงินต้องเป็นตัวเลขจำนวนจริงและมีค่ามากกว่า 0 (`Amount > 0`)
- **Expected Output:** รายการรายจ่ายถูกบันทึกสำเร็จ ยอดรวมรายจ่ายและยอดคงเหลือใน Dashboard ถูกคำนวณและอัปเดตใหม่
- **Validation:** ชื่อรายการต้องไม่ว่าง, จำนวนเงิน > 0, ต้องเลือกหมวดหมู่รายจ่าย, วันที่ถูกต้อง
- **Error Handling:** ป้อนจำนวนเงินเป็นค่าลบหรือศูนย์ แสดงข้อความแจ้งเตือนความผิดพลาด

#### `FR-EXP-002`: Edit Expense Transaction (แก้ไขรายการรายจ่าย)
- **Actor:** Authenticated User
- **Input:** รหัสรายการ (Transaction ID), ข้อมูลอัปเดตรายการรายจ่าย
- **Process / Business Rule:** ตรวจสอบสิทธิ์เจ้าของรายการก่อนบันทึกการแก้ไข
- **Expected Output:** ข้อมูลถูกแก้ไขสำเร็จ ยอดสรุปทางการเงินถูกคำนวณใหม่

#### `FR-EXP-003`: Delete Expense Transaction (ลบรายการรายจ่าย)
- **Actor:** Authenticated User
- **Input:** รหัสรายการ (Transaction ID) และการยืนยัน
- **Process / Business Rule:** ตรวจสอบสิทธิ์เจ้าของรายการและดำเนินการลบรายการ
- **Expected Output:** รายการถูกลบสำเร็จ ยอดสรุปทางการเงินถูกคำนวณใหม่

---

### 4.4 Module: Category Management (CAT)

#### `FR-CAT-001`: View Categories List (ดูรายการหมวดหมู่)
- **Actor:** Authenticated User
- **Input:** การเลือกประเภทหมวดหมู่ (รายรับ หรือ รายจ่าย)
- **Process / Business Rule:** ระบบแสดงรายการหมวดหมู่มาตรฐานแยกตามประเภท (Income Categories / Expense Categories)
- **Expected Output:** รายการหมวดหมู่พร้อมไอคอนและสีประจำหมวดหมู่

---

### 4.5 Module: Dashboard & Financial Analytics (DASH)

#### `FR-DASH-001`: Financial Summary Display (แสดงยอดสรุปทางการเงิน)
- **Actor:** Authenticated User
- **Input:** ช่วงเวลาที่เลือก (ค่าเริ่มต้น: เดือนปัจจุบัน)
- **Process / Business Rule:**
  1. คำนวณ **รายรับรวม (Total Income)** = ผลรวมจำนวนเงินของรายการประเภท `income` ในช่วงเวลา
  2. คำนวณ **รายจ่ายรวม (Total Expense)** = ผลรวมจำนวนเงินของรายการประเภท `expense` ในช่วงเวลา
  3. คำนวณ **ยอดเงินคงเหลือสุทธิ (Net Balance)** = `Total Income - Total Expense`
- **Expected Output:** การ์ดแสดงผล 3 ใบ (ยอดคงเหลือ, รายรับรวม, รายจ่ายรวม) อัปเดตแบบ Real-time

#### `FR-DASH-002`: Category Expense Breakdown Chart (แสดงสัดส่วนรายจ่ายตามหมวดหมู่)
- **Actor:** Authenticated User
- **Input:** ช่วงเวลาที่เลือก
- **Process / Business Rule:** คำนวณสัดส่วนเปอร์เซ็นต์และยอดรวมรายจ่ายแยกตามแต่ละหมวดหมู่
- **Expected Output:** แผนภูมิวงกลม/โดนัท (Donut Chart) แสดงสัดส่วนรายจ่ายตามหมวดหมู่

#### `FR-DASH-003`: Daily/Monthly Trend Charts (แสดงกราฟแนวโน้มรายวัน/รายเดือน)
- **Actor:** Authenticated User
- **Input:** การเลือกมุมมอง (รายวัน หรือ รายเดือน)
- **Process / Business Rule:** รวมยอดรายรับและรายจ่ายเปรียบเทียบตามอนุกรมเวลา (Time Series)
- **Expected Output:** แผนภูมิแท่ง/เส้น (Bar/Line Chart) แสดงการเปรียบเทียบรายรับและรายจ่าย

---

### 4.6 Module: History, Search & Filter (SRCH & HIST)

#### `FR-HIST-001`: Transaction History List (แสดงประวัติรายการทั้งหมด)
- **Actor:** Authenticated User
- **Input:** ตัวเลือกการเรียงลำดับ (ค่าเริ่มต้น: วันที่ล่าสุดขึ้นก่อน `Date DESC`)
- **Process / Business Rule:** ดึงรายการรายรับ-รายจ่ายทั้งหมดที่เป็นของผู้ใช้ปัจจุบัน แสดงผลพร้อมชื่อรายการ จำนวนเงิน วันที่ หมวดหมู่ และไอคอน
- **Expected Output:** ตาราง/รายการประวัติการเงินเรียงตามลำดับเวลา

#### `FR-SRCH-001`: Filter & Search Transactions (ค้นหาและกรองรายการ)
- **Actor:** Authenticated User
- **Input:** คำค้นหา (Keyword), ประเภท (ทั้งหมด/รายรับ/รายจ่าย), หมวดหมู่, ช่วงวันที่เริ่มต้น-สิ้นสุด (Date Range)
- **Process / Business Rule:** กรองข้อมูลรายการเฉพาะที่ตรงตามเงื่อนไขการค้นหาและช่วงวันที่ที่เลือก
- **Expected Output:** รายการประวัติและยอดสรุปย่อยอัปเดตตามเงื่อนไขการกรอง

---

## 5. Non-Functional Requirements (ข้อกำหนดที่ไม่ใช่ฟังก์ชัน)

* **NFR-SEC (Security):**
  - รหัสผ่านของผู้ใช้ทุกคนต้องถูก Hash ด้วย bcrypt ก่อนบันทึกในฐานข้อมูล
  - การสื่อสารข้อมูลต้องทำผ่าน HTTPS หรือเครือข่ายปลอดภัย
  - มีระบบป้องกันการเข้าถึงข้อมูลข้ามบัญชี (Row-Level Data Isolation ตาม `user_id`)
* **NFR-PERF (Performance):**
  - เวลาในการตอบสนองของ API (Response Time) ต้องไม่เกิน 500 ms สำหรับ Query ทั่วไป
  - หน้า Dashboard ต้องโหลดและแสดงผลกราฟเสร็จสิ้นภายในเวลาไม่เกิน 2 วินาที
* **NFR-USA (Usability):**
  - หน้าตาอินเทอร์เฟซต้องออกแบบสไตล์ Modern Glassmorphism/MUI 5 สะอาด ตา อ่านง่าย
  - มีระบบแจ้งเตือน Feedback ที่ชัดเจนเมื่อทำรายการสำเร็จหรือเกิด Error (Toast Notifications / Alert Dialogs)
* **NFR-REL (Reliability):**
  - ระบบ Container บน Docker Compose ต้องมี Healthcheck และสามารถ Restart ตัวเองอัตโนมัติเมื่อเกิด Crash
* **NFR-MAINT (Maintainability):**
  - โครงสร้างซอร์สโค้ดต้องแยก Layer ชัดเจน (Routes, Services, Controllers, Components) ตามหลักการ Clean Architecture
* **NFR-SCAL (Scalability):**
  - สถาปัตยกรรมไร้สถานะ (Stateless Backend Architecture) เพื่อรองรับการขยายตัว (Scale out) บน Cloud ในอนาคต
* **NFR-AVAIL (Availability):**
  - ระบบพร้อมใช้งาน 99.5% บนสภาพแวดล้อม Production (Railway)
* **NFR-RESP (Responsive Design):**
  - แสดงผลได้อย่างสมบูรณ์แบบบนหน้าจอคอมพิวเตอร์ (Desktop), แท็บเล็ต (Tablet) และสมาร์ตโฟน (Mobile Browser)
* **NFR-PRIV (Data Privacy):**
  - ห้ามเปิดเผย หรือส่งออกข้อมูลทางการเงินส่วนบุคคลของผู้ใช้ไปยังบุคคลภายนอก
* **NFR-COMP (Browser Compatibility):**
  - รองรับการใช้งานบน Web Browsers มาตรฐานเวอร์ชันปัจจุบัน (Chrome, Edge, Firefox, Safari)

---

## 6. High-Level Data Requirements (ข้อมูลที่ระบบต้องจัดเก็บ)
*(หมายเหตุ: ระบุเฉพาะขอบเขตข้อมูลที่ระบบต้องจัดเก็บในระดับ Requirement ยังไม่ใช่ Database Schema)*

1. **User Data (ข้อมูลผู้ใช้งาน):** อีเมล, รหัสผ่านที่ Hash แล้ว, ชื่อแสดงผล, วันที่ลงทะเบียน
2. **Category Data (ข้อมูลหมวดหมู่):** ชื่อหมวดหมู่, ประเภท (รายรับ/รายจ่าย), ไอคอนประจำหมวดหมู่, สีประจำหมวดหมู่
3. **Transaction Data (ข้อมูลรายการรายรับ-รายจ่าย):** ผู้เป็นเจ้าของ (`user_id`), ชื่อรายการ, จำนวนเงิน, ประเภทรายการ (รายรับ/รายจ่าย), หมวดหมู่ที่เกี่ยวข้อง, วันที่ทำรายการ, หมายเหตุเพิ่มเติม, วันเวลาที่บันทึกข้อมูล

---

## 7. High-Level Presentation Data Requirements (ข้อมูลที่ระบบต้องแสดงผล)
1. **Summary Bar:** ยอดรวมรายรับ, ยอดรวมรายจ่าย, ยอดเงินคงเหลือสุทธิ
2. **Transaction List View:** ลำดับรายการ, วันที่, ไอคอนหมวดหมู่, ชื่อรายการ, หมายเหตุ, เครื่องหมาย (+/-), จำนวนเงินที่ไฮไลต์สี (สีเขียวสำหรับรายรับ, สีแดงสำหรับรายจ่าย)
3. **Analytics Charts:** กราฟสัดส่วนรายจ่ายตามหมวดหมู่ (%) และ กราฟแท่งเปรียบเทียบรายรับ-รายจ่ายตามอนุกรมเวลา

---

## 8. Business Rules (เงื่อนไขทางธุรกิจของระบบ)
1. **User Data Isolation:** ผู้ใช้แต่ละคนมีสิทธิ์เข้าถึง ดู แก้ไข และลบ เฉพาะข้อมูลรายรับ-รายจ่ายของตนเองเท่านั้น
2. **Positive Transaction Amount:** จำนวนเงินในทุกรายการรายรับและรายจ่ายต้องเป็นค่าตัวเลขบวกที่มากกว่า 0 (`Amount > 0`)
3. **Mandatory Category Association:** ทุกรายการรายรับ-รายจ่ายต้องเลือกหมวดหมู่ที่ตรงตามประเภทรายการเสมอ
4. **Date Accuracy:** วันที่ของรายการต้องเป็นวันที่ปฏิทินที่ถูกต้อง
5. **Real-time Balance Calculation:** ยอดเงินคงเหลือสุทธิ = `ผลรวมรายรับทั้งหมด - ผลรวมรายจ่ายทั้งหมด` (ต้องคำนวณใหม่เสมอเมื่อมีการ เพิ่ม/แก้ไข/ลบ รายการ)

---

## 9. Constraints & Risks (ข้อจำกัดและความเสี่ยง)
* **Ephemeral Storage Risk:** สภาพแวดล้อม Railway มี Filesystem แบบ Ephemeral ดังนั้นหากในอนาคตมีฟีเจอร์อัปโหลดรูปใบเสร็จ ต้องใช้วิธีจัดเก็บไฟล์บน Cloud Object Storage (เช่น S3) หรือ Railway Volume
* **Port Allocation Constraint:** Backend ต้องรันบน Port `5001` เพื่อหลีกเลี่ยงการชนกับ AirPlay Receiver บน macOS (Port 5000)
* **Single-Container Deployment Model:** การ Deploy ขึ้น Railway ต้องรวม Frontend Dist และ Express API เข้าเป็น Single-Container ผ่าน Multi-stage Dockerfile

---

## 10. Open Questions & Assumptions (คำถามที่ควรถามผู้ใช้เพิ่มเติม และสมมติฐาน)

### Assumptions (สมมติฐานเบื้องต้น)
1. ในเวอร์ชันแรก ระบบจะจัดเตรียมหมวดหมู่มาตรฐาน (Default Categories) สำหรับรายรับและรายจ่ายไว้ให้ผู้ใช้ทุกคน
2. ระบบคำนวณยอดเงินคงเหลือจากผลรวมรายการทั้งหมดที่ผู้ใช้บันทึกในระบบ

### Open Questions (คำถามที่ต้องรอการตัดสินใจกับผู้ใช้จริง)
> [!IMPORTANT]
> 1. **Custom Categories:** ผู้ใช้ควรมีสิทธิ์ เพิ่ม/แก้ไข/ลบ หมวดหมู่ส่วนตัวของตนเองได้ด้วยหรือไม่ หรือใช้เฉพาะหมวดหมู่มาตรฐานของระบบในระยะแรก?
> 2. **Receipt Image Attachment:** ในอนาคตต้องการฟีเจอร์แนบรูปภาพใบเสร็จในแต่ละรายการหรือไม่?
> 3. **Export Data Function:** ต้องการฟังก์ชันส่งออกข้อมูลประวัติการเงินเป็นไฟล์ CSV หรือ Excel หรือไม่?
> 4. **Monthly Budget Setting:** ต้องการฟีเจอร์ตั้งค่าลิมิตงบประมาณรายจ่ายประจำเดือน (Monthly Budget Limit) พร้อมการแจ้งเตือนเมื่อใช้เงินใกล้เต็มงบหรือไม่?
