# 04. Transaction & Business Workflow Document

**Project Name:** Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)  
**Document Version:** 1.0.0  
**Phase:** Phase 1 - Business & System Workflow Analysis  
**Authors:** Senior Full-stack Architect, Business Analyst & UX/UI Specialist  

---

## 1. Workflow Overview
เอกสารฉบับนี้จัดทำขึ้นเพื่อกำหนดลำดับขั้นตอนการทำงาน (Workflows), ลำดับกิจกรรม (Activity Diagrams / Flowcharts), กฎทางธุรกิจ (Business Rules) และการรับมือข้อผิดพลาด (Exception Handling) ของ **Personal Income & Expense Management System**

ระบบออกแบบให้มีกระบวนการทำงานที่สอดคล้องกับภาพรวมสถาปัตยกรรม (System Overview `01`), ข้อกำหนดเชิงฟังก์ชัน (Requirements `02`) และสิทธิ์การเข้าถึง (Roles & Permissions `03`) โดยแบ่งออกเป็น 7 โมดูลกระบวนการหลักที่ครอบคลุมทุกประสบการณ์ของผู้ใช้งาน (User Journey)

---

## 2. Authentication Workflow

### 2.1 Workflow Diagram: Register, Login & Profile Management

```text
[Guest User]
    ↓
เลือก "เข้าสู่ระบบ" / "ลงทะเบียน"
    ↓
กรอกข้อมูล (Email, Password, Display Name)
    ↓
ระบบตรวจสอบความถูกต้อง (Validation)
    ↓
ข้อมูลถูกต้อง?
 ├─ ไม่ถูกต้อง → แสดงข้อความ Error → ให้แก้ไขข้อมูล
 └─ ถูกต้อง → ระบบบันทึกบัญชี / สร้าง Auth Token
             ↓
        นำผู้ใช้เข้าสู่หน้า Dashboard (Authenticated User)
```

### 2.2 Detailed Step Table

| Sub-workflow | Trigger | Actor | Input | Validation & Business Rule | Expected Output | Error / Exception Case |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Register** | กดปุ่ม "สมัครสมาชิก" | Guest | Email, Password, Confirm Password, Display Name | Email ทรงมาตรฐาน, ไม่ซ้ำในระบบ, Password ≥ 8 ตัวอักษร และตรงกับ Confirm Password | บัญชีถูกสร้างสำเร็จ ระบบนำไปหน้า Login | - Email ซ้ำ: แสดงเตือน "อีเมลนี้ถูกใช้งานแล้ว"<br>- Password ไม่ตรงกัน: แสดงเตือน "รหัสผ่านไม่ตรงกัน" |
| **Login** | กดปุ่ม "เข้าสู่ระบบ" | Guest | Email, Password | ตรวจสอบ Email และเทียบ Hash Password ในระบบ | สร้าง Auth Token นำเข้าสู่หน้า Dashboard | - Email/Password ไม่ถูกต้อง: แสดงเตือน "อีเมลหรือรหัสผ่านไม่ถูกต้อง" |
| **Logout** | กดปุ่ม "ออกจากระบบ" | User | Click Action | ทำลาย Token และล้าง State ฝั่ง Client | กลับสู่หน้า Welcome/Login | - Session หมดอายุแล้ว: ระบบล้าง State และรีไดเรกต์ทันที |
| **Edit Profile** | กด "บันทึกข้อมูลส่วนตัว" | User | Display Name ใหม่, Password ปัจจุบัน/ใหม่ | ต้องระบุ Password ปัจจุบันถูกต้องหากต้องการเปลี่ยน Password | ข้อมูลโปรไฟล์ถูกอัปเดต | - Password ปัจจุบันไม่ถูกต้อง: แสดงเตือน "รหัสผ่านปัจจุบันไม่ถูกต้อง" |

---

## 3. Income Workflow

### 3.1 Workflow Diagram: Manage Income Transaction

```text
[Authenticated User]
    ↓
เลือก "เพิ่มรายการรายรับ"
    ↓
กรอกข้อมูล (ชื่อรายการ, จำนวนเงิน > 0, วันที่, หมวดหมู่รายรับ, หมายเหตุ)
    ↓
ระบบตรวจสอบข้อมูล (Validation)
    ↓
ข้อมูลถูกต้อง?
 ├─ ไม่ถูกต้อง → แสดง Error → กลับไปแก้ไขในฟอร์ม
 └─ ถูกต้อง → บันทึกรายการผูกกับ user_id
             ↓
        คำนวณยอดสรุปทางการเงินใหม่ (Total Income & Net Balance)
             ↓
        แสดงผลสำเร็จ และอัปเดตรายการในหน้า Dashboard / History
```

### 3.2 Income Operations Detail

- **Trigger:** ผู้ใช้คลิกปุ่ม "+ เพิ่มรายรับ", "แก้ไข" หรือ "ลบ" ในรายการรายรับ
- **Actor:** Authenticated User (เจ้าของข้อมูล)
- **Input:** ชื่อรายการ, จำนวนเงิน (Amount > 0), วันที่ (Date), หมวดหมู่รายรับ (Income Category ID), หมายเหตุ (Note)
- **Business Rule:**
  - รายการต้องถูกผูกเข้ากับ `user_id` ของผู้ใช้ที่ Login อยู่โดยอัตโนมัติ
  - ประเภทรายการถูกกำหนดเป็น `income`
  - จำนวนเงินต้องมากกว่า 0 บาท (`Amount > 0`)
- **End State:** รายการบันทึกสำเร็จ ยอดสรุปทางการเงินและ Dashboard คำนวณใหม่ทันที

---

## 4. Expense Workflow

### 4.1 Workflow Diagram: Manage Expense Transaction

```text
[Authenticated User]
    ↓
เลือก "เพิ่มรายการรายจ่าย"
    ↓
กรอกข้อมูล (ชื่อรายการ, จำนวนเงิน > 0, วันที่, หมวดหมู่รายจ่าย, หมายเหตุ)
    ↓
ระบบตรวจสอบข้อมูล (Validation)
    ↓
ข้อมูลถูกต้อง?
 ├─ ไม่ถูกต้อง → แสดง Error → กลับไปแก้ไขในฟอร์ม
 └─ ถูกต้อง → บันทึกรายการผูกกับ user_id
             ↓
        คำนวณยอดสรุปทางการเงินใหม่ (Total Expense & Net Balance)
             ↓
        แสดงผลสำเร็จ และอัปเดตรายการในหน้า Dashboard / History
```

### 4.2 Expense Operations Detail

- **Trigger:** ผู้ใช้คลิกปุ่ม "- เพิ่มรายจ่าย", "แก้ไข" หรือ "ลบ" ในรายการรายจ่าย
- **Actor:** Authenticated User (เจ้าของข้อมูล)
- **Input:** ชื่อรายการ, จำนวนเงิน (Amount > 0), วันที่ (Date), หมวดหมู่รายจ่าย (Expense Category ID), หมายเหตุ (Note)
- **Business Rule:**
  - รายการต้องถูกผูกเข้ากับ `user_id` ของผู้ใช้ที่ Login อยู่โดยอัตโนมัติ
  - ประเภทรายการถูกกำหนดเป็น `expense`
  - จำนวนเงินต้องมากกว่า 0 บาท (`Amount > 0`)
- **End State:** รายการบันทึกสำเร็จ ยอดสรุปทางการเงินและ Dashboard คำนวณใหม่ทันที

---

## 5. Category Workflow

### 5.1 Category Selection & Filtering Workflow

```text
[Authenticated User]
    ↓
เลือกประเภทรายการ (รายรับ หรือ รายจ่าย)
    ↓
ระบบดึงหมวดหมู่มาตรฐานที่ตรงกับประเภทรายการ
    ↓
ผู้ใช้เลือกหมวดหมู่ที่ต้องการ
    ↓
ระบบผูก category_id เข้ากับรายการ
```

### 5.2 Category Business Rules
- หมวดหมู่รายรับ (Income Categories) เช่น เงินเดือน, งานฟรีแลนซ์, การลงทุน
- หมวดหมู่รายจ่าย (Expense Categories) เช่น อาหารและเครื่องดื่ม, ค่าเดินทาง, ค่าที่พัก/สาธารณูปโภค, ช้อปปิ้ง
- ทุกรายการรายรับ-รายจ่ายต้องระบุหมวดหมู่ที่ตรงตามประเภทรายการเสมอ

---

## 6. Search & Filter Workflow

### 6.1 Workflow Diagram: Querying Financial History

```text
[Authenticated User]
    ↓
ระบุเงื่อนไข (คำค้นหา / เลือกประเภท / เลือกหมวดหมู่ / เลือกช่วงวันที่)
    ↓
ระบบกรองรายการเฉพาะของ user_id ที่ตรงตามเงื่อนไข
    ↓
ระบบคำนวณยอดรวมย่อย (Subtotal Income & Expense) ของผลลัพธ์ที่กรอง
    ↓
แสดงรายการที่ค้นพบ เรียงตามวันที่ล่าสุด (Date DESC)
```

---

## 7. Dashboard Workflow

### 7.1 Real-time Financial Dashboard Calculation Workflow

```text
[Authenticated User เข้าสู่หน้า Dashboard]
    ↓
ระบบส่งคำขอสืบค้นรายการของ user_id ในช่วงเวลาที่เลือก (ค่าเริ่มต้น: เดือนปัจจุบัน)
    ↓
คำนวณยอดรวมรายรับ (Total Income = Sum of Income Amounts)
คำนวณยอดรวมรายจ่าย (Total Expense = Sum of Expense Amounts)
คำนวณยอดคงเหลือสุทธิ (Net Balance = Total Income - Total Expense)
คำนวณสัดส่วนรายจ่ายแยกตามหมวดหมู่ (%)
    ↓
เรนเดอร์การ์ดสรุปยอดเงิน + Donut Chart (หมวดหมู่) + Trend Bar/Line Chart (รายวัน/รายเดือน)
```

---

## 8. Report Workflow

### 8.1 Periodic Financial Reporting Workflow

```text
[Authenticated User เลือกเมนูรายงาน/ช่วงเวลา]
    ↓
เลือกช่วงเวลาที่ต้องการวิเคราะห์ (เช่น เดือนนี้, เดือนที่แล้ว, กำหนดช่วงวัน)
    ↓
ระบบดึงข้อมูลรายการทั้งหมดของช่วงเวลานั้น
    ↓
แสดงรายงานสรุปสถิติ สัดส่วนการใช้จ่าย และเปรียบเทียบแนวโน้มรายรับ-รายจ่าย
```

---

## 9. Transaction Lifecycle (วิเคราะห์วงจรชีวิตของรายการ)

### 9.1 Lifecycle Analysis: Complex vs. Simple Model
จากการวิเคราะห์ระบบจัดการการเงินส่วนบุคคล (Personal Finance App) พบว่าการทำรายการบันทึกรายรับ-รายจ่ายเป็นกิจกรรมที่เกิดขึ้นทันทีโดยผู้ใช้คนเดียว (Synchronous User-driven Transaction) **ไม่จำเป็นต้องมีวงจรชีวิตที่ซับซ้อน เช่น `Draft` หรือ `Pending Validation`** เนื่องจากจะสร้างความยุ่งยากและเพิ่มขั้นตอนที่ไม่จำเป็นแก่ผู้ใช้งาน

### 9.2 Proposed Simple Lifecycle Model
ระบบเลือกใช้โมเดลสถานะอย่างง่าย (Simple Direct Lifecycle) ดังนี้:

```mermaid
stateDiagram-v8
    [*] --> Active: สร้างรายการใหม่ (Created)
    Active --> Active: แก้ไขข้อมูลรายการ (Updated)
    Active --> Deleted: ลบรายการ (Deleted)
    Deleted --> [*]
```

* **Active:** รายการสมบูรณ์และเปิดใช้งาน ถูกนำไปคำนวณใน Dashboard และรายงานทันที
* **Deleted:** รายการถูกลบออกจากระบบ (Hard Delete หรือ Soft Delete) และถูกตัดออกจากการคำนวณใน Dashboard ทันที

---

## 10. Business Rules Summary

1. **Strict Ownership Isolation:** รายการทุกประเภท (Income, Expense) ต้องผูกกับ `user_id` ของผู้ใช้ที่ Login อยู่เท่านั้น และสามารถอ่าน/แก้ไข/ลบ ได้เฉพาะเจ้าของข้อมูล
2. **Positive Value Constraint:** จำนวนเงินในรายการต้องมากกว่า 0 บาท (`Amount > 0`)
3. **Valid Date Requirement:** วันที่ของรายการต้องระบุรูปแบบวันที่ที่ถูกต้อง
4. **Category Consistency:** รายการรายรับต้องเลือกหมวดหมู่รายรับ และรายการรายจ่ายต้องเลือกหมวดหมู่รายจ่าย
5. **Dynamic Dashboard Recalculation:** ทุกครั้งที่มีการ เพิ่ม, แก้ไข หรือลบ รายการ ระบบต้องคำนวณยอดรวมรายรับ ยอดรวมรายจ่าย และยอดคงเหลือสุทธิใหม่แบบ Real-time

---

## 11. Exception & Error Handling Matrix (การวิเคราะห์กรณีผิดปกติ 16 กรณี)

| # | กรณีผิดปกติ (Exception Case) | การดำเนินการของระบบ (System Action) | ข้อความแจ้งเตือน (UI Error Message) | สิ่งที่ให้ User ทำต่อ | การบันทึกข้อมูล |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | จำนวนเงินไม่ใช่ตัวเลข | ปฏิเสธการบันทึก, แสดงเตือนที่ฟอร์ม | "กรุณาระบุจำนวนเงินเป็นตัวเลขที่ถูกต้อง" | แก้ไขจำนวนเงินในฟอร์ม | **ไม่บันทึก** |
| 2 | จำนวนเงินเป็น 0 หรือติดลบ | ปฏิเสธการบันทึก, ไฮไลต์ช่องจำนวนเงิน | "จำนวนเงินต้องมากกว่า 0 บาท" | กรอกจำนวนเงินใหม่ให้ > 0 | **ไม่บันทึก** |
| 3 | ไม่ระบุวันที่ | ปฏิเสธการบันทึก | "กรุณาระบุวันที่ทำรายการ" | เลือกวันที่จาก Date Picker | **ไม่บันทึก** |
| 4 | ไม่ระบุหมวดหมู่ | ปฏิเสธการบันทึก | "กรุณาเลือกหมวดหมู่รายการ" | เลือกหมวดหมู่ใน Dropdown | **ไม่บันทึก** |
| 5 | ไม่ระบุประเภทรายการ | ปฏิเสธการบันทึก | "กรุณาระบุประเภทรายการ (รายรับ/รายจ่าย)" | เลือกประเภทรายการ | **ไม่บันทึก** |
| 6 | หมวดหมู่ไม่ตรงกับประเภท | ระบบปรับรายการหมวดหมู่ให้ตรงกับประเภทอัตโนมัติ | "ระบบรีเซ็ตหมวดหมู่ให้ตรงกับประเภทรายการ" | เลือกหมวดหมู่ใหม่ที่ถูกต้อง | **ไม่บันทึก** |
| 7 | พยายามแก้ไขรายการของผู้อื่น | ปฏิเสธการเข้าถึง (403 Forbidden) | "คุณไม่มีสิทธิ์แก้ไขรายการนี้" | กลับสู่หน้าประวัติของตนเอง | **ไม่บันทึก** |
| 8 | พยายามลบรายการของผู้อื่น | ปฏิเสธการเข้าถึง (403 Forbidden) | "คุณไม่มีสิทธิ์ลบรายการนี้" | กลับสู่หน้าประวัติของตนเอง | **ไม่บันทึก** |
| 9 | ไม่พบรายการที่ต้องการแก้ไข | ตอบกลับ 404 Not Found | "ไม่พบรายการที่ต้องการแก้ไข ในระบบ" | รีเฟรชหน้าประวัติรายการ | **ไม่บันทึก** |
| 10 | ไม่พบรายการที่ต้องการลบ | ตอบกลับ 404 Not Found | "ไม่พบรายการที่ต้องการลบ ในระบบ" | รีเฟรชหน้าประวัติรายการ | **ไม่บันทึก** |
| 11 | ข้อมูลซ้ำ (กดบันทึกซ้ำ) | Disable ปุ่มบันทึกระหว่างส่งข้อมูล | "กำลังบันทึกข้อมูล..." | รอระบบประมวลผลเสร็จ | บันทึก 1 ครั้ง |
| 12 | เกิดข้อผิดพลาดขณะบันทึก DB | Catch Error, แสดงแจ้งเตือน | "เกิดข้อผิดพลาดทางเทคนิค กรุณาลองใหม่อีกครั้ง" | กดปุ่มบันทึกซ้ำอีกครั้ง | **ไม่บันทึก** |
| 13 | Session / Token หมดอายุ | ล้าง State, รีไดเรกต์ไปหน้า Login | "เซสชันของคุณหมดอายุ กรุณาเข้าสู่ระบบใหม่" | กรอก Login เพื่อเข้าสู่ระบบ | **ไม่บันทึก** |
| 14 | ไม่ได้รับอนุญาตเข้าถึงหน้า | รีไดเรกต์ไปหน้า Login | "กรุณาเข้าสู่ระบบก่อนใช้งาน" | กรอก Login เพื่อเข้าสู่ระบบ | **ไม่บันทึก** |
| 15 | ไม่มีข้อมูลแสดง Dashboard | แสดง UI แบบ Empty State | "ยังไม่มีรายการในขณะนี้ เริ่มบันทึกรายการแรกของคุณ" | คลิกปุ่ม "+ เพิ่มรายการใหม่" | N/A |
| 16 | ไม่มีข้อมูลในช่วงวันที่เลือก | แสดง Empty State ในตารางประวัติ | "ไม่พบรายการในช่วงเวลาที่เลือก" | ปรับเปลี่ยนเงื่อนไขตัวกรองวันที่ | N/A |

---

## 12. Data Access Rules Summary
* **Current User Context:** ทุก Query ต้องเติมเงื่อนไข `WHERE user_id = :authenticated_user_id` เสมอ
* **Dashboard Data Integrity:** ยอดรวมและกราฟใน Dashboard คำนวณเฉพาะจาก Transaction Active ของผู้ใช้ที่ Login อยู่เท่านั้น ไม่นำข้อมูลของ User คนอื่นมาปะปน

---

## 13. Open Questions & Assumptions

### Assumptions
1. การลบรายการใช้รูปแบบ Hard Delete หรือ Soft Delete ก็ได้ แต่ผลลัพธ์ต้องตัดออกจากการคำนวณ Dashboard ทันที
2. วันที่ของรายการสามารถป้อนวันอดีต ปัจจุบัน หรืออนาคตได้ (เพื่อรองรับการวางแผนการเงินล่วงหน้า)

### Open Questions
> [!IMPORTANT]
> 1. **Future Date Warning:** หากผู้ใช้บันทึกรายการลงในวันที่อนาคต ควรมีข้อความแจ้งเตือนยืนยันก่อนหรือไม่?
> 2. **Batch Delete:** ควรเปิดให้ผู้ใช้เลือกกดลบหลายรายการพร้อมกัน (Bulk Delete) ในหน้าประวัติหรือไม่?

---

## 14. Recommendations
1. **Frontend Input Guarding:** ทำ Form Validation ที่ฝั่ง Client เพื่อสกัด Error ปริมาณมากก่อนส่ง API (เช่น ตรวจสอบจำนวนเงิน > 0 และวันที่ไม่ว่าง)
2. **Optimistic / Immediate UI Updates:** อัปเดตยอดสรุปใน Dashboard และรายการบนหน้าจอทันทีเมื่อทำรายการสำเร็จ เพื่อ UX ที่รวดเร็วทันใจ
