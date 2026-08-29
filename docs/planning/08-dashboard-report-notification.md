# 08. Dashboard, Report & Notification Specification Document

**Project Name:** Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)  
**Document Version:** 1.0.0  
**Phase:** Phase 2 - Analytics, Dashboard & Notification Design  
**Authors:** Senior Product Architect, Business Analyst, Data Analyst & UX Designer  

---

## 1. Overview
เอกสารฉบับนี้จัดทำขึ้นเพื่อวางสถาปัตยกรรมและรายละเอียดการออกแบบ **Dashboard ศูนย์รวมข้อมูลทางการเงิน**, **รายงานสรุปทางการเงิน (Financial Reports)** และ **กลยุทธ์การแจ้งเตือน (Notification Strategy)** สำหรับ **Personal Income & Expense Management System**

การออกแบบมุ่งเน้นการตอบโจทย์ความต้องการของผู้ใช้งานในการสืบค้น วิเคราะห์สถิติ และติดตามสุขภาพทางการเงิน (Financial Health) แบบ Real-time โดยยึดหลัก **User-Level Data Isolation** (แสดงผลเฉพาะข้อมูลของผู้ใช้ที่ Login อยู่เท่านั้น) และสอดคล้องกับ Database Schema (`05`), REST API Contract (`06`) และ Frontend Architecture (`07`)

---

## 2. Dashboard Objectives (เป้าหมายและคำถามสำคัญที่ Dashboard ต้องตอบได้)
Dashboard ออกแบบมาเพื่อตอบคำถามสำคัญทางการเงินของผู้ใช้ 10 ข้อหลัก:

1. **ยอดรวมรายรับเดือนนี้เป็นเท่าไร?** -> ตอบด้วย Income Summary Card
2. **ยอดรวมรายจ่ายเดือนนี้เป็นเท่าไร?** -> ตอบด้วย Expense Summary Card
3. **เงินคงเหลือสุทธิปัจจุบันเป็นเท่าไร?** -> ตอบด้วย Net Balance Card
4. **สัดส่วนรายจ่ายเทียบกับรายรับเป็นเท่าไร?** -> ตอบด้วย Percentage Comparison Indicator
5. **ใช้เงินกับหมวดหมู่ใดมากที่สุด?** -> ตอบด้วย Expense Breakdown Donut Chart
6. **รายรับหลักมาจากหมวดหมู่ใด?** -> ตอบด้วย Income Source Breakdown
7. **แต่ละวันมีการใช้จ่ายมากน้อยเพียงใด?** -> ตอบด้วย Daily Trend Bar/Line Chart
8. **แนวโน้มรายรับ-รายจ่ายรายเดือนเป็นอย่างไร?** -> ตอบด้วย Monthly Trend Comparison Chart
9. **ช่วงเวลาใดของเดือนที่มีการใช้จ่ายสูงผิดปกติ?** -> ตอบด้วย Peak Expense Day Highlight
10. **มีรายการทางการเงินล่าสุดอะไรบ้าง?** -> ตอบด้วย Recent Transactions Widget (5 รายการล่าสุด)

---

## 3. Dashboard Cards Specification (ข้อกำหนดการ์ดสรุปผล)

### 3.1 Card Summary Matrix

| Card Name | Meaning & Purpose | Data Source | Conceptual Calculation Formula | Time Range | Sample Output | Empty State UX | Related API |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Net Balance** | ยอดเงินคงเหลือสุทธิจากรายการที่บันทึก | `transactions` | `Total Income Amount - Total Expense Amount` | เลือกช่วงเวลา (Default: เดือนนี้) | `฿25,500.00` | `฿0.00` | `GET /api/v1/dashboard/summary` |
| **Total Income** | ผลรวมรายรับทั้งหมดในช่วงเวลา | `transactions` (type='income') | `SUM(amount) WHERE type='income'` | เลือกช่วงเวลา (Default: เดือนนี้) | `+฿45,000.00` | `+฿0.00` | `GET /api/v1/dashboard/summary` |
| **Total Expense** | ผลรวมรายจ่ายทั้งหมดในช่วงเวลา | `transactions` (type='expense') | `SUM(amount) WHERE type='expense'` | เลือกช่วงเวลา (Default: เดือนนี้) | `-฿19,500.00` | `-฿0.00` | `GET /api/v1/dashboard/summary` |
| **Transaction Count** | จำนวนรายการการเงินทั้งหมด | `transactions` | `COUNT(id)` | เลือกช่วงเวลา (Default: เดือนนี้) | `32 รายการ` | `0 รายการ` | `GET /api/v1/dashboard/summary` |
| **Top Expense Category**| หมวดหมู่ที่ใช้เงินมากที่สุด | `transactions` + `categories` | `Category with MAX(SUM(amount)) WHERE type='expense'` | เลือกช่วงเวลา (Default: เดือนนี้) | `อาหารและเครื่องดื่ม (฿8,200.00)` | `ไม่มีข้อมูล` | `GET /api/v1/dashboard/summary` |

---

## 4. Dashboard Charts Architecture

### 4.1 Income vs Expense Trend Chart (กราฟเปรียบเทียบแนวโน้ม)
- **Chart Type:** Grouped Bar Chart หรือ Dual Line Chart
- **Dimension:** เวลา (อนุกรมเวลา: รายวัน หรือ รายเดือน)
- **Metrics:** ยอดรวมรายรับ (สีเขียว `#10B981`) เปรียบเทียบ ยอดรวมรายจ่าย (สีแดง `#EF4444`)
- **Reasoning:** กราฟแท่งคู่เปรียบเทียบช่วยให้ผู้ใช้เห็นภาพความคล่องตัวทางการเงินและวันที่/เดือนที่มีการใช้จ่ายสูงเกินรายรับได้อย่างชัดเจนที่สุด

### 4.2 Expense Breakdown by Category Chart (กราฟสัดส่วนรายจ่าย)
- **Chart Type:** Donut Chart พร้อม Legend ข้างกราฟ
- **Dimension:** หมวดหมู่รายจ่าย (`categories.name`)
- **Metrics:** ยอดรวมจำนวนเงินแยกตามหมวดหมู่ และสัดส่วนเปอร์เซ็นต์ (`%`)
- **Reasoning:** Donut Chart ช่วยให้เห็นจุดรั่วไหลทางการเงินได้ทันทีว่าค่าใช้จ่ายส่วนใหญ่ตกอยู่ที่หมวดหมู่ใด

### 4.3 Income Breakdown by Category Chart (กราฟสัดส่วนรายรับ)
- **Chart Type:** Donut Chart หรือ Horizontal Bar Chart
- **Dimension:** หมวดหมู่รายรับ (`categories.name`)
- **Metrics:** สัดส่วนรายรับแยกตามหมวดหมู่ (เช่น เงินเดือน 80%, ฟรีแลนซ์ 20%)

---

## 5. Dashboard Filters Specification
- **Filter Options & Range Definitions:**
  1. **วันนี้ (Today):** วันปัจจุบัน `00:00:00` ถึง `23:59:59`
  2. **7 วันล่าสุด (Last 7 Days):** 7 วันย้อนหลังนับจากวันปัจจุบัน
  3. **เดือนนี้ (This Month - Default):** วันที่ 1 ของเดือนปัจจุบัน ถึง วันสิ้นเดือน
  4. **เดือนที่แล้ว (Last Month):** วันที่ 1 ถึงวันสิ้นเดือนของเดือนก่อนหน้า
  5. **ปีนี้ (This Year):** 1 มกราคม ถึง 31 ธันวาคม ของปีปัจจุบัน
  6. **Custom Date Range:** ผู้ใช้เลือก `start_date` และ `end_date` เองได้ผ่าน Date Picker
- **Impact & API:** ทุก Filter เมื่อเปลี่ยนค่า จะส่ง Query String `start_date` และ `end_date` ไปยัง API `/api/v1/dashboard/summary` และ `/api/v1/dashboard/charts` เพื่อคำนวณและอัปเดตทั้งการ์ดและกราฟใหม่พร้อมกัน

---

## 6. Recent Transactions Widget
- **UX Purpose:** แสดงรายการเคลื่อนไหวทางการเงินล่าสุดเพื่อตรวจสอบความถูกต้องรวดเร็ว
- **Capacity:** แสดงผล 5 รายการล่าสุด (`limit=5`, `sort=date`, `order=desc`)
- **Columns Displayed:** วันที่, ประเภทไอคอน, ชื่อรายการ, ชื่อหมวดหมู่, หมายเหตุ, จำนวนเงิน (ไฮไลต์สี)
- **Quick Actions:**
  - คลิกที่รายการเพื่อดูรายละเอียด (`View Detail`)
  - ปุ่มกด "ดูประวัติรายการทั้งหมด (View All)" ลิงก์ไปยังหน้า `/transactions`

---

## 7. Financial Metrics Definition Matrix

| Metric Name | Description & Meaning | Conceptual Calculation Method | Primary Source | Example Output | Zero/Empty State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Total Income** | ผลรวมจำนวนเงินรายรับ | `SUM(amount) WHERE type = 'income'` | `transactions` | `฿45,000.00` | `฿0.00` |
| **Total Expense** | ผลรวมจำนวนเงินรายจ่าย | `SUM(amount) WHERE type = 'expense'` | `transactions` | `฿19,500.00` | `฿0.00` |
| **Net Balance** | ยอดคงเหลือสุทธิ | `Total Income - Total Expense` | `transactions` | `฿25,500.00` | `฿0.00` |
| **Expense ratio** | อัตราส่วนรายจ่ายต่อรายรับ | `(Total Expense / Total Income) * 100` | `transactions` | `43.33%` | `0%` |
| **Daily Average Expense**| รายจ่ายเฉลี่ยต่อวัน | `Total Expense / Number of Days in Period` | `transactions` | `฿650.00 / วัน` | `฿0.00` |

---

## 8. Financial Reports Architecture (`/reports`)
หน้าจอสรุปรายงานการเงินออกแบบให้แสดงวิเคราะห์ข้อมูลแบบละเอียด:
1. **Income Report:** สรุปยอดรายรับรวม สัดส่วนตามหมวดหมู่รายรับ และสถิติแนวโน้ม
2. **Expense Report:** สรุปยอดรายจ่ายรวม สัดส่วนตามหมวดหมู่รายจ่าย และหมวดหมู่ที่ใช้เงินสูงสุด
3. **Financial Summary Report:** สรุปการเปรียบเทียบรายรับ รายจ่าย ยอดคงเหลือ และสัดส่วนการออม (Savings Ratio)

---

## 9. Report Filters & Granularity
- **Filter Controls:**
  - **Date Range Picker:** สเปกช่วงวันเริ่มต้นและสิ้นสุด
  - **Transaction Type Filter:** เลือกดู ทั้งหมด / เฉพาะรายรับ / เฉพาะรายจ่าย
  - **Category Filter:** เลือกเฉพาะหมวดหมู่ที่สนใจ
  - **Time Granularity:** ปรับมุมมองการสรุปผลแบบ **รายวัน (Daily)** หรือ **รายเดือน (Monthly)**

---

## 10. Report Tables Specification
- **Columns:** วันที่ (Date), ประเภท (Type), หมวดหมู่ (Category), รายละเอียด (Description/Title), จำนวนเงิน (Amount)
- **Table Footer Summary Row:**
  - ยอดรวมรายรับสะสม (Total Income Subtotal)
  - ยอดรวมรายจ่ายสะสม (Total Expense Subtotal)
  - ยอดคงเหลือสุทธิประจำรายงาน (Net Balance Subtotal)
- **Pagination:** 20 รายการต่อหน้า พร้อมปุ่มเปลี่ยนหน้า

---

## 11. Report Export Analysis
- **การวิเคราะห์ MVP:** ฟังก์ชันการส่งออกรายงานเป็นไฟล์ CSV, Excel หรือ PDF **ถูกจัดให้อยู่ใน Future Scope**
- **เหตุผล:** เพื่อเน้นความสมบูรณ์ของ Core System ในระยะแรก โดยโครงสร้างข้อมูล API `/api/v1/reports/summary` ถูกออกแบบไว้ให้รองรับการนำข้อมูล JSON ไปแปลงเป็น CSV/PDF ในอนาคตได้ทันที

---

## 12. Notification Strategy (กลยุทธ์และการประเมินขอบเขตระบบแจ้งเตือน - Phase 15 Evaluation)

### 12.1 Notification Scope Classification (การจัดกลุ่มขอบเขต MVP vs Future Scope)
- **MVP Scope Evaluation (การประเมินระยะ MVP):** **ไม่มีการพัฒนา Notification Engine ในระบบระยะ MVP** เนื่องจากระบบเป็น Personal Financial Tracking Tool ที่ผู้ใช้เป็นผู้ป้อนข้อมูลเข้าสู่ระบบด้วยตนเอง การเพิ่ม Background Notification Service หรือ Push Notification Server ในระยะนี้จะเพิ่มความซับซ้อนทางสถาปัตยกรรม (Over-engineering) โดยไม่จำเป็น และอาจกระทบต่อประสิทธิภาพโดยรวม
- **Acceptance Verification:** ไม่มี Code หรือ Module แจ้งเตือนหลุดเข้ามาใน codebase ระยะ MVP
- **Future Scope (เวอร์ชัน 2.0):** บันทึกข้อกำหนดระบบแจ้งเตือนตามเงื่อนไข (Conditional Notifications) สำหรับการพัฒนาในอนาคต

### 12.2 Future Notification Rules (ข้อกำหนดระบบแจ้งเตือนเวอร์ชัน 2.0)

| Notification Trigger | Condition | Priority | Message Template | Action | Target Version |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **Deficit Alert** | รายจ่ายรวมในเดือนนี้ > รายรับรวม | High | "คำเตือน: ยอดรายจ่ายเดือนนี้สูงกว่ารายรับรวมแล้ว!" | ดู Dashboard สรุป | v2.0 |
| **Inactivity Reminder** | ไม่มีการบันทึกรายการติดต่อกันเกิน 3 วัน | Medium | "อย่าลืมบันทึกรายรับ-รายจ่ายของวันนี้เพื่อติดตามการเงินของคุณ" | เปิดฟอร์มบันทึก | v2.0 |
| **High Single Expense** | มีการบันทึกรายการรายจ่ายเดียว > 10,000 บาท | Low | "บันทึกรายจ่ายรายการใหญ่สำเร็จ: {title} จำนวน ฿{amount}" | ดูรายละเอียดรายการ | v2.0 |
| **Budget Limit Alert** | รายจ่ายในหมวดหมู่เกิน 80% ของงบประมาณ | High | "คำเตือน: หมวดหมู่ {category} ใช้เงินเกิน 80% ของงบประมาณแล้ว" | ปรับงบประมาณ | v2.0 |

---

## 13. Dashboard UX States (Loading, Empty & Error Handling)

### 13.1 Component-level Isolated States
เพื่อ UX ที่ราบรื่น หาก Widget/Chart ตัวใดตัวหนึ่งโหลดล้มเหลว จะไม่ทำให้ทั้งหน้า Dashboard พัง (Isolated Error Boundaries)

- **Loading State:** แสดง MUI `Skeleton` การ์ด และ Skeleton กราฟวงกลม ขณะรอ API
- **Empty State (เมื่อยังไม่มีข้อมูลบันทึก):**
  - summary Cards แสดง `฿0.00`
  - Donut Chart แสดงวงกลมสีเทาโปร่งใส พร้อมข้อความ "ยังไม่มีข้อมูลการใช้จ่าย เริ่มบันทึกรายการแรก"
  - Recent Transactions แสดงภาพเวกเตอร์กระเป๋าเงินว่าง พร้อมปุ่ม "+ บันทึกรายการใหม่"
- **Error State:** แสดง Alert Banner พร้อมปุ่ม "ลองใหม่อีกครั้ง (Retry)" ในระดับ Widget ที่เกิด Error

---

## 14. Dashboard-to-API Mapping Matrix

| Dashboard Component | Data Metric Required | API Endpoint Called | Method | Query Parameters |
| :--- | :--- | :--- | :---: | :--- |
| **Summary Cards** | Total Income, Total Expense, Net Balance | `/api/v1/dashboard/summary` | GET | `start_date`, `end_date` |
| **Expense Donut Chart** | Expense Breakdown by Category | `/api/v1/dashboard/charts` | GET | `start_date`, `end_date` |
| **Income Donut Chart** | Income Breakdown by Category | `/api/v1/dashboard/charts` | GET | `start_date`, `end_date` |
| **Trend Bar Chart** | Daily/Monthly Income vs Expense Series | `/api/v1/dashboard/charts` | GET | `start_date`, `end_date`, `view=daily` |
| **Recent Transactions** | List of 5 Latest Transactions | `/api/v1/transactions` | GET | `limit=5`, `sort=date`, `order=desc` |

---

## 15. Report-to-API Mapping Matrix

| Report View Component | Data Required | API Endpoint Called | Method | Query Parameters |
| :--- | :--- | :--- | :---: | :--- |
| **Report Summary Header** | Totals & Balance | `/api/v1/reports/summary` | GET | `start_date`, `end_date` |
| **Category Report Table** | Category Subtotals | `/api/v1/reports/summary` | GET | `start_date`, `end_date` |
| **Detailed Report List** | Filtered Transactions List | `/api/v1/transactions` | GET | `start_date`, `end_date`, `page`, `limit` |

---

## 16. Requirement Mapping Matrix

| Requirement ID | Dashboard / Report Feature | API & Data Source |
| :--- | :--- | :--- |
| `FR-DASH-001` | Summary Cards (Income, Expense, Balance) | `GET /api/v1/dashboard/summary` |
| `FR-DASH-002` | Expense Category Donut Chart | `GET /api/v1/dashboard/charts` |
| `FR-DASH-003` | Daily/Monthly Trend Charts | `GET /api/v1/dashboard/charts` |
| `FR-HIST-001` | Recent Transactions & History Table | `GET /api/v1/transactions` |

---

## 17. Performance Considerations
1. **Database Indexing:** ใช้อินเด็กซ์ `idx_tx_user_type_date` `(user_id, type, date)` ใน MySQL เพื่อให้คำนวณ `SUM(amount)` สำหรับ Dashboard ได้รวดเร็วระดับ millisecond
2. **Aggregated API Response:** รวมยอดสรุปทั้ง 3 การ์ดไว้ในคำขอ API เดียว (`/api/v1/dashboard/summary`) เพื่อลดจำนวน RTT HTTP Requests

---

## 18. Security & Data Privacy Enforcement
- **User Data Isolation:** ทุก Query ของ Dashboard และ Report ถูกบังคับสิทธิ์ด้วย `WHERE user_id = :authenticated_user_id`
- **No Cross-account Exposure:** ห้ามรวมหรือแสดงสถิติของผู้ใช้อื่นบน Dashboard โดยเด็ดขาด

---

## 19. Responsive Design Guidelines
* **Desktop (≥ 1024px):** 3 Summary Cards เรียงแนวนอน, Donut Chart และ Trend Bar Chart แสดงเคียงข้างกัน (2 Columns)
* **Tablet (768px - 1023px):** 3 Summary Cards (2 Top, 1 Bottom), Charts เรียงแนวตั้ง (1 Column Stack)
* **Mobile (< 768px):** Cards เรียงแนวตั้ง (1 Column), Charts ปรับขนาด Responsive อัตโนมัติ, Recent Transactions แสดงผลแบบย่อ

---

## 20. Future Scope Features
- ❌ ระบบเตือนเมื่อใช้เงินเกินงบประมาณ (Budget Limit Alerts)
- ❌ การส่งออกรายงานเป็น CSV / Excel / PDF
- ❌ การเปรียบเทียบสถิติย้อนหลังแบบปีต่อปี (Year-over-Year Analytics)

---

## 21. Open Questions & Assumptions

### Assumptions
1. Default Date Period ของ Dashboard และ Report คือ **เดือนปัจจุบัน (Current Month)**
2. รายการทางการเงินทั้งหมดใช้หน่วยเงินบาท (THB) เป็นสกุลเงินมาตรฐาน

### Open Questions
> [!IMPORTANT]
> 1. **Default Chart View:** บนอุปกรณ์มือถือ ควรเลือกแสดงกราฟรายจ่ายตามหมวดหมู่ (Donut Chart) เป็นหลักก่อน กราฟแนวโน้มรายวัน (Bar Chart) หรือไม่?

---

## 22. Consistency Verification Check
- ✅ `01-system-overview.md` ถึง `07-frontend-pages.md` -> `08-dashboard-report-notification.md`: มีความสอดคล้อง 100% ไม่มีข้อขัดแย้งของ API หรือฟีเจอร์

---

## 23. Recommendations
1. **Client-side Formatting Utility:** จัดทำฟังก์ชันกลางสำหรับแปลงตัวเลขจำนวนเงินให้เป็นรูปแบบสกุลเงินไทย เช่น `Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' })`
2. **Empty State Illumination:** เน้นการทำ UI Empty State ที่สวยงามและมีปุ่มทางลัดในการเพิ่มรายการครั้งแรก เพื่อสร้างประสบการณ์ใช้งานแรกเริ่ม (Onboarding UX) ที่ประทับใจ
