# 🎓 Student Performance Portal
> **A Comprehensive Academic Performance Tracking, Continuous Assessment Evaluation (CAE), and Peer-Mentorship Management System.**

[![PHP Version](https://img.shields.io/badge/PHP-8.x%20%7C%207.4-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Apache](https://img.shields.io/badge/Apache-XAMPP-D22128?style=for-the-badge&logo=apache&logoColor=white)](https://www.apachefriends.org/)
[![Project Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)](#)
[![Academic Project](https://img.shields.io/badge/Academic-2nd%20Year%20Mini%20Project-blueviolet?style=for-the-badge)](#)

---

## 📌 Project Overview

The **Student Performance Portal** is a web-based educational management and analytics platform engineered as a **2nd Year Computer Science & Engineering College Mini-Project**. 

In conventional academic institutions, assessing student performance across Continuous Assessment Examinations (CAE) is often fragmented, manual, and reactive. This project provides an automated, data-driven solution that categorizes learners into performance tiers (Slow, Intermediate, Advanced), facilitates peer-mentorship mapping, tracks remedial assignments, and showcases student achievements through a unified portal.

---

## 👨‍💻 Project Lead & Authors

* **Lead Developer & System Architect**: **Aryan Mohite** ([@AryanMohite0](https://github.com/AryanMohite0))
  * **Academic Year**: 2nd Year (Sophomore), Department of Computer Science & Engineering
  * **Responsibilities**:
    * Designed the complete full-stack architecture and modular REST API interface.
    * Modeled and normalized the relational database schema in MySQL.
    * Engineered the frontend single-page application (SPA) with responsive glassmorphism UI.
    * Implemented automated CAE mark evaluation algorithms and peer-mentorship pairing logic.

---

## 💡 Problem Statement & Objectives

* **Early Academic Intervention**: Automatically identify at-risk ("Slow") learners immediately after CAE-1 and CAE-2 tests to enable timely remedial action.
* **Peer Learning Facilitation**: Bridge the gap between Advanced and Slow learners through systematic mentor-mentee mapping.
* **Paperless Assignment & Certification Management**: Centralize remedial assignments, progress tracking, and certificate verifications.
* **Role-Based Transparency**: Offer distinct, tailored views for both administrators/faculty and students.

---

## ✨ Key Features & Modules

### 🔐 1. Role-Based Access Control (RBAC)
* **Student Portal**: Secure login & self-registration with institutional credentials.
* **Admin / Faculty Portal**: Comprehensive administrative dashboard for institution-wide analytics and record management.

### 📊 2. Continuous Assessment (CAE) Evaluation Engine
* Tracks multi-subject performance across **CAE-1** and **CAE-2** (each evaluated out of 20 marks).
* Real-time automated student categorization:
  * 🔴 **Slow Learners**: Below qualifying threshold; flagged for remedial mentoring and assignments.
  * 🟡 **Intermediate Learners**: Demonstrating steady progress with targeted subject improvement.
  * 🟢 **Advanced Learners**: High-performing students eligible for peer mentorship and honors certificates.

### 🤝 3. Peer-Mentorship Engine
* Assigns Advanced Learners as academic mentors to Slow Learners.
* Fosters collaborative learning within the department, tracked transparently by administrators.

### 📋 4. Remedial Assignment & Task Manager
* Faculty can assign remedial problem sets and project links (Google Drive / GitHub) with explicit submission deadlines.
* Live status tracking (`Pending` / `Submitted`).

### 📜 5. Honors & Certification Vault
* Dedicated repository for advanced students to submit national/international certifications and academic recognitions.

### 🔔 6. In-App Notification System
* Instant alerts for students upon category updates, mentor assignments, and newly assigned tasks.

---

## 🛠️ Technology Stack

| Domain | Technologies & Libraries |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Modern Glassmorphic UI, CSS Variables, Flexbox/Grid), JavaScript (Vanilla ES6+) |
| **Backend** | PHP 7.4 / 8.x (RESTful API Architecture, JSON Endpoints) |
| **Database** | MySQL 5.7+ / MariaDB 10.4+ (Normalized Relational Tables with InnoDB Engine) |
| **Server / Environment** | Apache HTTP Server (XAMPP Suite) |
| **Fonts & Icons** | Google Fonts (*Sora*, *DM Sans*), Native UI Icons |

---

## 🗄️ Database Architecture

The system utilizes a relational schema under `student_performance_db`:

```
student_performance_db
 ├── admins            (id, name, email, password)
 ├── subjects          (id, name)
 ├── students          (id, roll_number, name, email, password, overall_category)
 ├── student_marks     (id, student_id, subject_id, cae1, cae2, category)
 ├── mentor_mapping    (id, mentor_id, mentee_id)
 ├── assignments       (id, student_id, subject_id, assignment_link, deadline, status)
 ├── certificates      (id, student_id, link, description, uploaded_at)
 ├── notifications     (id, student_id, type, message, is_read, created_at)
 └── kv_store          (key, value) [System state & metadata synchronization]
```

---

## 📁 Repository Structure

```plaintext
student_performance_portal/
│
├── css/
│   └── style.css            # Custom CSS with design tokens, dark accents & animations
│
├── js/
│   └── script.js            # Frontend application controller & REST API communication
│
├── php/
│   └── api.php              # Backend REST API handling CRUD operations & JSON responses
│
├── includes/
│   └── db.php               # Database connection handler with auto-schema initialisation
│
├── database.sql             # SQL schema backup for manual import if required
├── fix_db.php               # Maintenance & database reset utility
├── index.php                # Main application entry point (Landing, Auth, Dashboards)
└── README.md                # Project documentation
```

---

## 🚀 Installation & Local Setup

### Prerequisites
* [XAMPP](https://www.apachefriends.org/) (with Apache and MySQL / MariaDB).
* A modern web browser (Google Chrome, Microsoft Edge, Firefox, Brave).
* Git installed on your system.

### Step-by-Step Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AryanMohite0/student_performance_portal.git
   ```

2. **Move into XAMPP Web Directory**:
   Move or copy the project folder into your XAMPP `htdocs` directory:
   ```text
   C:\xampp\htdocs\student_performance_portal_php
   ```
   *(Or create a directory link/junction if working from a separate directory).*

3. **Start XAMPP Services**:
   * Open the **XAMPP Control Panel**.
   * Click **Start** for **Apache**.
   * Click **Start** for **MySQL** (ensure port `3306` is free).

4. **Database Auto-Initialization**:
   * The application is engineered with an **auto-initialization routine** in `includes/db.php`.
   * Opening the application in your browser automatically creates the `student_performance_db` database and its relational tables on first run.
   * *(Optional)*: Alternatively, you can import `database.sql` via **phpMyAdmin** (`http://localhost/phpmyadmin`).

5. **Launch Application in Browser**:
   * If Apache runs on default port `80`:
     ```text
     http://localhost/student_performance_portal_php/
     ```
   * If Apache runs on custom port `8080`:
     ```text
     http://localhost:8080/student_performance_portal_php/
     ```

---

## 🔑 Demo Credentials

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@college.edu` | `admin123` | Full control: Mark entry, student management, mentor mapping |
| **Student (Demo 1)** | `arun@college.edu` | `student123` | Student view: Marks, mentor details, assignments |
| **Student (Demo 2)** | `priya@college.edu` | `student123` | Student view: Intermediate performance overview |
| **Student (Demo 3)** | `rahul@college.edu` | `student123` | Advanced student view: Mentee list, certificate submission |

---

## 🎯 Learning Outcomes & Key Takeaways

Through this mini-project, the following core software engineering concepts were mastered:
* **Full-Stack Integration**: Developing a decoupled client-server architecture communicating via asynchronous JSON HTTP requests (`fetch` API & REST backend).
* **Database Normalization & Management**: Designing relational databases with primary/foreign key associations, and managing data integrity under MySQLi.
* **State Management**: Managing client-side session states cleanly without heavy third-party frameworks.
* **Defensive Engineering**: Building diagnostic scripts (`fix_db.php`) and self-provisioning database migration checks.

---

## 📄 License & Attribution

This project is created for academic and educational purposes under the **2nd Year Engineering Curriculum**. 
Contributions, suggestions, and feedback are welcome!

Developed with 💻 by **Aryan Mohite** ([@AryanMohite0](https://github.com/AryanMohite0)).
