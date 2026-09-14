# PI&EM System — UI Detail Document
> เอกสารอธิบายโครงสร้าง Layout, หน้า, Component และ Modal ทั้งหมดในระบบ
> จัดทำเพื่อใช้เป็น Reference ในการออกแบบ UI ใหม่

---

## สารบัญ
1. [Design System & Theme](#1-design-system--theme)
2. [Layout หลัก (AppLayout)](#2-layout-หลัก-applayout)
3. [หน้า Login](#3-หน้า-login)
4. [หน้า Register](#4-หน้า-register)
5. [หน้า Dashboard](#5-หน้า-dashboard)
6. [หน้า รายการการเงิน (Transactions)](#6-หน้า-รายการการเงิน-transactions)
7. [หน้า เพิ่มรายการ (Add Transaction)](#7-หน้า-เพิ่มรายการ-add-transaction)
8. [หน้า แก้ไขรายการ (Edit Transaction)](#8-หน้า-แก้ไขรายการ-edit-transaction)
9. [หน้า หมวดหมู่ (Categories)](#9-หน้า-หมวดหมู่-categories)
10. [หน้า รายงานสรุป (Reports)](#10-หน้า-รายงานสรุป-reports)
11. [หน้า โปรไฟล์ส่วนตัว (Profile)](#11-หน้า-โปรไฟล์ส่วนตัว-profile)
12. [Modal / Dialog ทั้งหมด](#12-modal--dialog-ทั้งหมด)
13. [Component ย่อย](#13-component-ย่อย)

---

## 1. Design System & Theme

### Color Palette (ปัจจุบัน)
| ชื่อ | Hex | ใช้กับ |
|---|---|---|
| Background หลัก | `#0F172A` | พื้นหลังทั้งแอพ |
| Background Card | `#1E293B` | Paper, Card, Drawer |
| Border | `rgba(255,255,255,0.08)` | ขอบ Card ทั้งหมด |
| Text Primary | `#F8FAFC` | หัวข้อ, ชื่อ |
| Text Secondary | `#94A3B8` | คำอธิบาย, Label |
| Primary (Blue) | MUI `primary` (ค่า default) | ปุ่มหลัก, Active Nav |
| Income (Green) | `#10B981` | รายรับ |
| Expense (Red) | `#EF4444` | รายจ่าย |
| Net Balance (Indigo) | `#6366F1` | คงเหลือ |
| Warning (Amber) | `#F59E0B` | Savings Rate |

### Typography
- Font: MUI default (Roboto)
- หัวข้อหน้า: `variant="h4"`, `fontWeight: 700`
- หัวข้อ Card: `variant="h6"`, `fontWeight: 700`
- ข้อความปกติ: `variant="body2"`

### Border Radius
- Card / Paper: `borderRadius: 3` (24px)
- Button: `borderRadius: 2.5`
- Input: MUI default

---

## 2. Layout หลัก (AppLayout)

**ไฟล์:** `frontend/src/components/layout/AppLayout.jsx`
**ใช้กับ:** ทุกหน้าหลังเข้าสู่ระบบ (ยกเว้น Login, Register)

### โครงสร้าง

```
┌─────────────────────────────────────────────────────┐
│  AppBar (Top Bar)                                   │
│  ┌──────────────┐ Logo + Hamburger │ Bell │ Avatar  │
├──┴──────────────┴─────────────────────────────────  │
│  Sidebar (Drawer)     │  Main Content Area          │
│  ┌────────────────┐   │                             │
│  │ 🏦 PI&EM System│   │  <Outlet /> (หน้าต่างๆ)   │
│  │   v1.0.0       │   │                             │
│  │────────────────│   │                             │
│  │ 📊 แดชบอร์ด   │   │                             │
│  │ 🧾 รายการการเงิน│  │                             │
│  │ 🏷️ หมวดหมู่  │   │                             │
│  │ 📈 รายงานสรุป │   │                             │
│  │ 👤 โปรไฟล์    │   │                             │
│  │────────────────│   │                             │
│  │ PI&EM System   │   │                             │
│  │ v1.0.0 (Chip)  │   │                             │
│  └────────────────┘   │                             │
│  User Info (Bottom)   │                             │
└───────────────────────┴─────────────────────────────┘
```

### รายละเอียด AppBar (Top)
- ซ้าย: ไอคอน Hamburger (mobile) + Logo ชื่อระบบ
- ขวา: ไอคอนกระดิ่ง (Notification placeholder) + Avatar ชื่อย่อ User

### รายละเอียด Sidebar
- **Width:** 260px
- **Brand Header:** ไอคอน `AccountBalanceWalletIcon` + "PI&EM System" + Subtitle "Finance Management"
- **Navigation Items (5 รายการ):**
  1. แดชบอร์ด → `/dashboard`
  2. รายการการเงิน → `/transactions`
  3. หมวดหมู่ → `/categories`
  4. รายงานสรุป → `/reports`
  5. โปรไฟล์ส่วนตัว → `/profile`
- **Active State:** Background highlight + สี Primary
- **Bottom:** Chip แสดงเวอร์ชัน `App v1.0.0` + ข้อมูล User (ชื่อ, Email)

### Avatar Dropdown Menu
- เปิดเมื่อกด Avatar มุมขวาบน
- แสดง: ชื่อ User, Email
- MenuItem: "โปรไฟล์ส่วนตัว", "ออกจากระบบ"

### Responsive
- Mobile (<md): Sidebar เป็น Temporary Drawer (ปิด-เปิดด้วย Hamburger)
- Desktop (≥md): Sidebar แสดงถาวร

---

## 3. หน้า Login

**ไฟล์:** `frontend/src/pages/LoginPage.jsx`
**Route:** `/login`

### Layout
- หน้าเต็ม (Full Page) ไม่มี Sidebar
- Center กลางหน้าจอ
- พื้นหลัง: Gradient `#0F172A` → `#1E293B`

### องค์ประกอบ
```
┌─────────────────────────────────┐
│  🏦 ไอคอน + ชื่อระบบ           │
│                                 │
│  [   Email TextField        ]   │
│  [   Password TextField 👁  ]   │
│                                 │
│  [    ปุ่ม เข้าสู่ระบบ     ]   │
│                                 │
│  ยังไม่มีบัญชี? สมัครสมาชิก   │
│                                 │
│  ─────── App v1.0.0 ─────────  │
└─────────────────────────────────┘
```

### Fields
| Field | Type | Validation |
|---|---|---|
| Email | `type="email"` | Required |
| Password | `type="password"` + Toggle ดูรหัส | Required |

### States
- Loading: ปุ่มแสดง `CircularProgress`
- Error: `Alert` สีแดงด้านบน Form

---

## 4. หน้า Register

**ไฟล์:** `frontend/src/pages/RegisterPage.jsx`
**Route:** `/register`

### Layout
- เหมือน Login (Full Page, Centered)

### องค์ประกอบ
```
┌─────────────────────────────────┐
│  🏦 ไอคอน + "สมัครสมาชิก"     │
│                                 │
│  [   ชื่อที่ต้องการแสดง    ]   │
│  [   Email                 ]   │
│  [   Password 👁            ]   │
│  [   Confirm Password 👁    ]   │
│                                 │
│  [    ปุ่ม สมัครสมาชิก     ]   │
│                                 │
│  มีบัญชีแล้ว? เข้าสู่ระบบ     │
└─────────────────────────────────┘
```

### Fields
| Field | Type | Validation |
|---|---|---|
| Display Name | text | Required |
| Email | email | Required, format |
| Password | password + Toggle | Required, min 8 chars |
| Confirm Password | password + Toggle | ต้องตรงกับ Password |

### States
- Loading: ปุ่มแสดง `CircularProgress`
- Error: `Alert` สีแดง
- Success: Redirect → `/login`

---

## 5. หน้า Dashboard

**ไฟล์:** `frontend/src/pages/DashboardPage.jsx`
**Route:** `/dashboard`

### Layout
```
┌─────────────────────────────────────────────────────┐
│ สวัสดีคุณ [ชื่อ] 👋        [🔄 รีเฟรชข้อมูล]     │
│ สรุปภาพรวมสถิติทางการเงิน                         │
├─────────────────────────────────────────────────────┤
│ [KPI Card 1] [KPI Card 2] [KPI Card 3] [KPI Card 4] │
│ รายรับรวม  รายจ่ายรวม   คงเหลือ    จำนวนรายการ   │
├─────────────────────────────────────────────────────┤
│ [Donut Chart: หมวดหมู่] │ [Bar Chart: แนวโน้ม]    │
│ 5 cols                   │ 7 cols                  │
├─────────────────────────────────────────────────────┤
│ [ตารางรายการล่าสุด 5 รายการ]      [ดูทั้งหมด →]  │
│ วันที่ │ ชื่อรายการ │ หมวดหมู่ │ จำนวนเงิน        │
└─────────────────────────────────────────────────────┘
```

### KPI Cards (4 ใบ)
1. **รายรับรวม** — สีเขียว `#10B981` + ไอคอน ArrowUpward
2. **รายจ่ายรวม** — สีแดง `#EF4444` + ไอคอน ArrowDownward
3. **เงินคงเหลือ** — สี Primary Blue
4. **จำนวนธุรกรรม** — สีม่วง `#8B5CF6`

### Charts
- **Donut Chart (ซ้าย 5/12):** สัดส่วนรายจ่ายตามหมวดหมู่ (Recharts PieChart + innerRadius)
- **Bar Chart (ขวา 7/12):** แนวโน้มรายรับ-รายจ่ายรายวัน (Recharts BarChart, 2 Bar: income=เขียว, expense=แดง)

### ตาราง Recent Transactions
- 5 รายการล่าสุด
- Columns: วันที่ | ชื่อรายการ | หมวดหมู่ (Chip) | จำนวนเงิน (+ สีเขียว / - สีแดง)
- ปุ่ม "ดูทั้งหมด →" นำทางไป `/transactions`

### States
- Loading: `CircularProgress` แทนที่ทุก Section
- Empty: ข้อความ "ยังไม่มีข้อมูล" พร้อมไอคอน placeholder

### API ที่เรียก
- `GET /dashboard/summary`
- `GET /dashboard/charts`
- `GET /transactions?limit=5`

---

## 6. หน้า รายการการเงิน (Transactions)

**ไฟล์:** `frontend/src/pages/TransactionsPage.jsx`
**Route:** `/transactions`

### Layout
```
┌─────────────────────────────────────────────────────┐
│ รายการการเงิน              [+ เพิ่มรายการใหม่]     │
│ จัดการรายรับ-รายจ่าย                               │
├─────────────────────────────────────────────────────┤
│ Filter Panel:                                       │
│ [🔍 ค้นหา] [ประเภท ▾] [หมวดหมู่ ▾]              │
│ [วันที่เริ่ม] [วันที่สิ้นสุด] [ล้างตัวกรอง]      │
├─────────────────────────────────────────────────────┤
│ ตารางรายการ                                        │
│ วันที่ │ ชื่อ │ หมวดหมู่ │ หมายเหตุ │ จำนวน │ ✏️🗑️│
│ ─────────────────────────────────────────────────  │
│ (rows...)                                          │
├─────────────────────────────────────────────────────┤
│                    [Pagination]                     │
└─────────────────────────────────────────────────────┘
```

### Filter Panel
| Field | Type | ฟังก์ชัน |
|---|---|---|
| ค้นหา | text + SearchIcon | ค้นหาจากชื่อรายการ |
| ประเภท | Select: ทั้งหมด/รายรับ/รายจ่าย | กรองตามประเภท |
| หมวดหมู่ | Select (dynamic) | กรองตามหมวดหมู่ |
| วันที่เริ่มต้น | type="date" | กรองช่วงวันที่ |
| วันที่สิ้นสุด | type="date" | กรองช่วงวันที่ |
| ปุ่มล้างตัวกรอง | IconButton `FilterAltOffIcon` | Reset ทุก Filter |

### ตาราง
| Column | รายละเอียด |
|---|---|
| วันที่ | format: `DD/MM/YYYY` |
| ชื่อรายการ | fontWeight 600 |
| หมวดหมู่ | `Chip` สี custom |
| หมายเหตุ | text หรือ `-` |
| จำนวนเงิน | `+xxx ฿` สีเขียว / `-xxx ฿` สีแดง |
| Actions | ✏️ Edit | 🗑️ Delete |

### Pagination
- แสดงจำนวน Items ทั้งหมด
- MUI `Pagination` Component
- Default: 10 items/page

### API ที่เรียก
- `GET /transactions` (พร้อม query params: page, limit, search, type, category_id, start_date, end_date)
- `GET /categories` (สำหรับ Filter dropdown)
- `DELETE /transactions/:id`

---

## 7. หน้า เพิ่มรายการ (Add Transaction)

**ไฟล์:** `frontend/src/pages/AddTransactionPage.jsx`
**Component:** `frontend/src/components/transactions/TransactionForm.jsx`
**Route:** `/transactions/add`

### Layout
```
┌─────────────────────────────────┐
│  เพิ่มรายการใหม่               │
│                                 │
│  [รายรับ (+)] [รายจ่าย (-)]    │ ← ToggleButtonGroup
│                                 │
│  [  ชื่อรายการ *            ]  │
│  [  จำนวนเงิน *  ฿] [วันที่ *] │
│  [  หมวดหมู่ (dropdown)     ]  │
│  [  หมายเหตุ (textarea)     ]  │
│                                 │
│  [ยกเลิก] [บันทึกรายการ]       │
└─────────────────────────────────┘
```

### Fields
| Field | Type | Validation |
|---|---|---|
| ประเภท | ToggleButtonGroup (income/expense) | Required |
| ชื่อรายการ | text | Required |
| จำนวนเงิน | number + InputAdornment "฿" | Required, > 0 |
| วันที่ | type="date" | Required |
| หมวดหมู่ | Select (กรองตามประเภทที่เลือก) | Optional |
| หมายเหตุ | multiline textarea (4 rows) | Optional |

### Logic
- เมื่อเปลี่ยน ประเภท → ดึง categories ใหม่ตามประเภท + clear categoryId
- Submit → `POST /transactions` → Redirect `/transactions`

---

## 8. หน้า แก้ไขรายการ (Edit Transaction)

**ไฟล์:** `frontend/src/pages/EditTransactionPage.jsx`
**Component:** `frontend/src/components/transactions/TransactionForm.jsx` (mode="edit")
**Route:** `/transactions/:id/edit`

### Layout
- เหมือน Add Transaction แต่ title = "แก้ไขรายการ"
- Form ถูก Pre-fill ด้วยข้อมูลเดิม

### Logic
- Load ข้อมูลจาก `GET /transactions/:id`
- Submit → `PATCH /transactions/:id` → Redirect `/transactions`

---

## 9. หน้า หมวดหมู่ (Categories)

**ไฟล์:** `frontend/src/pages/CategoriesPage.jsx`
**Route:** `/categories`

### Layout
```
┌─────────────────────────────────────────────────────┐
│ หมวดหมู่การเงินมาตรฐาน    [+ เพิ่มหมวดหมู่ใหม่]  │
│ หมวดหมู่สำหรับจัดกลุ่ม...                         │
├─────────────────────────────────────────────────────┤
│ [ทั้งหมด (13)] [หมวดหมู่รายรับ (5)] [รายจ่าย (8)] │ ← Tabs
├─────────────────────────────────────────────────────┤
│ Grid Cards (4 columns on lg, 3 on md, 2 on sm)      │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ 🟢 [Icon]    │ │ 🔴 [Icon]    │ │ ...          │ │
│ │ ชื่อหมวดหมู่│ │ ชื่อหมวดหมู่│ │              │ │
│ │ [รายรับ]    │ │ [รายจ่าย]   │ │              │ │
│ │       ✏️ 🗑️ │ │       ✏️ 🗑️ │ │       ✏️ 🗑️ │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Category Card
- Avatar สีตามหมวดหมู่ + Icon
- ชื่อหมวดหมู่
- Chip: "รายรับ" (เขียว) หรือ "รายจ่าย" (แดง)
- Actions: ✏️ Edit, 🗑️ Delete

### API ที่เรียก
- `GET /categories`
- `POST /categories`
- `PATCH /categories/:id`
- `DELETE /categories/:id`

---

## 10. หน้า รายงานสรุป (Reports)

**ไฟล์:** `frontend/src/pages/ReportsPage.jsx`
**Route:** `/reports`

### Layout
```
┌─────────────────────────────────────────────────────┐
│ รายงานและสถิติทางการเงิน    [📅 เลือกเดือน YYYY-MM]│
│ สรุปสถิติเชิงลึก...                                │
├─────────────────────────────────────────────────────┤
│ [รายรับ/เดือน] [รายจ่าย/เดือน] [คงเหลือ] [Savings%]│
├─────────────────────────────────────────────────────┤
│ [Bar Chart รายวัน: 7/12]  │ [ตาราง Category: 5/12] │
│ เปรียบเทียบรายรับ-รายจ่าย│ สัดส่วนรายจ่ายตามหมวด │
│ รายวันประจำเดือน          │ ชื่อ │ จำนวน │ สัดส่วน│
│                            │ + LinearProgress Bar  │
└─────────────────────────────────────────────────────┘
```

### KPI Cards (4 ใบ)
1. รายรับประจำเดือน — สีเขียว
2. รายจ่ายประจำเดือน — สีแดง
3. เงินคงเหลือประจำเดือน — สี Indigo
4. อัตราการออม (Savings Rate) — สี Amber

### Filter
- Month Picker: `type="month"` → แปลงเป็น `start_date` / `end_date`

### Charts
- **Bar Chart:** รายรับ vs รายจ่าย รายวัน (แกน X = วันที่, แกน Y = จำนวนเงิน)
- **Category Table:** รายจ่ายแยกตามหมวดหมู่ + LinearProgress + Chip แสดง %

### API ที่เรียก
- `GET /reports/summary?start_date=&end_date=`
- `GET /dashboard/charts?start_date=&end_date=&view=daily`

---

## 11. หน้า โปรไฟล์ส่วนตัว (Profile)

**ไฟล์:** `frontend/src/pages/ProfilePage.jsx`
**Route:** `/profile`

### Layout
```
┌─────────────────────────────────────────────────────┐
│ โปรไฟล์ส่วนตัว                                     │
├─────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────┐  │
│ │ [Avatar ใหญ่] ชื่อ User   [App v1.0.0 Chip]  │  │
│ │               อีเมล:                          │  │
│ │               สิทธิ์การใช้งาน: Standard User  │  │
│ └────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│ Section 1: แก้ไขข้อมูลส่วนตัว                      │
│ [อีเมล (disabled)] [ชื่อที่ต้องการแสดง *]          │
│                          [บันทึกการเปลี่ยนแปลง]    │
├─────────────────────────────────────────────────────┤
│ Section 2: เปลี่ยนรหัสผ่าน                         │
│ [รหัสผ่านปัจจุบัน 👁]                              │
│ [รหัสผ่านใหม่ 👁]  [ยืนยันรหัสผ่านใหม่ 👁]        │
│                               [เปลี่ยนรหัสผ่าน]   │
└─────────────────────────────────────────────────────┘
```

### Section 1: แก้ไขข้อมูล
| Field | Type | รายละเอียด |
|---|---|---|
| Email | text, disabled | แสดงอย่างเดียว ไม่แก้ไขได้ |
| Display Name | text | Editable |

### Section 2: เปลี่ยนรหัสผ่าน
| Field | Type | Validation |
|---|---|---|
| รหัสผ่านปัจจุบัน | password + Toggle | Required |
| รหัสผ่านใหม่ | password + Toggle | Required, min 8 |
| ยืนยันรหัสผ่านใหม่ | password + Toggle | ต้องตรงกัน |

### States
- แต่ละ Section มี Alert แยกกัน (success/error)
- Loading: CircularProgress บนปุ่ม

### API ที่เรียก
- `PATCH /users/me` (แก้ไข display_name)
- `PATCH /users/me/password` (เปลี่ยนรหัสผ่าน)

---

## 12. Modal / Dialog ทั้งหมด

### 12.1 Delete Transaction Dialog
**เปิดจาก:** ปุ่ม 🗑️ ในหน้า Transactions
```
┌─────────────────────────────────┐
│ ยืนยันการลบรายการ              │
│                                 │
│ คุณต้องการลบรายการ             │
│ "[ชื่อรายการ]" ใช่หรือไม่?     │
│ การกระทำนี้ไม่สามารถยกเลิกได้ │
│                                 │
│         [ยกเลิก] [ลบรายการ🔴]  │
└─────────────────────────────────┘
```
- Title: "ยืนยันการลบรายการ"
- ข้อความ: แจ้งชื่อรายการ + เตือนว่ายกเลิกไม่ได้
- ปุ่มลบ: สีแดง (color="error")

---

### 12.2 Create/Edit Category Dialog
**เปิดจาก:** ปุ่ม "+ เพิ่มหมวดหมู่ใหม่" หรือ ✏️ ในหน้า Categories
```
┌─────────────────────────────────┐
│ เพิ่มหมวดหมู่ใหม่ / แก้ไขหมวดหมู่│
│                                 │
│ [ชื่อหมวดหมู่ *            ]   │
│ [ประเภท * ▾ รายรับ/รายจ่าย ]   │
│ [ไอคอน ▾ (เลือกจากรายการ)  ]   │
│                                 │
│ สี: ● ● ● ● ● ● ● (Color Dots) │
│                                 │
│ Preview:                        │
│ [🟢 Avatar] ชื่อหมวดหมู่       │
│             รายรับ/รายจ่าย     │
│                                 │
│      [ยกเลิก] [เพิ่มหมวดหมู่]  │
└─────────────────────────────────┘
```
- Real-time Preview Avatar + ชื่อ + ประเภท
- Color Picker: 13 สีให้เลือก (Dot ขนาด 28px)
- Icon Selector: 13 ไอคอนให้เลือกจาก Dropdown

---

### 12.3 Delete Category Dialog
**เปิดจาก:** ปุ่ม 🗑️ ในหน้า Categories
```
┌─────────────────────────────────┐
│ ยืนยันการลบหมวดหมู่            │
│                                 │
│ คุณต้องการลบหมวดหมู่           │
│ "[ชื่อหมวดหมู่]" ใช่หรือไม่?   │
│                                 │
│ รายการที่ใช้หมวดหมู่นี้จะถูก   │
│ ตั้งเป็น "ไม่ระบุหมวดหมู่"    │
│                                 │
│       [ยกเลิก] [ลบหมวดหมู่🔴]  │
└─────────────────────────────────┘
```

---

### 12.4 Avatar Dropdown Menu (Top Right)
**เปิดจาก:** กด Avatar มุมบนขวาของ AppBar
- แสดงชื่อ User + Email
- Divider
- MenuItem: 👤 "โปรไฟล์ส่วนตัว"
- MenuItem: 🚪 "ออกจากระบบ"

---

## 13. Component ย่อย

### 13.1 SummaryCards
**ไฟล์:** `frontend/src/components/dashboard/SummaryCards.jsx`
- แสดง KPI 4 ใบในหน้า Dashboard
- Props: `summary`, `loading`

### 13.2 DonutChartWidget
**ไฟล์:** `frontend/src/components/dashboard/DonutChartWidget.jsx`
- Pie Chart แสดงสัดส่วนรายจ่ายตามหมวดหมู่
- Props: `categories`, `loading`
- Empty State: ไอคอน + ข้อความ "ยังไม่มีข้อมูล"

### 13.3 TransactionForm
**ไฟล์:** `frontend/src/components/transactions/TransactionForm.jsx`
- Form เดียวใช้ได้ทั้ง Create และ Edit mode
- Props: `mode`, `initialData`, `transactionId`

### 13.4 AppLayout
**ไฟล์:** `frontend/src/components/layout/AppLayout.jsx`
- Wrapper Layout สำหรับทุกหน้าหลัง Login

---

## 14. สรุป Routes ทั้งหมด

| Route | หน้า | ต้อง Login |
|---|---|---|
| `/login` | Login | ❌ |
| `/register` | Register | ❌ |
| `/dashboard` | Dashboard | ✅ |
| `/transactions` | รายการการเงิน | ✅ |
| `/transactions/add` | เพิ่มรายการ | ✅ |
| `/transactions/:id/edit` | แก้ไขรายการ | ✅ |
| `/categories` | หมวดหมู่ | ✅ |
| `/reports` | รายงานสรุป | ✅ |
| `/profile` | โปรไฟล์ | ✅ |

---

## 15. ข้อสังเกตสำหรับการออกแบบ UI ใหม่

### จุดที่ควรปรับปรุง
1. **Font:** ยังใช้ Roboto default — ควรเปลี่ยนเป็น Inter หรือ Outfit
2. **Animation:** มีแค่ `fadeIn` บน page — ควรเพิ่ม micro-animation ใน Card, Button
3. **Empty States:** ส่วนใหญ่ใช้ข้อความเรียบๆ — ควร Illustrate ให้สวยงาม
4. **Mobile Responsiveness:** Table ยังไม่รองรับ Mobile ดี ควรเปลี่ยนเป็น Card Layout บน Mobile
5. **Loading State:** ใช้ `CircularProgress` ทั้งหมด — ควรเปลี่ยนเป็น Skeleton Loading
6. **Color ปุ่ม:** ปุ่ม Delete/Error ยังไม่ Consistent — ควรกำหนด Design Token ชัดเจน
7. **Notification Bell:** ยังเป็น Placeholder ไม่มี Functionality

### Component ที่ยังขาด
- **Toast/Snackbar Notification** — ปัจจุบันใช้ Alert ใน Form แทน
- **Global Loading State** — ไม่มี Top Progress Bar
- **Breadcrumb Navigation** — ไม่มี
- **Dark/Light Mode Toggle** — ยังไม่มี
