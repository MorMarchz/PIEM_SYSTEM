# 07. Frontend Page Structure & UX Architecture Document

**Project Name:** Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)  
**Document Version:** 1.0.0  
**Phase:** Phase 2 - Frontend Architecture & UI/UX Specification  
**Authors:** Senior Frontend Architect, UX/UI Designer & Business Analyst  

---

## 1. Frontend Overview
เอกสารฉบับนี้เป็นการออกแบบสถาปัตยกรรมโครงสร้างหน้าจอ (Page Structure), เส้นทางนำทาง (Routing), เลย์เอาต์ (Layout), การสอดรับกับอุปกรณ์ (Responsive Design) และประสบการณ์ผู้ใช้ (User Experience / UX States) สำหรับ **Personal Income & Expense Management System**

การออกแบบมุ่งเน้นการปฏิบัติตามมาตรฐาน SPA (Single Page Application) โดยใช้ **React 18 + Vite 5 + MUI 5 (Material-UI) + React Router v6** เพื่อสร้างอินเทอร์เฟซที่สวยงาม ทันสมัย ใช้งานง่าย มีการแยกสิทธิ์ข้อมูล (Data Isolation) และรองรับการเชื่อมต่อกับ RESTful API (`06`) ได้อย่างสมบูรณ์

---

## 2. User Roles & Page Access Control
อ้างอิงจากเอกสาร `03-roles-permissions.md` กำหนดบทบาทในการเข้าถึงหน้าจอดังนี้:

1. **Guest (ผู้เยี่ยมชม):** เข้าถึงเฉพาะ Public Routes (หน้า Login, Register)
2. **User (ผู้ใช้งานทั่วไป):** เข้าถึง Protected Routes สำหรับการจัดการโปรไฟล์ รายรับ รายจ่าย หมวดหมู่ Dashboard และรายงานส่วนบุคคล
3. **Admin (ผู้ดูแลระบบ - Future Scope):** ไม่จัดทำหน้าจอ Admin ในระยะ MVP เพื่อรักษาความเรียบง่ายและเน้น Personal Finance

---

## 3. Application Layout Architecture

### 3.1 App Layout Structure
โครงสร้างเลย์เอาต์หลักของแอปพลิเคชันแบ่งเป็น 3 ส่วนหลัก:

```text
+-------------------------------------------------------------------+
|                        Header / Topbar                            |
+-------------------+-----------------------------------------------+
|                   |                                               |
|                   |                                               |
|  Sidebar Menu     |             Main Content Area                 |
|  (Navigation)     |          (Dynamic Router View)                |
|                   |                                               |
|                   |                                               |
+-------------------+-----------------------------------------------+
|                        Footer (Optional)                          |
+-------------------------------------------------------------------+
```

* **Header / Topbar:** แสดงโลโก้โปรเจกต์, ปุ่ม Toggle Drawer (สำหรับ Mobile), เมนูโปรไฟล์ผู้ใช้ และปุ่ม Logout
* **Sidebar (Navigation Drawer):** เมนูหลักในการสลับหน้าจอ (Dashboard, Transactions, Categories, Reports, Profile)
* **Main Content Area:** พื้นที่เรนเดอร์เนื้อหาหลักตาม Route ปัจจุบัน พร้อมการแสดง Notification Toast / Alert

---

## 4. Master Page List & Specification Table (ตารางรวมรายการหน้าจอหลัก)

| Page Name | URL Path | Access Role | Purpose | ข้อมูลที่แสดง | Form / Table Components | Action สำคัญ | Related API Endpoint | Empty State UX | Error State UX |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Login** | `/login` | Guest | เข้าสู่ระบบ | โลโก้, ฟอร์ม Login | Login Form | Submit Login, Switch to Register | `POST /api/v1/auth/login` | N/A | Alert: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" |
| **Register** | `/register` | Guest | สมัครสมาชิก | โลโก้, ฟอร์ม Register | Register Form | Submit Register, Switch to Login | `POST /api/v1/auth/register` | N/A | Alert: "อีเมลนี้ถูกใช้งานแล้ว" |
| **Dashboard** | `/dashboard` | User | ภาพรวมการเงิน | ยอดคงเหลือ, รายรับรวม, รายจ่ายรวม, กราฟ | Summary Cards, Donut Chart, Trend Bar Chart | เปลี่ยนช่วงเวลา, Add Tx Quick Button | `GET /api/v1/dashboard/summary`<br>`GET /api/v1/dashboard/charts` | Empty Card: "ยังไม่มีรายการ" | Alert Banner: "เกิดข้อผิดพลาดในการโหลดข้อมูล" |
| **Transactions**| `/transactions` | User | ประวัติ & ค้นหา | รายการรายรับ-รายจ่ายทั้งหมด | Search Bar, Filter Panel, Data Table | Search, Filter, Add/Edit/Delete Modal | `GET /api/v1/transactions`<br>`DELETE /api/v1/transactions/:id` | "ไม่พบรายการที่ตรงกับตัวกรอง" | Snackbar Error |
| **Add Transaction** | `/transactions/new` | User | เพิ่มรายการใหม่ | ฟอร์มบันทึกข้อมูล | Transaction Form (Type, Amount, Category, Date) | Save, Cancel | `POST /api/v1/transactions`<br>`GET /api/v1/categories` | N/A | Form Helper Text Validation Error |
| **Edit Transaction**| `/transactions/:id/edit`| User | แก้ไขรายการ | ฟอร์มแก้ไขข้อมูล | Transaction Form (Pre-filled) | Save Changes, Cancel | `GET /api/v1/transactions/:id`<br>`PATCH /api/v1/transactions/:id` | N/A | Alert: "ไม่พบรายการที่ต้องการแก้ไข" |
| **Transaction Detail**| `/transactions/:id`| User | ดูรายละเอียด | ข้อมูลรายการเชิงลึก | Detail View Card | Edit, Delete, Back | `GET /api/v1/transactions/:id` | N/A | "ไม่พบรายการ (404 / 403 Forbidden)" |
| **Categories** | `/categories` | User | ดูหมวดหมู่ | รายการหมวดหมู่รายรับ/รายจ่าย | Category Cards / Tabs | Switch Income/Expense Tabs | `GET /api/v1/categories` | "ไม่มีรายการหมวดหมู่" | Snackbar Error |
| **Reports** | `/reports` | User | สรุปรายงาน | สถิติและสรุปสัดส่วนตามหมวดหมู่ | Report Chart & Summary Table | Select Date Range | `GET /api/v1/reports/summary` | "ไม่มีข้อมูลในช่วงเวลาที่เลือก" | Alert Banner Error |
| **Profile** | `/profile` | User | จัดการข้อมูลส่วนตัว | ข้อมูลโปรไฟล์ | Profile Form, Password Form | Update Profile, Change Password, Logout | `GET /api/v1/users/me`<br>`PATCH /api/v1/users/me` | N/A | Alert: "รหัสผ่านปัจจุบันไม่ถูกต้อง" |

---

## 5. Routing Structure
กำหนดสถาปัตยกรรม Route ใน React Router:

```text
Public Routes (Guest Only):
├── /login
└── /register

Protected Routes (Authenticated User Only - Wrapped with Layout):
├── / (Redirect to /dashboard)
├── /dashboard
├── /transactions
├── /transactions/new
├── /transactions/:id
├── /transactions/:id/edit
├── /categories
├── /reports
└── /profile

Fallback Route:
└── * (404 Not Found Page)
```

---

## 6. Authentication Pages Design
- **Single Layout:** ใช้ Centered Card Container สไตล์ Glassmorphism บนพื้นหลัง Gradient
- **Seamless Switch:** สามารถสลับระหว่างหน้า Login และ Register ได้ผ่านการคลิกลิงก์โดยไม่ต้องเปลี่ยนหน้าหลัก
- **Validation:** ตรวจสอบความถูกต้องของอินพุตในระดับ Client-side (Real-time Helper Text) ก่อนส่ง API

---

## 7. Dashboard Design Specification
- **Default Period:** เดือนปัจจุบัน (Current Month: 1st of month to Current Date)
- **Component Breakdown:**
  1. **Summary Cards Grid:** 3 การ์ด (Net Balance [ฟ้า], Total Income [เขียว], Total Expense [แดง])
  2. **Charts Section:**
     - Donut Chart: สัดส่วนรายจ่ายแยกตามหมวดหมู่ (%)
     - Bar/Line Chart: แนวโน้มรายรับ-รายจ่าย รายวัน/รายเดือน
  3. **Recent Transactions Component:** รายการล่าสุด 5 รายการ พร้อมปุ่มด่วนสำหรับดูประวัติทั้งหมด

---

## 8. Transaction Pages Strategy

### 8.1 Single Form Strategy for Income & Expense
- **การตัดสินใจออกแบบ:** ใช้หน้าฟอร์มรวม **`/transactions/new`** โดยมีปุ่ม **Type Selector Tab (+ รายรับ / - รายจ่าย)** อยู่ด้านบนสุดของฟอร์ม
- *เหตุผล:* ช่วยให้โค้ด React สั้น กระชับ มีการ Re-use Form Component เดียวกัน ลดความซ้ำซ้อน และเพิ่มความสะดวกให้แก่ผู้ใช้งาน

---

## 9. Category Management Design
- แสดงหมวดหมู่แบบแยก Tab: **รายรับ (Income Categories)** และ **รายจ่าย (Expense Categories)**
- แสดงผลด้วย MUI Card / Grid รายการ พร้อมไอคอนและสีประจำหมวดหมู่
- ในระยะแรกแสดงผลแบบ Read-only (หมวดหมู่มาตรฐานของระบบ)

---

## 10. Reports Page Specification
- รองรับการเลือกช่วงเวลา: **เดือนนี้, เดือนที่แล้ว, 3 เดือนล่าสุด, ปีนี้, Custom Date Range**
- แสดงผลสรุปภาพรวม สัดส่วนตามหมวดหมู่ และตารางแจกแจงรายรับ-รายจ่ายเชิงลึก

---

## 11. Profile Page Specification
- แบ่งฟอร์มออกเป็น 2 ส่วนชัดเจน:
  1. **ข้อมูลส่วนตัว:** แก้ไขชื่อแสดงผล (`display_name`)
  2. **เปลี่ยนรหัสผ่าน:** ต้องระบุรหัสผ่านปัจจุบัน (`current_password`) และรหัสผ่านใหม่ (`new_password`)

---

## 12. Admin Pages Evaluation
- **ข้อสรุป:** ไม่ออกแบบและไม่สร้างหน้าจอสำหรับ Admin ในระยะแรก เพื่อความซ้ำซ้อนขั้นต่ำ และรักษาจุดประสงค์ของแอปพลิเคชันส่วนบุคคล

---

## 13. Page-to-API Mapping Table

| Page Name | API Endpoint Called | Method | Purpose |
| :--- | :--- | :---: | :--- |
| Login | `/api/v1/auth/login` | POST | ยืนยันตัวตนและรับ Access Token |
| Register | `/api/v1/auth/register` | POST | สร้างบัญชีผู้ใช้ใหม่ |
| Dashboard | `/api/v1/dashboard/summary` | GET | ดึงยอดสรุปรายรับ รายจ่าย ยอดคงเหลือ |
| Dashboard | `/api/v1/dashboard/charts` | GET | ดึงข้อมูลสถิติมารูปแบบสัดส่วนและแนวโน้ม |
| Transactions | `/api/v1/transactions` | GET | ดึงรายการประวัติพร้อมการค้นหา/กรอง |
| Add Transaction | `/api/v1/categories` | GET | ดึงรายการหมวดหมู่เพื่อแสดงใน Dropdown |
| Add Transaction | `/api/v1/transactions` | POST | ส่งข้อมูลบันทึกรายการใหม่ |
| Edit Transaction | `/api/v1/transactions/:id` | GET & PATCH | ดึงข้อมูลเดิมมาเติมฟอร์ม และส่งข้อมูลอัปเดต |
| Delete Transaction| `/api/v1/transactions/:id` | DELETE | ลบรายการออกจากระบบ |
| Profile | `/api/v1/users/me` | GET & PATCH | ดึงและแก้ไขข้อมูลโปรไฟล์/รหัสผ่าน |

---

## 14. Page-to-Requirement Mapping Matrix

| Requirement ID | Target Page Component | Related API Endpoint |
| :--- | :--- | :--- |
| `FR-AUTH-001` | Register Page | `POST /api/v1/auth/register` |
| `FR-AUTH-002` | Login Page | `POST /api/v1/auth/login` |
| `FR-INC-001` | Add Transaction Form | `POST /api/v1/transactions` |
| `FR-EXP-001` | Add Transaction Form | `POST /api/v1/transactions` |
| `FR-DASH-001` | Dashboard Summary Cards | `GET /api/v1/dashboard/summary` |
| `FR-DASH-002` | Dashboard Category Chart | `GET /api/v1/dashboard/charts` |
| `FR-SRCH-001` | Transactions Filter Panel | `GET /api/v1/transactions?search=...` |

---

## 15. UX States Specification
ทุกหน้าจอที่มีการดึงข้อมูลจาก API ต้องรองรับ 7 UX States:
1. **Loading State:** แสดง MUI `CircularProgress` หรือ `Skeleton` ขณะรอข้อมูล
2. **Success State:** แสดงผลข้อมูลสมบูรณ์แบบ
3. **Empty State:** แสดงภาพเวกเตอร์/ไอคอน พร้อมข้อความแนะนำเมื่อยังไม่มีข้อมูล
4. **Error State:** แสดง MUI `Alert` Banner พร้อมปุ่ม "ลองใหม่อีกครั้ง (Retry)"
5. **Unauthorized State:** รีไดเรกต์ไปหน้า `/login` พร้อมแสดง Toast เตือน
6. **Forbidden State:** แสดงหน้าเตือนสิทธิ์การเข้าถึงเมื่อพยายามดูข้อมูลผู้อื่น
7. **Not Found State:** แสดงหน้า 404 เมื่อระบุ URL/ID ไม่ถูกต้อง

---

## 16. User Navigation Flow

```text
[Guest User]
   │
   ├─► /login ──► เข้าสู่ระบบสำเร็จ
   └─► /register ──► สมัครสมาชิกสำเร็จ ──► /login
                                              │
[Authenticated User] ◄────────────────────────┘
   │
   ├──► /dashboard ──► คลิก "+ บันทึกใหม่" ──► /transactions/new ──► บันทึกสำเร็จ ──► /dashboard
   ├──► /transactions ──► คลิก "แก้ไข" ────► /transactions/:id/edit ──► สำเร็จ ──► /transactions
   ├──► /categories
   ├──► /reports
   └──► /profile ──► คลิก "ออกจากระบบ" ──► /login
```

---

## 17. Component Planning & Conceptual MUI Mapping

- **Header / Navigation:** `AppBar`, `Toolbar`, `Drawer`, `IconButton`, `Avatar`, `Menu`, `MenuItem`
- **Dashboard & Analytics:** `Grid`, `Card`, `CardContent`, `Typography`, `Skeleton`
- **Data Display & Tables:** `Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell`, `Chip`, `Pagination`
- **Forms & Inputs:** `TextField`, `Select`, `MenuItem`, `FormControl`, `Button`, `ToggleButton`, `ToggleButtonGroup`
- **Feedback & Dialogs:** `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions`, `Snackbar`, `Alert`

---

## 18. Responsive Design Strategy
* **Desktop (≥ 1024px):** Permanent Sidebar, Multi-column Grid Layout (3 Summary Cards, Side-by-side Charts)
* **Tablet (768px - 1023px):** Collapsible Responsive Drawer, 2-column Grid Layout
* **Mobile (< 768px):** Temporary Hamburger Drawer, Single-column Stack Layout, Horizontal Scroll Tables, Large Touch Target Buttons (≥ 48px)

---

## 19. Accessibility Guidelines (a11y)
* **Keyboard Navigation:** รองรับการใช้กดปุ่ม `Tab` เพื่อสลับการเลือกรวมทั้งฟอร์มและเมนู
* **Form Labels:** กำหนด `aria-label` และ `id` ให้ทุก Input Fields
* **Color Contrast:** สีข้อความและพื้นหลังมีค่า Contrast Ratio ≥ 4.5:1 ตามมาตรฐาน WCAG 2.1 AA

---

## 20. Frontend Security Considerations
* **Client Token Storage:** เก็บ Access Token ไว้ใน Memory State (เช่น React Context / Redux) และเก็บ Refresh Token ใน HTTP-Only Cookie
* **Route Guarding:** ใช้องค์ประกอบ `<ProtectedRoute>` ตรวจสอบการยึด Token ก่อนเรนเดอร์หน้าจอเสมอ
* **No Trust on Frontend:** ถือว่าระบบความปลอดภัยหลักขึ้นอยู่กับการตรวจสอบของ Backend API เป็นสำคัญ

---

## 21. Future Scope Features
- ❌ การส่งออกรายงานเป็น CSV / Excel / PDF
- ❌ การตั้งค่าลิมิตงบประมาณประจำเดือน (Monthly Budget Limits)
- ❌ การแนบไฟล์รูปภาพใบเสร็จ
- ❌ การรองรับหลายสกุลเงิน (Multi-currency)

---

## 22. Open Questions & Assumptions

### Assumptions
1. ใช้ฟอร์มเดียวกันสำหรับทั้งรายรับและรายจ่ายในหน้า `/transactions/new` เพื่อ UX ที่ดีที่สุด
2. Default Date Filter ของ Dashboard คือ 1 เดือนปัจจุบัน

### Open Questions
> [!IMPORTANT]
> 1. **Modal vs Page Form:** สำหรับฟอร์มเพิ่ม/แก้ไขรายการ ควรทำเป็น Pop-up Modal บนหน้า Dashboard/Transactions หรือแยกเป็น Dedicated Page (`/transactions/new`)? (สถาปัตยกรรมปัจจุบันรองรับทั้งสองแบบ)

---

## 23. Consistency Verification Check
- ✅ `01-system-overview.md` -> `07-frontend-pages.md`: ตรงกันทุกฟีเจอร์หลัก
- ✅ `02-requirements.md` -> `07-frontend-pages.md`: Mapped ครบทุก Requirement ID
- ✅ `06-api-contract.md` -> `07-frontend-pages.md`: Mapped ครบทุก Endpoint โดยไม่มี Endpoint หลอก

---

## 24. Recommendations
1. **Centralized Axios Instance:** สร้าง Axios Service File เพื่อตั้งค่า `baseURL: '/api/v1'` และ Interceptors ไว้ในจุดเดียว
2. **Reusable Form Component:** สร้าง `<TransactionForm>` component ที่สามารถนำมาเปิดใช้งานร่วมกันได้ทั้งในหน้าสร้างใหม่ (`/transactions/new`) และหน้าแก้ไข (`/transactions/:id/edit`)
