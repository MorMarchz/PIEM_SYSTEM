# คู่มือการเตรียมความพร้อมก่อนการปล่อยใช้งานจริงและการสำรองข้อมูล (Production Checklist & Maintenance Guide)

**ชื่อโปรเจกต์:** Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)  
**เป้าหมายการดำเนินงาน:** Production Go-Live Checklist, On-Premise Target B Guide & Database Maintenance  
**เวอร์ชันเอกสาร:** 1.0.0  
**วันที่ปรับปรุงล่าสุด:** 29 สิงหาคม 2026  

---

## 1. รายการตรวจสอบความพร้อมก่อนการเปิดใช้งาน (Pre-Deployment Go-Live Checklist)

ก่อนทำการปล่อยระบบขึ้นสู่สภาพแวดล้อมใช้งานจริง (Production Go-Live) ให้ตรวจสอบรายการดังต่อไปนี้:

- [x] **Code & Architecture Quality:** ผ่านการทดสอบทวนสอบทุกระบบ 100% (ไม่มี Bug ระดับ P0/P1 ค้างในระบบ)
- [x] **Security Configuration:**
  - [ ] เปลี่ยนค่า `JWT_SECRET` และ `REFRESH_TOKEN_SECRET` เป็น Random String ที่มีความยาว ≥ 32 ตัวอักษร
  - [ ] ตรวจสอบว่าไม่มีการจัดเก็บ Plaintext Password หรือ Hardcoded Secrets ในซอร์สโค้ด
  - [ ] ตรวจสอบว่า Cookie `refreshToken` ถูกตั้งค่า `HttpOnly: true` และ `Secure: true` ใน HTTPS
- [x] **Database Preparedness:**
  - [ ] รันสคริปต์ DDL สร้างโครงสร้างตาราง (`db/init/01-init.sql`)
  - [ ] ตรวจสอบการทำ Indexing บนตาราง `transactions` (`idx_transactions_user_date`)
- [x] **Docker & Production Orchestration:**
  - [ ] ตรวจสอบว่าไม่มี attribute `version` ในไฟล์ `docker-compose.prod.yml`
  - [ ] ตรวจสอบไฟล์ `nginx/default.conf` ตั้งค่า Ingress Reverse Proxy บนพอร์ต 80

---

## 2. คู่มือการปรับใช้แบบ On-Premise / Ubuntu Server (Target B Deployment Guide)

สำหรับกรณีนำไปติดตั้งบนเครื่องเซิร์ฟเวอร์ On-Premise หรือ Ubuntu VPS:

### ขั้นตอนการรันระบบแบบ Multi-Container Production:
```bash
# 1. คัดลอกซอร์สโค้ดและไฟล์คอนฟิกไปยัง Server
git clone https://github.com/MorMarchz/PIEM_SYSTEM.git
cd PIEM_SYSTEM

# 2. สร้างและกำหนดค่าไฟล์สภาพแวดล้อม (.env)
cp .env.example .env
nano .env # กรอกค่า DB_PASSWORD, JWT_SECRET, REFRESH_TOKEN_SECRET

# 3. สั่ง Build และ สตาร์ตบริการด้วย Production Compose Specification
docker compose -f docker-compose.prod.yml up -d --build

# 4. ตรวจสอบสถานะการทำงานของบริการทั้ง 4 (db, backend, frontend, nginx)
docker compose -f docker-compose.prod.yml ps
```

---

## 3. คู่มือการสำรองและฟื้นฟูฐานข้อมูล (Database Backup & Restore Operations)

### 3.1 การสำรองข้อมูล (Database Backup Routine)

**กรณีรันผ่าน Docker Container:**
```bash
# สำรองข้อมูลเฉพาะโครงสร้างและข้อมูลไปยังไฟล์ SQL ในโฟลเดอร์ backups/
docker exec piem_mysql_prod mysqldump -u root -p<ROOT_PASSWORD> piem_db > backups/piem_db_backup_$(date +%Y%m%d_%H%M%S).sql
```

**กรณีรันแบบ Bare-metal MySQL:**
```bash
mysqldump -u root -p<ROOT_PASSWORD> piem_db > backups/piem_db_backup_$(date +%Y%m%d_%H%M%S).sql
```

### 3.2 การฟื้นฟูข้อมูล (Database Restore Procedure)

**กรณีรันผ่าน Docker Container:**
```bash
# นำเข้าไฟล์สำรองข้อมูลกลับไปยังคอนเทนเนอร์ MySQL
docker exec -i piem_mysql_prod mysql -u root -p<ROOT_PASSWORD> piem_db < backups/piem_db_backup_target.sql
```

**กรณีรันแบบ Bare-metal MySQL:**
```bash
mysql -u root -p<ROOT_PASSWORD> piem_db < backups/piem_db_backup_target.sql
```

---

## 4. การตรวจสอบสถานะการทำงานและการบำรุงรักษาระบบ (Monitoring & Maintenance)

1. **Health Check Endpoint Monitoring:**
   - สั่งยิงคำขอเพื่อตรวจสอบสถานะ API และการเชื่อมต่อ DB: `GET http://<YOUR_DOMAIN>/api/health`
   - ผลลัพธ์ที่ปกติ: `{"success": true, "message": "PIEM Backend API Service is healthy", "db_status": "connected"}`

2. **Log Inspection Operations:**
   - **Docker Containers:** `docker compose -f docker-compose.prod.yml logs -f --tail=100 backend`
   - **Railway Service:** ดูผ่านหน้าแถบ "Deployments -> View Logs" บน Railway Dashboard
