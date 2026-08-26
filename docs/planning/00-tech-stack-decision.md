# 00. Tech Stack Decision Document

**Project Name:** Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)  
**Document Version:** 1.0.0  
**Phase:** Phase 0 - Technical Framework & Scope Definition  
**Author:** Senior Full-stack Architect & Technical Lead  

---

## 1. Project Name
**Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)**

## 2. Purpose of the System
วัตถุประสงค์ของระบบคือการจัดทำเว็บบอร์ด/แอปพลิเคชันสำหรับบริหารจัดการและบันทึกข้อมูลรายรับ-รายจ่ายส่วนบุคคล ช่วยให้ผู้ใช้งานสามารถบันทึก รายการรับ-จ่าย หมวดหมู่ สรุปภาพรวมทางการเงิน และติดตามสถานะทางการเงินในชีวิตประจำวันได้อย่างสะดวกรวดเร็ว ปลอดภัย และใช้งานง่าย

## 3. Selected Tech Stack
* **Frontend:** React 18 + Vite 5 + MUI 5 (Material-UI)
* **Backend:** Node.js 20 LTS + Express 4
* **Database:** MySQL 8
* **Development Container Orchestration:** Docker Compose (Dev)
* **Database Management Tool (Dev):** phpMyAdmin
* **Deployment Target (Production):** Railway (Single-container deployment ด้วย Dockerfile Multi-stage)

## 4. Reason for Each Technology
* **React 18 & Vite 5:** ให้ประสิทธิภาพสูง การโหลดและคอมไพล์โค้ดในระหว่างพัฒนาทำได้รวดเร็วด้วย ES Modules (Hot Module Replacement / HMR)
* **MUI 5 (Material-UI):** มี Component Library สำเร็จรูปที่สวยงาม ทันสมัย ยืดหยุ่น และมีระบบ Design System/Theming ที่ตอบโจทย์การพัฒนา Dashboard ทางการเงิน
* **Node.js 20 LTS & Express 4:** ให้เสถียรภาพสูงด้วย Long-Term Support (LTS), Ecosystem กว้างขวาง, เป็น non-blocking I/O ที่ประมวลผล API ได้อย่างรวดเร็ว
* **MySQL 8:** Relational Database ที่มีความน่าเชื่อถือสูง รองรับการทำ Transaction (ACID), JSON data type และมี Charset `utf8mb4` ที่รองรับภาษาไทยได้อย่างสมบูรณ์
* **Docker Compose:** ช่วยจำลองสภาวะแวดล้อมระหว่างนักพัฒนาทุกคนให้เหมือนกัน (Consistent Development Environment) ลดปัญหา "works on my machine"
* **phpMyAdmin:** เครื่องมือ Web GUI สำหรับบริหารจัดการข้อมูลใน MySQL ที่ใช้งานง่าย เหมาะกับการตรวจสอบและจัดการข้อมูลช่วงพัฒนา
* **Railway:** Cloud Platform ที่รองรับการ Deploy จาก Dockerfile แบบ Single-container โดยตรง มีระบบจัดการ SSL/Domain ให้อัตโนมัติ ปรับแต่งง่าย ไม่ต้องตั้งค่า Nginx ให้ซับซ้อน

## 5. Development Environment
* **Frontend:** Vite สั่งรันบน Port `5173` รองรับ Hot Reload (HMR) ผ่าน Bind Mount
* **Backend:** Express API สั่งรันบน Port `5001` รองรับ Hot Reload ผ่าน `nodemon` (หลีกเลี่ยง Port `5000` เนื่องจากชนกับ macOS AirPlay Receiver)
* **MySQL 8:** Container รันภายในที่ Port `3306` และ Map ออกมายัง Host ที่ Port `3307`
* **phpMyAdmin:** Container รันภายในที่ Port `80` และ Map ออกมายัง Host ที่ Port `8081` (สำหรับ Apple Silicon M1/M2/M3/M4 ต้องกำหนด `platform: linux/amd64`)
* **Network Strategy:** ทุก Service ทำงานอยู่บน Custom Docker Bridge Network เดียวกัน (`piem_net`)
* **DB Connection:** Backend และ phpMyAdmin เชื่อมต่อ MySQL ผ่านชื่อ Service `db` ที่ Port `3306` (ห้ามใช้ `localhost`)
* **Mounting Strategy:** 
  * Source code ใช้ Bind Mounts เพื่อรองรับ Hot Reload
  * `node_modules` ใช้ Anonymous Volume (เช่น `/app/node_modules`) เพื่อป้องกันไม่ให้ Host เข้าไปทับไฟล์ใน Container และป้องกันปัญหา Architecture/Binary ต่างกัน
* **Environment Configuration:** เก็บค่าความลับและคอนฟิกไว้ที่ไฟล์ `.env` และอ้างอิงใน `docker-compose.yml` ด้วยรูปแบบ `${VARIABLE:-default}`
* **Compose Syntax:** ไม่ระบุ `version: "3.8"` ใน `docker-compose.yml` เนื่องจากล้าสมัยใน Compose Specification ปัจจุบัน
* **Healthcheck & Dependencies:** MySQL กำหนด `healthcheck` และ Service อื่นที่ต้องใช้ DB จะระบุ `depends_on` พร้อม `condition: service_healthy`
* **Database Initialization:** วางสคริปต์ SQL ตั้งต้นไว้ที่ `db/init/01-init.sql` โดยใช้ Charset `utf8mb4` และ Collation `utf8mb4_unicode_ci` รองรับภาษาไทย

## 6. Production Environment
* **Primary Target (Railway):** รันแอปพลิเคชันแบบ Single-container โดยใช้องค์ประกอบจาก Root `Dockerfile` แบบ Multi-stage (Build Frontend Dist -> เสิร์ฟผ่าน Express Static/API ภายใน Container เดียว)
* **SSL & Domain:** Railway เป็นผู้จัดการวงจรอิเล็กทรอนิกส์, ใบรับรองความปลอดภัย SSL/TLS และ Custom Domain ให้อัตโนมัติ โดยไม่จำเป็นต้องแยก Nginx แยกส่วน
* **Alternative Target (On-Premise / Ubuntu):** สามารถนำ Container Image เดียวกันไปรันร่วมกับ MySQL Server และตั้งค่า Nginx เป็น Reverse Proxy ได้ โดยไม่กระทบต่อซอร์สโค้ดหลัก
* **Configuration & Security:** ห้าม Hardcode Secrets หรือ Credentials ใดๆ ในซอร์สโค้ด ต้องใช้อินพุตผ่าน Environment Variables บน Railway Dashboard เท่านั้น
* **Storage Limitations:** Filesystem ของ Railway เป็น Ephemeral (ข้อมูลชั่วคราว) หากในอนาคตมีฟีเจอร์อัปโหลดไฟล์ ต้องใช้ Railway Volume หรือ External Object Storage (เช่น S3/Cloud Storage)

## 7. Tools Required
1. **Node.js (v20 LTS)** & **npm**
2. **Docker Desktop** / **Docker Engine** & **Docker Compose (v2+)**
3. **Git**
4. **Code Editor:** VS Code (พร้อม Extensions: ESLint, Prettier, Docker)
5. **API Testing Client:** Postman / Bruno / Thunder Client
6. **Web Browser:** Chrome / Edge / Firefox / Safari

## 8. Folder Strategy เบื้องต้น
โครงสร้างไดเรกทอรีสำหรับระบบ:
```text
PIEM_System/
├── .env.example
├── .env
├── .gitignore
├── README.md
├── docker-compose.yml
├── Dockerfile
├── docs/
│   └── planning/
│       └── 00-tech-stack-decision.md
├── db/
│   └── init/
│       └── 01-init.sql
├── backend/
│   ├── Dockerfile.dev
│   ├── package.json
│   ├── server.js
│   └── src/
└── frontend/
    ├── Dockerfile.dev
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
```

## 9. Constraints
1. **Port Constraints:** ต้องไม่ใช้ Port 5000 บน Host เพื่อป้องกันปัญหากับ macOS AirPlay Receiver
2. **Database Port Mapping:** MySQL Host Port ต้องเป็น `3307` (เพื่อไม่ให้ชนกับ MySQL 3306 เดิมที่อาจติดตั้งอยู่บนเครื่องพัฒนา)
3. **Database Health Dependency:** Service ที่ต้องการเชื่อมต่อ MySQL ต้องรอจนกว่า DB จะผ่าน Healthcheck (`service_healthy`) เท่านั้น
4. **No Hardcoded Secrets:** ห้ามใส่ Password, Keys หรือ Connection String ในโค้ดโดยเด็ดขาด
5. **No Version Key in Compose:** ห้ามใส่ attribute `version` ใน `docker-compose.yml`
6. **Single-Container Production Model:** การ Deploy ขึ้น Railway ต้องรวมเป็น Single Container เดียวผ่าน Multi-stage Dockerfile

## 10. Assumptions
1. สภาพแวดล้อมการพัฒนาของทีมงานทุกคนรองรับ Docker และ Docker Compose v2+
2. การเชื่อมต่ออินเทอร์เน็ตช่วงพัฒนาสามารถ Pull Docker Base Images (Node 20, MySQL 8, phpMyAdmin) ได้
3. สำหรับการเก็บข้อมูลการเงินในระยะแรก ปริมาณข้อมูลและผู้ใช้งานยังมีสเกลระดับบุคคล (Personal scale) การใช้ Single Database Node ยังคงเพียงพอต่อการใช้งาน

## 11. Open Questions
1. ในอนาคตต้องการเพิ่มฟีเจอร์แนบสลิป/ใบเสร็จ (File Upload) หรือไม่? (เพื่อเตรียมการต่อเชื่อม Railway Volume หรือ Object Storage)
2. ต้องการระบบการยืนยันตัวตน (Authentication) รูปแบบใดในอนาคต? (JWT, Session, OAuth)

## 12. Key Decisions
1. **เลือกใช้ Single-Container สำหรับ Production บน Railway:** ลดความซับซ้อนในการจัดการ Infrastructure และประหยัดทรัพยากร
2. **ใช้ Custom Bridge Network ภายใน Docker Compose:** เพื่อความปลอดภัยและการอ้างอิงชื่อ Service ได้โดยตรงผ่าน DNS ของ Docker
3. **ใช้ Anonymous Volume แยก `node_modules`:** เพื่อป้องกันปัญหาความขัดแย้งของไฟล์ dependency ระหว่าง Host OS และ Container OS
4. **ตั้งค่า Charset เป็น `utf8mb4` ทั้งหมด:** การันตีการรองรับภาษาไทยในฐานข้อมูล MySQL

## 13. Docker Service Map & Port Mapping

| Service Name | Image / Build Context | Host Port | Container Port | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `frontend` | `./frontend/Dockerfile.dev` | `5173` | `5173` | React + Vite Dev Server (Hot Reload) |
| `backend` | `./backend/Dockerfile.dev` | `5001` | `5001` | Express API Server (Nodemon Hot Reload) |
| `db` | `mysql:8.0` | `3307` | `3306` | MySQL Database Engine |
| `phpmyadmin` | `phpmyadmin/phpmyadmin` | `8081` | `80` | MySQL Database Web GUI |

## 14. Docker Network Rules
* **Network Name:** `piem_net` (Driver: `bridge`)
* **Internal Communication:**
  * Backend สื่อสารหา Database ด้วย Host URL: `db` Port: `3306`
  * phpMyAdmin สื่อสารหา Database ด้วย Host URL: `db` Port: `3306`
  * Frontend สื่อสารหา Backend ผ่าน Proxy/Direct API Port: `5001`
* **Security Rule:** ห้ามใช้ `127.0.0.1` หรือ `localhost` ในการสื่อสารระหว่าง Container ภายใน Docker Network

## 15. Environment Variable Strategy
* **ไฟล์เก็บค่า:** `.env` (ไม่ Commit เข้า Git) และมี `.env.example` เป็นตัวอย่าง
* **รูปแบบใน Docker Compose:** ใช้ `${VARIABLE:-default_value}` เพื่อความยืดหยุ่น เช่น:
  ```yaml
  PORT: ${BACKEND_PORT:-5001}
  DB_HOST: ${DB_HOST:-db}
  DB_PORT: ${DB_PORT:-3306}
  ```
* **Production Variables:** ตั้งค่าโดยตรงผ่านระบบ Environment Variables บน Railway Dashboard

## 16. Known Setup Risks / Lessons Learned
1. **Port 5000 Collision on macOS:** macOS Monterey ขึ้นไปเปิดใช้งาน AirPlay Receiver บน Port 5000 เป็นค่าเริ่มต้น หากใช้ Port 5000 กับ Express จะเกิด Error `EADDRINUSE` จึงสลับมาใช้ Port `5001` สำหรับ Backend
2. **phpMyAdmin Architecture Compatibility on Apple Silicon:** phpMyAdmin image บางเวอร์ชันอาจมีปัญหากับสถาปัตยกรรม ARM64 บนชิป Apple Silicon (M1-M4) จำเป็นต้องระบุ `platform: linux/amd64` ใน `docker-compose.yml` เพื่อบังคับให้ Docker จำลองผ่าน Rosetta 2
3. **Deprecated `version` key in Docker Compose:** Docker Compose v2+ สั่งแจ้ง Warning หรือเลิกใช้งาน attribute `version: "3.x"` ที่ด้านบนสุดของไฟล์แล้ว การกำหนด `services:` ขึ้นต้นโดยตรงคือมาตรฐานปัจจุบัน
4. **Node Modules Overwrite via Bind Mounts:** หากไม่ได้ตั้งค่า Anonymous Volume (`/app/node_modules`) การใช้ Bind Mount จะเอาโฟลเดอร์ `node_modules` จาก Host ไปทับใน Container ซึ่งอาจทำให้ binaries ไม่ทำงาน และเมื่อมีการ `npm install` เพิ่ม package ใหม่ ต้องทำการ rebuild container (`docker compose up -d --build`)
5. **Backend Database Connection Race Condition:** Node.js Backend มักเริ่มทำงานเร็วกว่า MySQL Database engine สตาร์ทเสร็จ หากไม่มี `healthcheck` บน MySQL และไม่กำหนด `depends_on: db: condition: service_healthy` ตัว Backend จะ Crash ทันทีเนื่องจากต่อ DB ไม่ได้
