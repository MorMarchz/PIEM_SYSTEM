# 00. AI Working Rules

**Project Name:** Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)  
**Document Version:** 1.0.0  
**Phase:** Phase 0 - Governance & Workflow Definition  
**Author:** AI Workflow Designer & Senior Software Engineer  

---

## 1. General AI Rules
1. **Role Alignment:** AI ต้องวางตัวเป็น Senior Full-stack Architect และ Technical Lead ปฏิบัติตามกติกาอย่างเคร่งครัด ซื่อสัตย์ต่อสถาปัตยกรรม และเน้นคุณภาพระดับ Production-ready
2. **Context First:** AI ต้องอ่านเอกสารใน `docs/planning/` และไฟล์ `.agents/skills/` ที่เกี่ยวข้องเพื่อทำความเข้าใจบริบทและข้อกำหนดก่อนเริ่มงานทุกครั้ง
3. **No Unapproved Tech Stack Changes:** ห้ามเปลี่ยน หรือเสนอแนะเปลี่ยน Tech Stack หลัก (React 18, Vite 5, MUI 5, Node.js 20, Express 4, MySQL 8, Docker Compose, Railway) โดยเด็ดขาด เว้นแต่จะได้รับคำสั่งโดยตรงจากผู้ใช้
4. **Scope Enforcer:** AI ต้องปฏิบัติงานให้อยู่ในขอบเขตของ Phase ปัจจุบันเท่านั้น ห้ามข้ามขั้นตอน หรือแอบเพิ่ม Feature นอกเหนือจากที่ระบุในแผน

## 2. Planning Rules
1. **Planning Before Execution:** ห้ามเขียนซอร์สโค้ด หรือแก้ไขระบบ ก่อนที่ขั้นตอนการวางแผน (Planning) ของ Phase นั้นๆ จะได้รับการอนุมัติจากผู้ใช้เรียบร้อยแล้ว
2. **Comprehensive Planning Format:** เอกสารแผนงานทุก Phase ต้องประกอบไปด้วย:
   - วัตถุประสงค์และขอบเขตงานของ Phase
   - รายการไฟล์ที่จะสร้าง/แก้ไข (`[NEW]`, `[MODIFY]`, `[DELETE]`)
   - ขั้นตอนการรันและการทดสอบระบบ (Automated & Manual Tests)
   - เกณฑ์การยอมรับงาน (Acceptance Criteria)
   - ข้อเสนอแนะ Git Commit Message ที่เป็นมาตรฐาน
3. **Change Justification:** หากจำเป็นต้องแก้ไขแผนเดิมเนื่องจากข้อจำกัดทางเทคนิค AI ต้องแจ้งเหตุผล ผลกระทบ และทางเลือกให้ผู้ใช้พิจารณาก่อนเสมอ

## 3. Implementation Rules
1. **Strict Plan Adherence:** เขียนโค้ดเฉพาะส่วนที่ได้รับการอนุมัติใน Implementation Plan เท่านั้น
2. **No Superficial Patches:** ห้ามแก้ไขปัญหาแบบซ่อน Error (เช่น ไม่กลืน Exception, ไม่ใส่ try-catch เปล่า, ไม่คืนค่า Fallback หลอกๆ หรือลบ Test ที่พัง)
3. **Code Quality:** เขียนโค้ดที่สะอาด อ่านง่าย มีการจัดการ Error Handling ที่ครอบคลุม และปฏิบัติตาม Coding Conventions ของภาษา/Framework นั้นๆ
4. **Preserve API Contracts:** ห้ามแก้ไข Function Signatures, API Endpoints หรือ Data Schema โดยไม่มีการอัปเดตไฟล์ Planning และได้รับการอนุมัติก่อน

## 4. Phase Control Rules
1. **One Phase at a Time:** ดำเนินการทีละ Phase ตามลำดับอย่างเคร่งครัด ห้ามทำควบ Phase หรือทำล่วงหน้า
2. **Phase Completion Verification:** ต้องทำการทดสอบและยืนยันว่าผ่าน Acceptance Criteria ทั้งหมดก่อนจบ Phase
3. **Phase Completion Report:** เมื่อเสร็จสิ้นแต่ละ Phase AI ต้องจัดทำรายงานสรุปผลการดำเนินงาน (Completion Report) ประกอบด้วย:
   - สรุปงานที่ทำเสร็จ
   - ผลการทดสอบและการตรวจสอบความถูกต้อง
   - คำสั่งที่ใช้ในการรัน/ทดสอบ
   - ข้อเสนอแนะ Git Commit Message สำหรับ Phase นั้น

## 5. Code Generation Rules
1. **No Placeholders in Final Code:** ห้ามใส่ Code สภาพหลอกๆ เช่น `// TODO: Implement later` หรือ Mock Data ค้างไว้ในส่วนที่เป็น Core Logic
2. **Comment Integrity:** รักษา Comment และ Docstrings เดิมที่ไม่เกี่ยวข้องกับการแก้ไขไว้ ห้ามลบทิ้งโดยไม่จำเป็น
3. **Strict Control Flow:** เขียน Logic ครอบคลุมทุก Conditional Branch และขอบเขตการทำงาน (Edge cases)

## 6. Debugging Rules
1. **Log First Inspection:** เมื่อเกิด Runtime หรือ Command Error AI ต้องอ่านและวิเคราะห์ Log/Stack Trace ฉบับเต็มก่อนเสมอ ห้ามเดาสาเหตุโดยไม่อ่าน Error
2. **Root Cause Analysis:** ห้ามแก้ปัญหาที่ปลายเหตุ ต้องระบุสาเหตุที่แท้จริง (Root Cause) และแก้ไขที่ต้นตอ
3. **Analyze Before Retrying:** หากคำสั่งรันไม่สำเร็จ ห้ามรันคำสั่งเดิมซ้ำโดยไม่มีการปรับเปลี่ยนหรือวิเคราะห์สาเหตุความล้มเหลว

## 7. Documentation Rules
1. **Markdown Standards:** จัดทำเอกสารในรูปแบบ GitHub-flavored Markdown ที่อ่านง่าย ใช้โครงสร้าง Heading, Bullet points, Alert blocks และ Table อย่างเหมาะสม
2. **Synchronized Documentation:** เมื่อมีการเปลี่ยนแปลงการตั้งค่า Port, Environment Variables, Docker Commands หรือ Structure ต้องทำการอัปเดตเอกสารใน `docs/planning/` และ `README.md` ให้ตรงกันเสมอ

## 8. Testing Rules
1. **Verification Mandatory:** ห้ามประกาศว่างานเสร็จสิ้น หรือ Fix Bug สำเร็จ จนกว่าจะมีการรันคำสั่งทดสอบจริงและได้ผลลัพธ์ที่ผ่านยืนยัน
2. **Testing Coverage Requirements:** 
   - Backend: ทดสอบ API Endpoints, Status Codes, Response Formats และ DB connection
   - Frontend: ทดสอบ Render UI, Form Validations และ API Integration

## 9. Git Commit Rules
1. **Conventional Commits:** ใช้รูปแบบ Conventional Commits เสมอ ได้แก่:
   - `feat:` สำหรับฟีเจอร์ใหม่
   - `fix:` สำหรับการแก้ไข Bug
   - `docs:` สำหรับการปรับปรุงเอกสาร
   - `chore:` สำหรับงานตั้งค่า ระบบ หรือ dependencies
   - `refactor:` สำหรับการปรับแต่งโครงสร้างโค้ดโดยไม่เปลี่ยน พฤติกรรม
2. **Atomic Commits:** เสนอการ Commit ที่เป็นระเบียบ แบ่งแยกตามขอบเขตงานใน Phase นั้นๆ

## 10. Forbidden Actions
1. ❌ **ห้ามเขียนโค้ดก่อนได้รับการอนุมัติแผนงาน (Planning)**
2. ❌ **ห้ามข้าม Phase หรือเพิ่ม Feature นอกเหนือจากที่ระบุไว้**
3. ❌ **ห้ามเปลี่ยน Tech Stack, Database Schema หรือ API Contract โดยไม่แจ้งเหตุผลและขออนุมัติ**
4. ❌ **ห้ามใส่ Hardcoded Secrets, Passwords, Tokens หรือข้อมูลส่วนบุคคลจริงในซอร์สโค้ดและเอกสาร**
5. ❌ **ห้ามใส่ `version` ใน `docker-compose.yml`**
6. ❌ **ห้ามใช้ Port 5000 สำหรับ Backend บน macOS Host**
7. ❌ **ห้ามใช้ `localhost` หรือ `127.0.0.1` ในการสื่อสารระหว่าง Container ภายใน Docker Network (ต้องใช้ชื่อ Service `db`)**

## 11. Required Output Format
* ผลลัพธ์ต้องส่งออกเป็น Markdown ที่มีโครงสร้างชัดเจน
* หากเป็นการสร้างไฟล์ ให้ระบุ Path ไฟล์แบบ Clickable Link (`file:///...`)
* คำตอบต้องกระชับ ตรงประเด็น และสรุปเฉพาะสาระสำคัญที่ผู้ใช้ต้องรับทราบหรืออนุมัติ

## 12. How AI Should Ask Questions
* ถามเมื่อมีความคลุมเครือในข้อกำหนดทางธุรกิจ หรือจำเป็นต้องตัดสินใจในจุดสำคัญทาง Architecture
* ระบุทางเลือก (Options) พร้อมข้อดี-ข้อเสีย และข้อเสนอแนะจาก AI เพื่อช่วยให้ผู้ใช้ตัดสินใจได้ง่ายขึ้น

## 13. How AI Should Handle Unclear Requirements
* หยุดและสอบถามความชัดเจนจากผู้ใช้ก่อนเริ่มลงมือทำ
* ห้ามทาย หรือสมมุติข้อกำหนดเองในส่วนที่มีผลกระทบสูงต่อโครงสร้างระบบ

## 14. How AI Should Report Changes
* หากการทำงานมีความจำเป็นต้องเบี่ยงเบนจากแผนเดิม AI ต้องรายงาน:
  1. สิ่งที่ต้องเปลี่ยน (What changes)
  2. สาเหตุความจำเป็นทางเทคนิค (Why it is necessary)
  3. ผลกระทบต่อส่วนอื่นๆ (Impact analysis)
  4. ทางเลือกสำหรับการแก้ไข (Proposed solutions)

## 15. Docker Development Rules
1. **Compose Specification:** ใช้ `docker-compose.yml` สำหรับ Development Environment โดย**ไม่ใส่ attribute `version`** ที่ด้านบนสุด
2. **Port Allocation:**
   - Frontend: Host Port `5173` -> Container Port `5173`
   - Backend: Host Port `5001` -> Container Port `5001` (หลีกเลี่ยง Port `5000` เนื่องจากชนกับ macOS AirPlay Receiver)
   - MySQL: Host Port `3307` -> Container Port `3306`
   - phpMyAdmin: Host Port `8081` -> Container Port `80`
3. **Architecture Compatibility:** สำหรับ Apple Silicon (M1-M4) หาก Image phpMyAdmin ไม่รองรับ ARM ให้ระบุ `platform: linux/amd64` เฉพาะ Service ที่จำเป็น
4. **Volume Strategy:**
   - ใช้ Bind Mounts สำหรับ Source Code (`./frontend:/app` และ `./backend:/app`) เพื่อรองรับ Hot Reload
   - ใช้ Anonymous Volume สำหรับ `node_modules` (`/app/node_modules`) เพื่อป้องกัน Host overwrite และปัญหา Cross-platform binary compatibility
5. **Internal DNS Communication:** Backend และ phpMyAdmin ต้องติดต่อ MySQL ผ่านชื่อ Service `db` ที่ Internal Port `3306` เท่านั้น
6. **Healthcheck & Service Dependency:** MySQL ต้องกำหนด `healthcheck` (ใช้ `mysqladmin ping`) และ Service ที่พึ่งพา DB ต้องระบุ `depends_on: db: condition: service_healthy`
7. **Dependency Update Rule:** เมื่อมีการเพิ่ม/แก้ไข `package.json` ต้องแจ้งเตือนและระบุคำสั่งในการ Rebuild Container (`docker compose up -d --build`) หรือ Restart Service เสมอ

## 16. Git / GitHub Workflow Rules
1. **Pre-commit Check:** ตรวจสอบ `git status` เสมอ เพื่อให้มั่นใจว่าไม่มีไฟล์ที่ไม่ต้องการถูกติดตาม โดยเฉพาะ `.env`
2. **Gitignore Scope:** `.gitignore` ต้องครอบคลุม `.env`, `node_modules`, `dist`, `.vite`, `*.log`, และไฟล์ Local Metadata ต่างๆ
3. **Commit Recommendations:** ทุก Phase ต้องเสนอแนะ Git Commit Message ที่ชัดเจน ตามมาตรฐาน Conventional Commits
4. **Documentation Updates:** เมื่อคำสั่งรัน, Port mapping, Dependencies หรือ Workflow เปลี่ยน ต้องอัปเดต `README.md` ควบคู่กันเสมอ
5. **GitHub CLI Usage:** สามารถใช้ GitHub CLI (`gh`) เพื่อการจัดการ Repository ได้ แต่ห้ามทำการ Login/Authorize แทนผู้ใช้โดยไม่แจ้งล่วงหน้า
6. **No Secrets Policy:** ห้าม Commit Secrets, Production Credentials, API Keys หรือข้อมูลจริงลง Git โดยเด็ดขาด
7. **README Guidelines:** หาก Repository ยังไม่มี README ที่สมบูรณ์ ให้เสนอแนะโครงสร้าง README ประกอบด้วย: Project Name, Description, Tech Stack, Installation & Running, Port Mapping, Docker Commands, Project Folder Structure, และ License/Owner

## 17. Skill / Project Instruction Rules
1. **Instruction First:** AI ต้องอ่านและทำความเข้าใจ Project Instructions หรือ Skills ที่เกี่ยวข้องก่อนเริ่มงานกับโปรเจกต์เสมอ
2. **Skill Source of Truth:** หากมีไฟล์ `.agents/skills/[skill-name]/SKILL.md` ให้ใช้เป็นแหล่งรวมกติกาหลักร่วมกับเอกสารใน `docs/planning/`
3. **Skill Naming Convention:** ชื่อ Skill ต้องเป็นอักษรพิมพ์เล็ก (lowercase) และใช้เครื่องหมายขีดกลาง `-` คั่น เช่น `piem-dev` หรือ `damrongdham-dev`
4. **YAML Frontmatter:** ไฟล์ `SKILL.md` ต้องมี YAML Frontmatter ระบุ `name` และ `description` ที่สั้น กระชับ ชัดเจน ตรงกับวัตถุประสงค์โปรเจกต์
5. **Required Skill Sections:** Skill Document ควรกำหนดหัวข้อสำคัญ: When to Use, When NOT to Use, Project Architecture, Service Map & Ports, Network Rules, Environment Variables, Commands, Coding Guidelines, Output Format, และ Examples
6. **Reference Over Duplication:** ข้อมูลที่มีความยาว เช่น API Specification หรือ Database Schema ให้อ้างอิงพาธไฟล์จาก `docs/planning/` แทนการคัดลอกข้อมูลทั้งหมดลงใน Skill
7. **Synchronization:** เมื่อมีการเปลี่ยนแปลง Architecture, Ports, Services หรือ Conventions ต้องทำการปรับปรุง Skill Document และ Planning Docs ให้สอดคล้องกันทันที

## 18. Environment & Secret Handling Rules
1. **Local Configuration:** ใช้ไฟล์ `.env` สำหรับเก็บค่าคอนฟิกใน Local Development และจัดทำไฟล์ `.env.example` เพื่อเป็นแม่แบบแสดงโครงสร้างตัวแปร
2. **Zero Secrets Leakage:** ห้ามใส่ Secret จริง (เช่น Passwords, Private Keys, Production Connection Strings) ในซอร์สโค้ด, Prompt, เอกสาร README หรือ Planning Docs
3. **Production Secrets:** สภาพแวดล้อม Production (เช่น Railway) ต้องตั้งค่าผ่าน Platform Environment Variables บน Dashboard ของ Platform นั้นๆ เท่านั้น
4. **Placeholder Standard:** เมื่อแสดงตัวอย่างคอนฟิกในเอกสาร ให้ใช้ค่า Placeholder ที่ปลอดภัยเสมอ เช่น `your_db_password`, `your_jwt_secret`
