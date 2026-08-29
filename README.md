# Personal Income & Expense Management System (ระบบจัดการรายรับ-รายจ่ายส่วนบุคคล)

ระบบ Web Application สำหรับจัดการรายรับ-รายจ่ายส่วนบุคคล ช่วยวางแผน สรุปภาพรวมการเงิน บันทึกรายการย้อนหลัง และวิเคราะห์สถิติทางการเงินอย่างปลอดภัย

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite 5, MUI 5 (Material UI), React Router v6
- **Backend:** Node.js 20 LTS, Express 4, JWT Authentication
- **Database:** MySQL 8.0 (Relational Database)
- **Container Orchestration:** Docker Compose (Development) / Railway (Production Single Container)

## 📁 Project Structure

```text
PIEM_System/
├── .env.example              # แม่แบบตัวแปรสภาพแวดล้อม
├── .env                      # ตัวแปรสภาพแวดล้อมจริง (Git Ignored)
├── .gitignore                # กฎการละเว้นไฟล์ Git
├── README.md                 # เอกสารคำแนะนำโปรเจกต์
├── docs/
│   └── planning/             # เอกสารการวางแผนและสถาปัตยกรรม (00-11)
├── db/
│   └── init/                 # สคริปต์เริ่มต้นฐานข้อมูล (01-init.sql)
├── backend/                  # RESTful API Backend Service
│   ├── package.json
│   └── src/
│       └── server.js         # Backend Entry Point
└── frontend/                 # React Single Page Application (SPA)
    └── package.json
```

## 🔌 Service Ports Allocation

| Service | Host Port | Container Port | Purpose |
| :--- | :---: | :---: | :--- |
| **Frontend** | `5173` | `5173` | React + Vite Dev Server |
| **Backend** | `5001` | `5001` | Express REST API Server |
| **MySQL** | `3307` | `3306` | MySQL 8.0 Database Engine |
| **phpMyAdmin** | `8081` | `80` | Database Web GUI Management |

## 🚀 Getting Started

### Prerequisites
- Node.js 20 LTS หรือสูงกว่า
- Docker Desktop & Docker Compose

### Step 1: Environment Setup
คัดลอกไฟล์ `.env.example` ไปเป็น `.env`:
```bash
cp .env.example .env
```

### Step 2: Install Dependencies (Local Development)

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

## 📊 Development Status

| Phase | Description | Status |
| :---: | :--- | :---: |
| **Phase 0** | Requirement & Architecture Validation | ✅ Completed |
| **Phase 1** | Project Setup & Initial Structure | ✅ Completed & Verified |
| **Phase 2** | Database Schema & Seed Data | ✅ Completed & Verified |
| **Phase 3** | Backend Core & MySQL Connection | ✅ Completed & Verified |
| **Phase 4** | Authentication & Authorization API | ⏳ Next Up |
| **Phase 5+**| API & Frontend Implementation | 📅 Pending |

## 📄 License
Privately owned personal application.
