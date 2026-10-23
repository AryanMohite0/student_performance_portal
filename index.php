<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Student Performance Portal</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<div id="toast-container"></div>

<!-- ══════════════════════════════════════════
     LANDING PAGE
══════════════════════════════════════════ -->
<div id="page-landing" class="page active">
  <div class="landing-card">
    <div class="landing-logo">🎓</div>
    <h1>Student Performance Portal</h1>
    <p>Track, analyze, and improve student performance with CAE-based categorization</p>
    <div class="landing-btns">
      <button class="btn-land primary" onclick="goTo('student-auth')">👩‍🎓 Student Login</button>
      <button class="btn-land outline" onclick="goTo('admin-auth')">🔐 Admin Login</button>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════
     STUDENT AUTH
══════════════════════════════════════════ -->
<div id="page-student-auth" class="page">
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-logo">
        <div class="icon">👩‍🎓</div>
        <h1>Student Portal</h1>
        <p>Login or register to view your performance</p>
      </div>
      <div class="demo-hint">
        <strong>Demo credentials:</strong><br>
        Email: <code>arun@college.edu</code> &nbsp;|&nbsp; Password: <code>student123</code>
      </div>
      <div class="auth-tabs">
        <button class="auth-tab active" id="s-tab-login" onclick="switchStudentTab('login')">Login</button>
        <button class="auth-tab" id="s-tab-register" onclick="switchStudentTab('register')">Register</button>
      </div>

      <!-- Login -->
      <div id="s-login-form">
        <div id="s-login-alert"></div>
        <div class="form-group">
          <label>Email Address</label>
          <input class="input" id="sl-email" type="email" placeholder="your@college.edu" onkeydown="if(event.key==='Enter')studentLogin()">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input class="input" id="sl-pass" type="password" placeholder="••••••••" onkeydown="if(event.key==='Enter')studentLogin()">
        </div>
        <button class="auth-btn navy" onclick="studentLogin()">Login →</button>
        <div class="auth-divider">or</div>
        <button class="auth-btn ghost" onclick="goTo('landing')">← Back to Home</button>
      </div>

      <!-- Register -->
      <div id="s-register-form" style="display:none">
        <div id="s-reg-alert"></div>
        <div class="form-group">
          <label>Roll Number</label>
          <input class="input" id="sr-roll" type="text" placeholder="e.g. CS004">
        </div>
        <div class="form-group">
          <label>Full Name</label>
          <input class="input" id="sr-name" type="text" placeholder="Your full name">
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input class="input" id="sr-email" type="email" placeholder="your@college.edu">
        </div>
        <div class="form-group">
          <label>Password (min 6 chars)</label>
          <input class="input" id="sr-pass" type="password" placeholder="••••••••">
        </div>
        <button class="auth-btn navy" onclick="studentRegister()">Register & Login →</button>
        <div class="auth-divider">or</div>
        <button class="auth-btn ghost" onclick="goTo('landing')">← Back to Home</button>
      </div>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════
     ADMIN AUTH
══════════════════════════════════════════ -->
<div id="page-admin-auth" class="page">
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-logo">
        <div class="icon">🔐</div>
        <h1>Admin Portal</h1>
        <p>Manage students, marks & performance</p>
      </div>
      <div class="demo-hint">
        <strong>Admin credentials:</strong><br>
        Email: <code>admin@college.edu</code> &nbsp;|&nbsp; Password: <code>admin123</code>
      </div>
      <div id="a-login-alert"></div>
      <div class="form-group">
        <label>Email Address</label>
        <input class="input" id="al-email" type="email" placeholder="admin@college.edu" onkeydown="if(event.key==='Enter')adminLogin()">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input class="input" id="al-pass" type="password" placeholder="••••••••" onkeydown="if(event.key==='Enter')adminLogin()">
      </div>
      <button class="auth-btn navy" onclick="adminLogin()">Login →</button>
      <div class="auth-divider">or</div>
      <button class="auth-btn ghost" onclick="goTo('landing')">← Back to Home</button>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════
     ADMIN PORTAL
══════════════════════════════════════════ -->
<div id="page-admin-portal" class="page">
  <nav class="sidebar">
    <div class="sidebar-logo">
      <div class="icon">🎓</div>
      <h2>Student Portal</h2>
      <p>Admin Dashboard</p>
    </div>
    <div class="sidebar-nav">
      <div class="nav-link active" data-page="dashboard" onclick="adminNav('dashboard',this)"><span class="icon">📊</span> Dashboard</div>
      <div class="nav-link" data-page="students" onclick="adminNav('students',this)"><span class="icon">👨‍🎓</span> Students</div>
      <div class="nav-link" data-page="subjects" onclick="adminNav('subjects',this)"><span class="icon">📚</span> Subjects</div>
      <div class="nav-link" data-page="categories" onclick="adminNav('categories',this)"><span class="icon">🏷️</span> Category View</div>
      <div class="nav-link" data-page="mentors" onclick="adminNav('mentors',this)"><span class="icon">🤝</span> Mentor Mapping</div>
      <div class="nav-link" data-page="certificates" onclick="adminNav('certificates',this)"><span class="icon">📜</span> Certificates</div>
    </div>
    <div class="sidebar-footer">
      <div class="admin-user">
        <div class="admin-avatar">👤</div>
        <div class="admin-user-info">
          <h4 id="admin-display-name">Admin</h4>
          <p>Administrator</p>
        </div>
      </div>
      <button class="btn-logout" onclick="adminLogout()">🚪 Logout</button>
    </div>
  </nav>

  <div class="main-content">
    <div class="topbar">
      <h1 id="topbar-title">Dashboard</h1>
    </div>

    <!-- Dashboard -->
    <div class="admin-page active" id="admin-page-dashboard">
      <div class="stats-grid" id="admin-stats-grid">
        <div class="stat-card"><div class="stat-icon">👨‍🎓</div><div class="stat-info"><h3 id="s-total">0</h3><p>Total Students</p></div></div>
        <div class="stat-card"><div class="stat-icon">📚</div><div class="stat-info"><h3 id="s-subj">0</h3><p>Subjects</p></div></div>
        <div class="stat-card" style="border-left:4px solid var(--slow)"><div class="stat-icon" style="background:var(--slow-bg)">🔴</div><div class="stat-info"><h3 id="s-slow" style="color:var(--slow)">0</h3><p>Slow Learners</p></div></div>
        <div class="stat-card" style="border-left:4px solid var(--inter)"><div class="stat-icon" style="background:var(--inter-bg)">🟡</div><div class="stat-info"><h3 id="s-inter" style="color:var(--inter)">0</h3><p>Intermediate</p></div></div>
        <div class="stat-card" style="border-left:4px solid var(--adv)"><div class="stat-icon" style="background:var(--adv-bg)">🟢</div><div class="stat-info"><h3 id="s-adv" style="color:var(--adv)">0</h3><p>Advanced</p></div></div>
      </div>
      <div class="card">
        <div class="card-header"><span>🕐</span><h2>Recent Students</h2><div class="card-header-actions"><button class="btn primary sm" onclick="adminNav('students',document.querySelector('[data-page=students]'))">View All</button></div></div>
        <div class="table-wrap"><table><thead><tr><th>Roll No</th><th>Name</th><th>Category</th><th>Mentor</th></tr></thead><tbody id="recent-students-tbody"></tbody></table></div>
      </div>
    </div>

    <!-- Students -->
    <div class="admin-page" id="admin-page-students">
      <div class="card">
        <div class="card-header">
          <span>👨‍🎓</span><h2>All Students</h2>
          <div class="card-header-actions"><button class="btn primary" onclick="openAddModal()">+ Add Student</button></div>
        </div>
        <div class="card-body">
          <div class="filter-tabs">
            <button class="filter-btn active" onclick="filterStudents('',this)">All</button>
            <button class="filter-btn" onclick="filterStudents('slow',this)">🔴 Slow</button>
            <button class="filter-btn" onclick="filterStudents('intermediate',this)">🟡 Intermediate</button>
            <button class="filter-btn" onclick="filterStudents('advanced',this)">🟢 Advanced</button>
          </div>
          <div class="table-wrap"><table><thead><tr><th>Roll</th><th>Name</th><th>Email</th><th>Category</th><th>Mentor</th><th>Actions</th></tr></thead><tbody id="students-tbody"></tbody></table></div>
        </div>
      </div>
    </div>

    <!-- Subjects -->
    <div class="admin-page" id="admin-page-subjects">
      <div class="card" style="max-width:480px">
        <div class="card-header"><span>➕</span><h2>Add Subject</h2></div>
        <div class="card-body">
          <div id="subj-alert"></div>
          <div style="display:flex;gap:10px">
            <input class="input" id="subj-input" placeholder="e.g. Mathematics" style="flex:1" onkeydown="if(event.key==='Enter')addSubject()">
            <button class="btn primary" onclick="addSubject()">Add</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span>📚</span><h2>Subjects List</h2></div>
        <div class="table-wrap"><table><thead><tr><th>#</th><th>Subject Name</th><th>Action</th></tr></thead><tbody id="subjects-tbody"></tbody></table></div>
      </div>
    </div>

    <!-- Category View -->
    <div class="admin-page" id="admin-page-categories">
      <div id="cat-view-container"></div>
    </div>

    <!-- Mentors -->
    <div class="admin-page" id="admin-page-mentors">
      <div class="card">
        <div class="card-header"><span>🤝</span><h2>Mentor Assignments</h2></div>
        <div class="card-body" id="mentors-list"></div>
      </div>
    </div>

    <!-- Certificates -->
    <div class="admin-page" id="admin-page-certificates">
      <div class="cert-form">
        <h3>📜 Submit Certificate (Advanced Learners)</h3>
        <div id="cert-alert"></div>
        <div class="row-2" style="margin-bottom:10px">
          <div class="form-group" style="margin:0">
            <label>Select Student</label>
            <select class="input" id="cert-student-sel" style="width:100%"></select>
          </div>
          <div class="form-group" style="margin:0">
            <label>Drive Link</label>
            <input class="input" id="cert-link" placeholder="https://drive.google.com/..." style="width:100%">
          </div>
        </div>
        <div class="form-group">
          <label>Description (optional)</label>
          <input class="input" id="cert-desc" placeholder="e.g. National Science Olympiad Certificate" style="width:100%">
        </div>
        <button class="btn amber" onclick="submitCertificate()">Submit Certificate</button>
      </div>
      <div class="card">
        <div class="card-header"><span>📄</span><h2>All Certificates</h2></div>
        <div class="table-wrap"><table><thead><tr><th>Roll</th><th>Name</th><th>Description</th><th>Link</th></tr></thead><tbody id="certs-tbody"></tbody></table></div>
      </div>
    </div>

  </div><!-- /main-content -->
</div><!-- /admin-portal -->

<!-- ══════════════════════════════════════════
     STUDENT PORTAL
══════════════════════════════════════════ -->
<div id="page-student-portal" class="page">
  <div class="sp-topbar">
    <div class="sp-topbar-left">
      <span class="icon">🎓</span>
      <h2>Student Performance Portal</h2>
    </div>
    <div class="sp-topbar-right">
      <span id="sp-username">Student</span>
      <button class="btn sm outline" style="color:white;border-color:rgba(255,255,255,.4)" onclick="studentLogout()">Logout</button>
    </div>
  </div>
  <nav class="sp-nav">
    <button class="sp-nav-btn active" onclick="spNav('overview',this)">📊 Overview</button>
    <button class="sp-nav-btn" onclick="spNav('marks',this)">📝 My Marks</button>
    <button class="sp-nav-btn" onclick="spNav('assignments',this)">📋 Assignments</button>
    <button class="sp-nav-btn" onclick="spNav('mentor',this)">🤝 Mentor</button>
    <button class="sp-nav-btn" onclick="spNav('notifications',this)">🔔 Notifications</button>
  </nav>
  <div class="sp-content">
    <div id="sp-overview" class="sp-section active"></div>
    <div id="sp-marks" class="sp-section"></div>
    <div id="sp-assignments" class="sp-section"></div>
    <div id="sp-mentor" class="sp-section"></div>
    <div id="sp-notifications" class="sp-section"></div>
  </div>
</div>

<!-- ══════════════════════════════════════════
     ADD/EDIT STUDENT MODAL
══════════════════════════════════════════ -->
<div class="modal-overlay" id="studentModal">
  <div class="modal">
    <div class="modal-header">
      <h2 id="modal-title">Add Student</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="form-id">
      <div id="form-alert"></div>
      <div class="row-2">
        <div class="form-group">
          <label>Roll Number</label>
          <input class="input" id="f-roll" placeholder="e.g. CS005">
          <div class="field-error" id="err-roll"></div>
        </div>
        <div class="form-group">
          <label>Full Name</label>
          <input class="input" id="f-name" placeholder="Student name">
          <div class="field-error" id="err-name"></div>
        </div>
      </div>
      <div class="form-group">
        <label>Email Address</label>
        <input class="input" id="f-email" placeholder="student@college.edu">
        <div class="field-error" id="err-email"></div>
      </div>
      <hr style="border:none;border-top:1px solid var(--gray-200);margin:16px 0">
      <h3 style="font-size:.85rem;font-weight:700;color:var(--navy);margin-bottom:12px">📊 Subject Marks (CAE1 & CAE2, max 20 each)</h3>
      <div id="marks-container"></div>
      <div class="overall-preview">
        <span>Overall Category:</span>
        <div id="overall-pill" class="overall-pill" style="background:var(--gray-200);color:var(--gray-500)">— Enter marks</div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn outline" onclick="closeModal()">Cancel</button>
      <button class="btn primary" id="save-btn" onclick="saveStudent()">💾 Save Student</button>
    </div>
  </div>
<script src="js/script.js"></script>
</body>
</html>
