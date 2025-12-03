# 🌐 Campus Voice – SREC

**Campus Voice – SREC** is a web-based anonymous grievance and feedback platform built for the students and staff of **Sri Ramakrishna Engineering College (SREC)**.

It allows students to **raise issues safely and anonymously (to peers)** while giving **admins a clear, structured view** of problems happening on campus — with proper categorization, visibility, and tracking.

> 🧪 Current Phase: **Frontend-Only (React + Tailwind)**  
> Backend, AI categorization, and analytics will be integrated in upcoming phases.

---

## 🎯 Vision

- Create a **single digital platform** for all campus grievances.
- Encourage **free and fearless reporting** by making posts anonymous to students.
- Ensure **transparency & accountability** for authorities through clear dashboards.
- Act as a foundation for **AI-assisted issue categorization and prioritization**.

---

## 👥 User Roles (Current Phase)

### 🎓 Student

- Login using **college email** (`@srec.ac.in`).
- Post grievances **with mandatory image proof** to avoid misinformation.
- View a **home feed** of campus issues posted by others (anonymously).
- Use a **“Posts” section** to:
  - Create new posts (complaints).
  - View previously posted grievances (My Posts).
- Mobile-first experience with **bottom navigation** (Home, Posts, Notifications, Profile).

> 🕵️ Student posts are anonymous **to other students**, but visible with identity to admin (for security).

---

### 🧑‍💼 Admin

> Admin UI is part of the architecture and is being gradually developed.

Planned features include:

- Role-based login (e.g., Hostel, Academics, Infrastructure).
- Dashboard with:
  - Open, In-progress, Resolved complaint counts.
  - Category-wise and priority-wise breakdown.
- Complaint detail view with:
  - Timeline, status updates, media, escalation options.
- Ability to track frequent issues and take proactive actions.

---

## 🧩 Tech Stack

### Frontend

- ⚛ **React.js** (functional components, hooks)
- 🎨 **Tailwind CSS** — mobile-first styling
- 🧭 **React Router DOM** — routing between pages
- 📱 **Bottom Navigation Bar** for student view (PWA-style UX)
- 📸 Image upload & preview using browser APIs

### PWA (Planned / Partial)

- Web App Manifest (name, icons, theme)
- Service worker for caching
- Installable experience (Add to Home Screen)

### Backend (Upcoming)

- 🐍 **Flask (Python)** or Node backend
- 🗃 **SQL database** (PostgreSQL)
- 🤖 AI components:
  - NLP for automatic complaint categorization
  - Priority scoring and routing
  - Abuse or spam detection

---

## 📱 Key UI Features (Student Side)

- **Login & Signup**:
  - Email + password based
  - Only `@srec.ac.in` addresses allowed

- **Onboarding Slides (New Users)**:
  1. Report campus issues anonymously and fearlessly.
  2. Track status transparently.
  3. Make SREC a better place with your voice.

- **Home Feed**:
  - Instagram-style feed
  - Each post:
    - Image (mandatory)
    - Title
    - Description
    - Category tag
    - Anonymous label (e.g., “Anonymous Student”)
  - Mobile-friendly cards

- **Posts Page**:
  - Top tab switch:
    - `Create` → form to submit grievance
    - `My Posts` → list of user’s own submitted grievances
  - Create form includes:
    - Title
    - Description
    - Category (Hostel, Mess, Academics, Transport, etc.)
    - **Image Upload (required)**
  - Smooth, clean layout built with Tailwind

## 🛠️ Setup & Run Locally

### 1️⃣ Clone the Repository
git clone https://github.com/TharunSaro/Campus-Voice-SREC.git
cd Campus-Voice-SREC

### 2️⃣ Install Dependencies
npm install

### 3️⃣ Run the Dev Server
npm run dev


Open the browser at: `http://localhost:5173/`  
(Port may differ depending on your setup.)
---

## 🧪 Testing on Phone (Same Wi-Fi)

- Ensure your laptop and phone are on the same Wi-Fi.
- Run dev server with host flag (if using Vite):

npm run dev -- --host

- Terminal will show something like:

Network: http://192.168.xx.xx:5173/


- Open that Network URL in your phone browser.
---

## 👨‍💻 Team

| Name             | Role                           | Department |
|------------------|--------------------------------|------------|
| Tharun S         | Frontend, Architecture         | CSE        |
| Sudharsh M       | Backend & AI                   | CSE        |
| Suriya Prakash M | UI/UX, Integration             | CSE        |

> This repository is private and restricted to the project team and faculty reviewers.

---

## 🔮 Roadmap

- ✅ Student login, signup, onboarding  
- ✅ Student home feed with anonymous posts  
- ✅ Posts page (Create + My Posts) with image upload  
- ✅ Mobile-first bottom navigation  
- 🔜 Admin dashboard UI  
- 🔜 Backend API integration  
- 🔜 AI-based auto-routing & prioritization of complaints  
- 🔜 Push notifications & email alerts  
- 🔜 Analytics dashboards for authorities  
---

## 📜 License

This project is developed as part of an academic final-year project at Sri Ramakrishna Engineering College (SREC), Coimbatore.  
All rights reserved. Unauthorized distribution is not allowed.
---

