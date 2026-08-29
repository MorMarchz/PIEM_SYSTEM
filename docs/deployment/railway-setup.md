# คู่มือการติดตั้งและปรับใช้ระบบบน Railway Cloud Platform (Railway Setup Guide)

**ชื่อโปรเจกต์:** Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)  
**เป้าหมายการติดตั้ง:** Target A - Railway Cloud Platform (Single-Container Production)  
**เวอร์ชันเอกสาร:** 1.0.0  
**วันที่ปรับปรุงล่าสุด:** 29 สิงหาคม 2026  

---

## 1. ภาพรวมการสถาปัตยกรรมบน Railway (Architecture Overview)
การนำระบบขึ้นใช้งานจริงบน Railway Cloud Platform จะใช้โครงสร้าง **Single-Container Multi-stage Build Specification** ตามไฟล์ [`Dockerfile`](file:///d:/PI&EM_System/Dockerfile) และ [`railway.toml`](file:///d:/PI&EM_System/railway.toml) ในรากของโปรเจกต์:
- **Stage 1 (Frontend Builder):** ทำการ Build React UI แอพพลิเคชันผ่าน Vite ได้ไฟล์สถิตใน `frontend/dist`
- **Stage 2 (Runner):** ติดตั้งเฉพาะ Production Dependencies ของ Express Server และคัดลอกไฟล์สถิตจาก Stage 1 เข้ามาไว้ในโฟลเดอร์ `public/` เพื่อให้ Express ทำหน้าที่เสิร์ฟทั้งหน้าเว็บ UI และ REST API ภายในพอร์ตเดียว

---

## 2. ขั้นตอนการติดตั้งและ Deploy บน Railway (Step-by-Step Deployment)

### ขั้นตอนที่ 1: สร้างโปรเจกต์บน Railway Dashboard
1. เข้าสู่ระบบ [Railway.app](https://railway.app/)
2. กดปุ่ม **"New Project"** -> เลือก **"Deploy from GitHub repo"**
3. เลือก Repository `MorMarchz/PIEM_SYSTEM` (หรือ repo ของโปรเจกต์)

### ขั้นตอนที่ 2: ตั้งค่า Database Service (MySQL)
1. ในหน้า Railway Canvas กดปุ่ม **"New"** -> เลือก **"Database"** -> เลือก **"Add MySQL"**
2. เมื่อ MySQL Service สตาร์ตเรียบร้อยแล้ว เข้าไปที่แถบ **"Connect"** หรือ **"Variables"** เพื่อคัดลอกค่านำไปใส่ใน Web Service:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
3. นำเข้าข้อมูลเริ่มต้นฐานข้อมูล (Seed Data) โดยเชื่อมต่อผ่าน MySQL Client หรือใช้คำสั่ง:
   ```bash
   mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQLDATABASE> < db/init/01-init.sql
   ```

### ขั้นตอนที่ 3: ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables Configuration)
ใน Web Service บน Railway เข้าไปที่แถบ **"Variables"** -> กด **"Raw Editor"** และกรอกตัวแปรสภาพแวดล้อมดังต่อไปนี้:

> [!IMPORTANT]
> ห้ามใช้รหัสผ่านหรือ Secret Key ตัวอย่างในสภาพแวดล้อมจริง ให้เจนเนอเรตค่า Random Secret ที่มีความยาวอย่างน้อย 32 ตัวอักษร

```ini
# Server Port Configuration (Railway จะกำหนด $PORT ให้อัตโนมัติ)
NODE_ENV=production

# Database Connection (ผูกกับ Railway MySQL Database Service)
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}

# JWT & Authentication Security (กำหนด Secret Keys ของระบบ)
JWT_SECRET=your_production_secure_jwt_secret_key_32chars_min
REFRESH_TOKEN_SECRET=your_production_secure_refresh_token_secret_key_32chars_min

# Frontend URL Origin (สำหรับ CORS Policy)
FRONTEND_URL=https://your-app-domain.up.railway.app
```

### ขั้นตอนที่ 4: การยืนยัน Build & Healthcheck
1. Railway จะอ่านไฟล์ `railway.toml` และสั่ง Build ผ่าน `Dockerfile` อัตโนมัติ
2. Railway จะตรวจสอบความพร้อมของระบบผ่าน Healthcheck Path: `/api/health`
3. เมื่อขึ้นสถานะ **"Success / Active"** สามารถกดปุ่ม **"Generate Domain"** บน Railway เพื่อเปิดรับทราฟฟิก HTTPS สาธารณะ

---

## 3. การตรวจสอบหลังการเปิดใช้งาน (Post-Deployment Verification)
1. ทดสอบเข้าใช้งาน URL ที่ได้จาก Railway (เช่น `https://your-app-domain.up.railway.app`)
2. ทดสอบสมัครสมาชิก เข้าสู่ระบบ และลองบันทึกรายการการเงิน
3. ทดสอบการกด Refresh หน้าจอ Client-side Routes (เช่น `/dashboard`, `/reports`) เพื่อยืนยันว่า SPA Fallback Middleware ทำงานถูกต้องไม่เกิด 404
