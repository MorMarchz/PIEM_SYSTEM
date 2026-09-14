# Google Stitch Prompt — PI&EM System UI Design

---

## 📋 MASTER PROMPT (Copy ทั้งหมดไปวางใน Google Stitch)

---

Design a complete web application UI for a **Personal Income & Expense Management System** called **"PI&EM System"**. The design must be **minimal, modern, and clean** — inspired by Linear, Vercel Dashboard, and Notion. Use a **dark theme** with soft glassmorphism accents.

---

### 🎨 Design Language

**Style:** Minimal Modern Dark
**Mood:** Professional, Clean, Focused
**Inspiration:** Linear App, Vercel Dashboard, Raycast

**Color Palette:**
- Background (deepest): `#080C14`
- Background (surface): `#0F172A`
- Card / Panel: `#131C2E` with very subtle border `rgba(255,255,255,0.06)`
- Border: `rgba(255,255,255,0.07)`
- Text Primary: `#F1F5F9`
- Text Secondary: `#64748B`
- Text Muted: `#334155`
- Accent Primary: `#6366F1` (Indigo)
- Accent Income: `#10B981` (Emerald)
- Accent Expense: `#F43F5E` (Rose)
- Accent Warning: `#F59E0B` (Amber)
- Accent Purple: `#8B5CF6`

**Typography:**
- Font Family: **Inter** (Google Fonts)
- Heading Large: 28px, weight 700, tracking -0.5px
- Heading Medium: 18px, weight 600
- Body: 14px, weight 400
- Caption: 12px, weight 500, letter-spacing 0.3px

**Spacing & Radius:**
- Base unit: 4px
- Card border-radius: 14px
- Button border-radius: 8px
- Input border-radius: 8px
- Small chip/badge: 6px

**Shadows:**
- Card shadow: `0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)`
- Elevated shadow: `0 8px 32px rgba(0,0,0,0.5)`

---

### 📐 Layout Structure

**Left Sidebar (fixed, 240px wide):**
- Top: App logo icon + "PI&EM" text + subtitle "Finance"
- Nav items (icon + label): Dashboard, Transactions, Categories, Reports, Profile
- Active item: `#6366F1` left border accent + light indigo background `rgba(99,102,241,0.1)`
- Bottom: User avatar + name + email in small text
- Very minimal, no heavy background color — just subtle separation

**Top Bar (AppBar, 56px tall):**
- Page title (current page name) — left aligned
- Right side: Notification bell icon + User avatar
- Very thin — no heavy elevation

**Main Content:**
- Padding: 24px
- Max content width: 1200px
- Subtle fade-in animation on page load

---

### 📄 PAGE 1: Login Page

Full screen centered layout, no sidebar.

```
Background: deep dark gradient #080C14 → #0F172A

Center Card (400px wide):
┌──────────────────────────────────────┐
│                                      │
│   🔷 Icon (wallet/finance)           │
│   PI&EM System          (bold)       │
│   "จัดการการเงินส่วนตัว"  (muted)   │
│                                      │
│   ─────────────────────────────      │
│                                      │
│   Email                              │
│   [________________________]         │
│                                      │
│   Password                    👁     │
│   [________________________]         │
│                                      │
│   [    เข้าสู่ระบบ    ]  ← full width, indigo │
│                                      │
│   ยังไม่มีบัญชี?  สมัครสมาชิก →   │
│                                      │
└──────────────────────────────────────┘

Card style: bg #131C2E, border rgba(255,255,255,0.07), radius 16px
Input style: bg #0F172A, border rgba(255,255,255,0.08), no label floating — use placeholder text
Button: full width, bg #6366F1, radius 8px, font weight 600
```

---

### 📄 PAGE 2: Register Page

Same as Login layout.

```
Center Card (400px wide):
┌──────────────────────────────────────┐
│   PI&EM System                       │
│   "สร้างบัญชีใหม่"                   │
│                                      │
│   ชื่อที่ต้องการแสดง                 │
│   [________________________]         │
│                                      │
│   Email                              │
│   [________________________]         │
│                                      │
│   รหัสผ่าน                    👁     │
│   [________________________]         │
│                                      │
│   ยืนยันรหัสผ่าน              👁     │
│   [________________________]         │
│                                      │
│   [    สมัครสมาชิก    ]             │
│                                      │
│   มีบัญชีแล้ว?  เข้าสู่ระบบ →      │
└──────────────────────────────────────┘
```

---

### 📄 PAGE 3: Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  สวัสดีคุณ March 👋              [🔄 รีเฟรชข้อมูล]    │
│  สรุปภาพรวมสถิติทางการเงิน — กันยายน 2026              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ รายรับรวม│ │รายจ่ายรวม│ │ คงเหลือ  │ │จำนวนรายการ│ │
│  │ ↑         │ │ ↓        │ │ ≡        │ │  #       │  │
│  │+3,000 ฿  │ │ -60 ฿    │ │+2,940 ฿  │ │ 2 รายการ │  │
│  │ emerald  │ │  rose    │ │ indigo   │ │ purple   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  ┌─────────────────────┐  ┌──────────────────────────┐ │
│  │ Donut Chart         │  │ Bar Chart รายวัน          │ │
│  │ สัดส่วนหมวดหมู่    │  │ รายรับ vs รายจ่าย        │ │
│  │                     │  │                          │ │
│  │   (Pie Donut)       │  │  ▐▌  ▐▌  ▐▌             │ │
│  │   Legend below      │  │  14  15  16 ...          │ │
│  └─────────────────────┘  └──────────────────────────┘ │
│                                                         │
│  รายการล่าสุด                        [ดูทั้งหมด →]    │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 14/09  ทดสอบ    —        +3,000 ฿  [รายรับ]   │   │
│  │ 14/09  ทดสอบ    —          -60 ฿  [รายจ่าย]   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

KPI Card style:
- bg: #131C2E
- top-left: small icon in colored circle (12px icon, 32px circle)
- label: 11px muted text
- value: 22px bold, colored
- thin left border accent colored
- No heavy box shadow — very flat with subtle border

Chart container: bg #131C2E, same card style, height 280px

Recent table: no heavy lines — use row hover highlight rgba(255,255,255,0.03)
```

---

### 📄 PAGE 4: Transactions Page

```
┌─────────────────────────────────────────────────────────┐
│  รายการการเงิน                  [+ เพิ่มรายการใหม่]    │
│  จัดการรายรับ-รายจ่ายทั้งหมด                          │
├─────────────────────────────────────────────────────────┤
│  Filter Row:                                            │
│  [🔍 ค้นหารายการ...]  [ประเภท ▾]  [หมวดหมู่ ▾]       │
│  [วันที่เริ่ม]  [วันที่สิ้นสุด]  [✕ ล้างตัวกรอง]    │
├─────────────────────────────────────────────────────────┤
│  วันที่      ชื่อรายการ    หมวดหมู่    จำนวนเงิน  ⚙️  │
│  ──────────────────────────────────────────────────     │
│  14/09/2026  ทดสอบ        ─           +3,000.00 ฿  ✏️🗑│
│  14/09/2026  ทดสอบ        ─             -60.00 ฿  ✏️🗑│
│                                                         │
│                      [< 1 >]  Pagination                │
└─────────────────────────────────────────────────────────┘

Table style:
- No heavy borders — just row separators rgba(255,255,255,0.05)
- Row hover: rgba(255,255,255,0.03)
- Amount: emerald for +, rose for -
- Category chip: small pill, colored bg with matching text
- Action icons: appear on row hover

Filter inputs: compact height 36px, bg #131C2E, minimal border
Add button: indigo filled, right aligned, icon + text
```

---

### 📄 PAGE 5: Add / Edit Transaction Form

```
Card centered, max-width 560px:
┌──────────────────────────────────────────┐
│  เพิ่มรายการใหม่                         │
│                                          │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │  ✚ รายรับ  │  │   ─ รายจ่าย    │   │
│  └─────────────┘  └─────────────────┘   │
│  ← ToggleButtonGroup, active=filled     │
│                                          │
│  ชื่อรายการ *                           │
│  [_______________________________]       │
│                                          │
│  ┌─────────────────┐ ┌───────────────┐  │
│  │ จำนวนเงิน *  ฿ │ │  วันที่ *     │  │
│  └─────────────────┘ └───────────────┘  │
│                                          │
│  หมวดหมู่ (ไม่บังคับ)                   │
│  [_____________________________ ▾]       │
│                                          │
│  หมายเหตุ (ไม่บังคับ)                   │
│  [                              ]        │
│  [                              ]        │
│                                          │
│  [ยกเลิก]          [💾 บันทึกรายการ]   │
└──────────────────────────────────────────┘

Style:
- Full page centered, no sidebar (or with sidebar — same layout)
- ToggleButton active state: indigo bg for income, rose bg for expense
- Input labels: above the field, 12px medium weight
- Submit button: right aligned, filled, icon + label
```

---

### 📄 PAGE 6: Categories Page

```
┌─────────────────────────────────────────────────────────┐
│  หมวดหมู่การเงิน                [+ เพิ่มหมวดหมู่]     │
│  จัดการหมวดหมู่รายรับและรายจ่าย                       │
├─────────────────────────────────────────────────────────┤
│  [ทั้งหมด 13]  [รายรับ 5]  [รายจ่าย 8]  ← Tab Pills   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Grid 4 columns:                                        │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │ 🟢         │ │ 🔴         │ │ 🟣         │          │
│  │ เงินเดือน  │ │ อาหาร      │ │ การลงทุน   │          │
│  │ [รายรับ]  │ │ [รายจ่าย] │ │ [รายรับ]  │          │
│  │        ✏🗑│ │        ✏🗑│ │        ✏🗑│          │
│  └────────────┘ └────────────┘ └────────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘

Card style:
- bg #131C2E, radius 12px
- Left accent bar (4px) colored by category color
- Icon in small colored circle (36px)
- Type badge: tiny pill, 10px
- Edit/Delete icons appear on hover, very subtle
```

---

### 📄 PAGE 7: Reports Page

```
┌─────────────────────────────────────────────────────────┐
│  รายงานสรุปทางการเงิน          [📅 กันยายน 2026 ▾]    │
│  สถิติเชิงลึก อัตราการออม และสัดส่วนหมวดหมู่         │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ รายรับ   │ │ รายจ่าย  │ │ คงเหลือ  │ │ Savings  │  │
│  │+3,000 ฿ │ │  -60 ฿   │ │+2,940 ฿  │ │  98.0%  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────────────────┐  ┌─────────────────┐   │
│  │ Bar Chart รายวัน (7 cols) │  │ Category Table  │   │
│  │                            │  │ (5 cols)        │   │
│  │  ▐▌ ▐▌ ▐▌ ▐▌             │  │ หมวดหมู่        │   │
│  │ income■ expense■ legend   │  │ ───────────     │   │
│  └────────────────────────────┘  │ ●อาหาร  60฿    │   │
│                                  │ ██████ 100%    │   │
│                                  └─────────────────┘   │
└─────────────────────────────────────────────────────────┘

Month selector: compact pill button with calendar icon
Chart: same card style, height 320px
Category table: progress bar colored per category, percentage chip
```

---

### 📄 PAGE 8: Profile Page

```
┌─────────────────────────────────────────────────────────┐
│  โปรไฟล์ส่วนตัว                                        │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐ │
│  │  [M]  March                    [App v1.0.0]       │ │
│  │       sorawich0027@gmail.com                      │ │
│  │       Standard User                               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──── แก้ไขข้อมูลส่วนตัว ────────────────────────┐   │
│  │ อีเมล (แสดงอย่างเดียว)                          │   │
│  │ [sorawich0027@gmail.com ─────────────── 🔒]     │   │
│  │                                                  │   │
│  │ ชื่อที่ต้องการแสดง                              │   │
│  │ [March ────────────────────────────────]        │   │
│  │                                    [บันทึก]     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──── เปลี่ยนรหัสผ่าน ───────────────────────────┐   │
│  │ [รหัสผ่านปัจจุบัน                        👁]   │   │
│  │ [รหัสผ่านใหม่                             👁]   │   │
│  │ [ยืนยันรหัสผ่านใหม่                      👁]   │   │
│  │                            [เปลี่ยนรหัสผ่าน]   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

Profile header card: horizontal layout, large avatar circle (64px)
Section cards: subtle section label as small ALL-CAPS heading above card
Disabled input: lower opacity, lock icon on right
```

---

### 🗔 MODALS

**Delete Confirmation Modal:**
```
Small modal (360px wide):
┌──────────────────────────────────────┐
│  🗑 ยืนยันการลบ                      │
│  ────────────────────────────────    │
│  คุณต้องการลบรายการ                  │
│  "ชื่อรายการ" ใช่หรือไม่?           │
│                                      │
│  ⚠ การกระทำนี้ไม่สามารถยกเลิกได้   │
│                                      │
│              [ยกเลิก] [ลบรายการ]    │
└──────────────────────────────────────┘

Style: 
- bg #131C2E, radius 16px
- Warning text: amber color small
- Delete button: rose/red filled
- Cancel: ghost/outline
- Backdrop: rgba(0,0,0,0.7) blur(4px)
```

**Add/Edit Category Modal:**
```
Medium modal (400px wide):
┌──────────────────────────────────────┐
│  เพิ่มหมวดหมู่ใหม่                  │
│  ────────────────────────────────    │
│  ชื่อหมวดหมู่ *                     │
│  [___________________________]       │
│                                      │
│  ประเภท                             │
│  [รายรับ ▾]                         │
│                                      │
│  ไอคอน                              │
│  [ทั่วไป ▾]                         │
│                                      │
│  สี:                                 │
│  ● ● ● ● ● ● ● ● ● ● ● ●           │
│                                      │
│  Preview:                            │
│  ┌────────────────────────────┐      │
│  │ 🟢 ชื่อหมวดหมู่  [รายรับ]│      │
│  └────────────────────────────┘      │
│                                      │
│         [ยกเลิก]  [เพิ่มหมวดหมู่]  │
└──────────────────────────────────────┘

Color dots: 28px circles, selected = white border ring
Preview box: bg rgba(255,255,255,0.04), radius 8px
```

---

### ✅ Additional UI Notes

1. **Micro-animations:** fade-in page transition (200ms ease), button hover scale(1.01), card hover translateY(-1px)
2. **Loading states:** Use skeleton loader (shimmer effect) instead of spinner for page-level content
3. **Empty states:** Illustrated with simple line icon + heading + subtext (no heavy graphics)
4. **Toast notifications:** Bottom-right snackbar, 3s auto-dismiss, success=emerald, error=rose
5. **Icons:** Use consistent icon library (Heroicons or Material Symbols Outlined style — thin weight)
6. **Input focus:** Indigo border glow `box-shadow: 0 0 0 2px rgba(99,102,241,0.3)`
7. **Scrollbar:** Custom thin scrollbar, dark track, subtle thumb
8. **Mobile:** Sidebar collapses to bottom tab bar on mobile (5 tabs with icons only)

---

> **Goal:** The UI should feel like a premium SaaS finance dashboard — clean whitespace, thoughtful typography, and purposeful color usage. Every element should have intention.
