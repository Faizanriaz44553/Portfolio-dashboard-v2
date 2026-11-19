# Portfolio CMS & Admin Dashboard (v2)

A custom Content Management System (CMS) built with React, Ant Design, Firebase, and Cloudinary to dynamically manage and update my personal developer portfolio without touching the codebase.

**Live Demo:** [portfolio-dashboard-v2-flame.vercel.app](https://portfolio-dashboard-v2-flame.vercel.app/)  
**Live Portfolio:** [faizanriazdev.vercel.app](https://faizanriazdev.vercel.app/)

> **Recruiter / Demo Access:**  
> **Email:** `faizan@gmail.com`  
> **Password:** `faizan12345`

---

## The Problem
My initial portfolio was built with hardcoded static data. Every time I completed a new project, earned a certificate, or wanted to update my bio and profile picture, I had to manually edit code files, manage static image assets in folders, commit changes, and redeploy the application. This slowed down updates and made content management rigid.

## What I Built
To eliminate code-level edits for routine updates, I built a dedicated, authenticated Admin Dashboard that connects directly to my live portfolio database and media cloud:

* **Projects Management:** Full CRUD (Create, Read, Update, Delete) operations to add new projects with cover images, edit descriptions/links, and remove outdated work.
* **Media & Image Pipeline:** Integrated **Cloudinary** to handle image uploads (profile photos, project previews, and certificates) seamlessly, storing optimized CDN URLs directly in the database.
* **Profile & Bio Control:** Update hero/header text, "About Me" content, and profile pictures dynamically.
* **Certificates & Achievements:** Upload, add, and delete certification records on the fly.
* **Visitor Comments Moderation:** View, manage, and moderate comments submitted through the portfolio.
* **Secure Authentication:** Protected admin routes powered by Firebase Authentication so only authorized users can modify live data.

## Tech Stack
* **Frontend:** React.js, JavaScript (ES6+)
* **UI Library:** Ant Design (Tables, Modals, Forms, Upload, Layout components)
* **Backend & Database:** Firebase (Firestore Database & Firebase Authentication)
* **Media Management & CDN:** Cloudinary
* **Deployment:** Vercel

## What I Learned
* **Decoupling Content & Media from Code:** Separating structured text data (Firestore) from heavy media assets (Cloudinary) so a single database serves both the admin dashboard and the public-facing portfolio in real time.
* **Async Media Upload Workflows:** Handling file uploads via Cloudinary APIs inside Ant Design forms—managing loading states, generating secure image URLs, and linking them to Firestore documents cleanly.
* **Data Security:** Implementing Firebase Auth guards and security rules to keep read access public for the portfolio while locking write/delete operations strictly to the admin dashboard.

---

## Local Setup

```bash
# Clone the repository
git clone [https://github.com/Faizanriaz44553/Portfolio-dashboard-v2.git](https://github.com/Faizanriaz44553/Portfolio-dashboard-v2.git)

# Navigate to the project folder
cd Portfolio-dashboard-v2

# Install dependencies
npm install

# Start the development server
npm run dev

