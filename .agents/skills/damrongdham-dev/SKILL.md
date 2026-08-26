---
name: damrongdham-dev
description: Project instruction and AI working guidelines for Personal Income & Expense Management System (React 18 + Vite 5 + MUI 5, Node.js 20 + Express 4, MySQL 8, Docker Compose, Railway).
---

# Damrongdham Dev Skill Guide

## 1. Purpose
ไฟล์คู่มือนี้เป็นมาตรฐานหลัก (Single Source of Truth) สำหรับกำกับการทำงานของ AI Assistant ในการพัฒนา **ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล (Personal Income & Expense Management System)** เพื่อให้แน่ใจว่า AI ทำงานอย่างเป็นระบบ ไม่เขียนโค้ดเกินขอบเขต ไม่ข้าม Phase ไม่เปลี่ยน Architecture เอง และปฏิบัติตามมาตรฐานวิศวกรรมซอฟต์แวร์ระดับสากล

## 2. Project Working Principles
* **Mandatory Pre-requisites:**
  1. AI ต้องอ่าน `SKILL.md` นี้ก่อนเริ่มทำงานกับโปรเจกต์ทุกครั้ง
  2. AI ต้องอ่าน `docs/planning/PROJECT_CONTEXT.md` เพื่อทำความเข้าใจภาพรวมของระบบก่อนเริ่ม Implementation
  3. AI ต้องอ่าน `docs/planning/10-implementation-plan.md` เพื่อตรวจสอบแผนงานของ Phase ปัจจุบัน
* **One Phase at a Time:** ทำงานเฉพาะ Phase ที่ได้รับมอบหมายเท่านั้น ห้ามข้ามไปทำ Phase ถัดไปล่วงหน้า
* **Strict Scope Control:** ห้ามแอบเพิ่ม Feature หรือปรับแต่งโครงสร้างนอกเหนือจากที่ระบุในแผนงาน
* **Architecture Preservation:** ห้ามเปลี่ยน Tech Stack, Database Schema หรือ API Contract โดยไม่ได้รับอนุญาต หากจำเป็นต้องเปลี่ยน ต้องเสนอเหตุผล ผลกระทบ และรออนุมัติก่อนเสมอ

## 3. AI General Rules
* ทำหน้าที่เป็น Senior Full-stack Developer และ Technical Lead
* เขียนโค้ดที่สะอาด (Clean Code) รองรับการดูแลรักษาในระยะยาว (Maintainable) และมีประเภทข้อมูล/Error Handling ที่รัดกุม
* ระบุรายการไฟล์ที่สร้าง แก้ไข หรือลบ (`[NEW]`, `[MODIFY]`, `[DELETE]`) อย่างชัดเจนทุกครั้ง
* ซื่อสัตย์ต่อข้อมูล Error เมื่อเกิดปัญหา ให้ใช้วิธีอ่านและวิเคราะห์ Log แทนการเดาสาเหตุ

## 4. Planning Rules
* ห้ามเขียนซอร์สโค้ด หรือแก้ไขระบบ ก่อนที่ Implementation Plan ใน Phase นั้นจะได้รับการอนุมัติจากผู้ใช้
* เอกสารการวางแผนต้องครอบคลุม:
  - วัตถุประสงค์เฉพาะ Phase
  - รายการไฟล์ที่ได้รับผลกระทบ
  - ขั้นตอนการทดสอบ (Automated & Manual)
  - รายการเกณฑ์ยอมรับงาน (Acceptance Criteria Checklist)
  - ข้อเสนอแนะ Git Commit Message

## 5. Implementation by Phase Rules
* ปฏิบัติตามแผนงานทีละขั้นตอน (Step-by-step)
* ห้ามใส่ Placeholder หรือ Mock Data ทิ้งไว้ใน Core Business Logic
* เมื่อทำเสร็จในแต่ละ Phase ต้องรันการทดสอบ ยืนยัน Acceptance Criteria และจัดทำ **Phase Completion Report** ก่อนส่งมอบงาน

## 6. Frontend Development Rules
* **Tech Stack:** React 18 + Vite 5 + MUI 5 (Material-UI)
* **Dev Port:** `5173` (รองรับ Hot Module Replacement ผ่าน Docker Bind Mount)
* **Component Architecture:** แยก Structure เป็น Components, Pages, Hooks, Services และ Theme ให้ชัดเจน
* **UI/UX Standard:** ใช้ MUI Theme System ในการควบคุม Palette, Typography และ Spacing ให้ตรงกันทั้งระบบ
* **State Management & Form:** ใช้ Controlled Components และจัดการ Form Validation ให้รัดกุม

## 7. Backend Development Rules
* **Tech Stack:** Node.js 20 LTS + Express 4
* **Dev Port:** `5001` (หลีกเลี่ยง Port `5000` เนื่องจากชนกับ macOS AirPlay Receiver)
* **Architecture:** แยก Layer ชัดเจน (Routes, Controllers, Services, Models/Config)
* **Error Handling:** มี Global Error Handler Middleware และใช้ HTTP Status Codes ที่ถูกต้อง (200, 201, 400, 401, 403, 404, 500)

## 8. Database Development Rules
* **Tech Stack:** MySQL 8
* **Dev Port:** Container Port `3306` (Map ออกมายัง Host Port `3307`)
* **Charset & Collation:** ใช้ `utf8mb4` และ `utf8mb4_unicode_ci` เพื่อรองรับภาษาไทยเต็มรูปแบบ
* **Init Script:** วาง DDL/DML ตั้งต้นที่ `db/init/01-init.sql`
* **Naming Conventions:** ใช้ `snake_case` สำหรับชื่อตารางและคอลัมน์ (เช่น `category_id`, `created_at`)

## 9. API Development Rules
* **RESTful Standards:** ออกแบบ API แบบ RESTful (เช่น `GET /api/v1/transactions`, `POST /api/v1/transactions`)
* **JSON Format Response:** ส่งคืน Response ในรูปแบบ JSON มาตรฐานที่มีโครงสร้างสม่ำเสมอ:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Response description"
  }
  ```
* **Internal DNS:** Frontend สื่อสารหา Backend API ผ่าน Port `5001` หรือ Vite Proxy

## 10. Docker Development Rules
* **Compose Specification:** ใช้ `docker-compose.yml` สำหรับ Development โดย**ห้ามใส่ attribute `version`**
* **Service Map:**
  - `frontend`: Port `5173:5173` (Bind Mount Source, Anonymous `/app/node_modules`)
  - `backend`: Port `5001:5001` (Bind Mount Source, Anonymous `/app/node_modules`)
  - `db`: Port `3307:3306` (MySQL 8, Healthcheck via `mysqladmin ping`)
  - `phpmyadmin`: Port `8081:80` (platform: `linux/amd64` สำหรับ Apple Silicon M1-M4)
* **Internal DNS:** Backend และ phpMyAdmin ต้องติดต่อ MySQL ผ่านชื่อ Service `db` ที่ Port `3306` เท่านั้น (ห้ามใช้ `localhost`)
* **Service Dependency:** Service ที่ต้องใช้ DB ต้องระบุ `depends_on: db: condition: service_healthy`

## 11. Testing Rules
* ทุก Phase ต้องมีการทดสอบความถูกต้อง
* **Backend Testing:** ทดสอบ API Routes ด้วย Curl/Postman ตรวจสอบ Status Code และ Data Payload
* **Frontend Testing:** ทดสอบการ Render UI, Form Validation และการรับส่งข้อมูลกับ Backend API

## 12. Debugging Rules
* เมื่อเกิด Error ห้ามแก้ไขแบบซ่อนปัญหากลืน Exception
* อ่าน Log และ Stack Trace ฉบับเต็มผ่าน `docker compose logs` เพื่อหา Root Cause
* แก้ไขที่ต้นตอและรันคำสั่งทดสอบซ้ำเพื่อยืนยันการแก้ไข

## 13. Documentation Rules
* เอกสารทั้งหมดต้องอยู่ในรูปแบบ GitHub-flavored Markdown
* อัปเดต `docs/planning/` และ `README.md` ทันทีเมื่อมีการเปลี่ยน Configuration, Ports หรือ Commands

## 14. Git Commit Rules
* ใช้มาตรฐาน **Conventional Commits**:
  - `feat:` ฟีเจอร์ใหม่
  - `fix:` แก้ไข Bug
  - `docs:` ปรับปรุงเอกสาร
  - `chore:` งานตั้งค่า Build / Docker / Config
  - `refactor:` ปรับโครงสร้างโค้ด
* เสนอแนะ Commit Message ที่กระชับ ชัดเจน ในทุก Phase

## 15. Security Rules
* ห้ามใส่ Secrets, Private Keys หรือ Passwords ในซอร์สโค้ด และ Git Repository
* ใช้ไฟล์ `.env` สำหรับ Local และจัดทำ `.env.example` เป็นตัวอย่าง
* บน Production (Railway) ต้องกำหนดผ่าน Environment Variables ของ Platform เท่านั้น

## 16. Forbidden Actions
1. ❌ **ห้ามเขียนโค้ดก่อนอ่าน `SKILL.md`, `PROJECT_CONTEXT.md` และได้รับอนุมัติ Planning**
2. ❌ **ห้ามข้าม Phase หรือแอบเพิ่ม Feature นอกเหนือจากแผน**
3. ❌ **ห้ามเปลี่ยน Tech Stack, Architecture หรือ Database Schema โดยไม่ขออนุมัติ**
4. ❌ **ห้าม Commit ไฟล์ `.env`, `node_modules` หรือ Secrets ลง Git**
5. ❌ **ห้ามใช้ Port 5000 สำหรับ Backend บน macOS Host**
6. ❌ **ห้ามใส่ `version` ใน `docker-compose.yml`**
7. ❌ **ห้ามใช้ `localhost` สื่อสารระหว่าง Container ใน Docker Network (ต้องใช้ชื่อ Service `db`)**

## 17. Required Response Format
เมื่อ AI สรุปตอบกลับผู้ใช้ ต้องใช้โครงสร้างดังนี้:
1. **Summary of Action:** สรุปการดำเนินการสั้นๆ กระชับ
2. **Affected Files:** รายการไฟล์ที่สร้าง/แก้ไข (`[NEW]`, `[MODIFY]`, `[DELETE]`) พร้อม Link
3. **Verification Results:** ผลการรันและการทดสอบระบบ
4. **Next Steps / Decisions Needed:** ก้าวต่อไปหรือคำถามที่ต้องการให้ผู้ใช้ตัดสินใจ

## 18. Phase Completion Report Format
เมื่อเสร็จสิ้น Phase ให้รายงานในรูปแบบนี้:

```markdown
# 🏁 Phase [X] Completion Report

## 1. Summary of Completed Tasks
- [x] Task 1: ...
- [x] Task 2: ...

## 2. Affected Files
- `[NEW]` [file_path](file:///path/to/file)
- `[MODIFY]` [file_path](file:///path/to/file)

## 3. Verification & Acceptance Criteria Checklist
- [x] Criteria 1: ...
- [x] Criteria 2: ...

## 4. Run & Test Commands Used
\`\`\`bash
docker compose up -d
curl http://localhost:5001/api/health
\`\`\`

## 5. Recommended Git Commit Message
\`\`\`text
feat(phase-x): implement feature x according to plan
\`\`\`
```
