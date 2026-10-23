// ══════════════════════════════════════════════════════════════
// DATA STORE — MySQL backed (synchronized key-value)
// ══════════════════════════════════════════════════════════════
const DB = {
  data: {},
  get: function(k) { 
    return this.data['sp_'+k] !== undefined ? this.data['sp_'+k] : null; 
  },
  set: function(k,v) { 
    this.data['sp_'+k] = v;
    fetch('php/api.php?action=set&key=sp_'+k, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v)
    }).catch(console.error);
  },
  init(callback) {
    fetch('php/api.php?action=get_all')
      .then(res => res.json())
      .then(serverData => {
         this.data = serverData;
         
         if (Object.keys(serverData).length === 0) {
             let migrated = false;
             for (let i = 0; i < localStorage.length; i++) {
                 const key = localStorage.key(i);
                 if (key && key.startsWith('sp_')) {
                     try {
                         const val = JSON.parse(localStorage.getItem(key));
                         this.data[key] = val;
                         fetch('php/api.php?action=set&key='+key, {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify(val)
                         });
                         migrated = true;
                     } catch(e) {}
                 }
             }
             if (!migrated && this.data['sp_initialized'] === undefined) {
                  this.set('admins', [{id:1,name:'Admin',email:'admin@college.edu',password:'admin123'}]);
                  this.set('subjects', [
                    {id:1,name:'Mathematics'},{id:2,name:'Physics'},
                    {id:3,name:'Chemistry'},{id:4,name:'Computer Science'},{id:5,name:'English'}
                  ]);
                  this.set('students', [
                    {id:1,roll_number:'CS001',name:'Arun Kumar',email:'arun@college.edu',password:'student123',overall_category:'slow'},
                    {id:2,roll_number:'CS002',name:'Priya Sharma',email:'priya@college.edu',password:'student123',overall_category:'intermediate'},
                    {id:3,roll_number:'CS003',name:'Rahul Verma',email:'rahul@college.edu',password:'student123',overall_category:'advanced'}
                  ]);
                  this.set('student_marks', [
                    {id:1,student_id:1,subject_id:1,cae1:5,cae2:6,category:'slow'},
                    {id:2,student_id:1,subject_id:2,cae1:7,cae2:7,category:'slow'},
                    {id:3,student_id:1,subject_id:3,cae1:9,cae2:10,category:'intermediate'},
                    {id:4,student_id:2,subject_id:1,cae1:12,cae2:13,category:'intermediate'},
                    {id:5,student_id:2,subject_id:2,cae1:10,cae2:11,category:'intermediate'},
                    {id:6,student_id:2,subject_id:3,cae1:14,cae2:12,category:'intermediate'},
                    {id:7,student_id:3,subject_id:1,cae1:18,cae2:17,category:'advanced'},
                    {id:8,student_id:3,subject_id:2,cae1:19,cae2:20,category:'advanced'},
                    {id:9,student_id:3,subject_id:3,cae1:16,cae2:18,category:'advanced'}
                  ]);
                  this.set('notifications', [
                    {id:1,student_id:1,type:'remedial',message:'You have been enrolled in remedial classes. Extra sessions every Monday & Wednesday at 4:00 PM, Room 204.',is_read:0,created_at:new Date().toISOString()}
                  ]);
                  this.set('assignments', [
                    {id:1,student_id:2,subject_id:1,assignment_link:'https://classroom.google.com/assignment/maths-cs002',deadline:futureDate(7),status:'pending'},
                    {id:2,student_id:2,subject_id:2,assignment_link:'https://classroom.google.com/assignment/physics-cs002',deadline:futureDate(7),status:'pending'}
                  ]);
                  this.set('mentor_mapping', [{id:1,mentor_id:3,mentee_id:1}]);
                  this.set('certificates', []);
                  this.set('session', null);
                  this.set('next_ids', {student:4,mark:10,notif:2,assign:3,mentor:2,cert:1,subj:6});
                  this.set('initialized', true);
             }
         }
         if (callback) callback();
      })
      .catch(err => {
         console.error("Failed to connect to MySQL backend, falling back to localStorage", err);
         this.data = {};
         for (let i = 0; i < localStorage.length; i++) {
             const key = localStorage.key(i);
             if (key && key.startsWith('sp_')) {
                 try { this.data[key] = JSON.parse(localStorage.getItem(key)); } catch(e) {}
             }
         }
         if (callback) callback();
      });
  }
};

function futureDate(days){ const d=new Date(); d.setDate(d.getDate()+days); return d.toISOString().split('T')[0]; }
function nextId(type){ const ids=DB.get('next_ids')||{}; const id=(ids[type]||1); ids[type]=id+1; DB.set('next_ids',ids); return id; }

// ══════════════════════════════════════════════════════════════
// CATEGORY LOGIC
// ══════════════════════════════════════════════════════════════
function determineCategory(c1,c2){
  if(c1<8||c2<8) return 'slow';
  if(c1<=15&&c2<=15) return 'intermediate';
  return 'advanced';
}
function determineOverall(cats){
  if(cats.includes('slow')) return 'slow';
  if(cats.includes('intermediate')) return 'intermediate';
  return 'advanced';
}
function catLabel(c){ return {slow:'Slow Learner',intermediate:'Intermediate Learner',advanced:'Advanced Learner'}[c]||'—'; }
function catEmoji(c){ return {slow:'🔴',intermediate:'🟡',advanced:'🟢'}[c]||'❓'; }
function catClass(c){ return c==='intermediate'?'inter':c; }
function fmtDate(d){ if(!d) return '—'; return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }

// ══════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════
function toast(msg,type='info'){
  const t=document.createElement('div');
  t.className='toast '+type;
  t.innerHTML=`<span>${{info:'🔔',success:'✅',error:'❌'}[type]}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(()=>t.remove(),3500);
}

// ══════════════════════════════════════════════════════════════
// ROUTING
// ══════════════════════════════════════════════════════════════
function goTo(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
}

// ══════════════════════════════════════════════════════════════
// ADMIN AUTH
// ══════════════════════════════════════════════════════════════
function adminLogin(){
  const email=document.getElementById('al-email').value.trim();
  const pass=document.getElementById('al-pass').value.trim();
  const alertEl=document.getElementById('a-login-alert');
  if(!email||!pass){alertEl.innerHTML='<div class="alert error">❌ Please fill all fields.</div>';return;}
  const admins=DB.get('admins')||[];
  const admin=admins.find(a=>a.email===email&&a.password===pass);
  if(admin){
    DB.set('session',{type:'admin',id:admin.id,name:admin.name});
    document.getElementById('admin-display-name').textContent=admin.name;
    alertEl.innerHTML='';
    goTo('admin-portal');
    adminNav('dashboard',document.querySelector('[data-page="dashboard"]'));
  } else {
    alertEl.innerHTML='<div class="alert error">❌ Invalid email or password.</div>';
  }
}
function adminLogout(){ DB.set('session',null); goTo('landing'); }

// ══════════════════════════════════════════════════════════════
// STUDENT AUTH
// ══════════════════════════════════════════════════════════════
function switchStudentTab(tab){
  document.getElementById('s-login-form').style.display=tab==='login'?'block':'none';
  document.getElementById('s-register-form').style.display=tab==='register'?'block':'none';
  document.getElementById('s-tab-login').classList.toggle('active',tab==='login');
  document.getElementById('s-tab-register').classList.toggle('active',tab==='register');
}
function studentLogin(){
  const email=document.getElementById('sl-email').value.trim();
  const pass=document.getElementById('sl-pass').value.trim();
  const alertEl=document.getElementById('s-login-alert');
  if(!email||!pass){alertEl.innerHTML='<div class="alert error">❌ Please fill all fields.</div>';return;}
  const students=DB.get('students')||[];
  const student=students.find(s=>s.email===email&&s.password===pass);
  if(student){
    DB.set('session',{type:'student',id:student.id,name:student.name,roll:student.roll_number});
    alertEl.innerHTML='';
    document.getElementById('sp-username').textContent=`👤 ${student.name} (${student.roll_number})`;
    goTo('student-portal');
    loadStudentPortal(student.id);
  } else {
    alertEl.innerHTML='<div class="alert error">❌ Invalid email or password. Make sure you have registered first.</div>';
  }
}
function studentRegister(){
  const roll=document.getElementById('sr-roll').value.trim();
  const name=document.getElementById('sr-name').value.trim();
  const email=document.getElementById('sr-email').value.trim();
  const pass=document.getElementById('sr-pass').value.trim();
  const alertEl=document.getElementById('s-reg-alert');
  if(!roll||!name||!email||!pass){alertEl.innerHTML='<div class="alert error">❌ All fields required.</div>';return;}
  if(pass.length<6){alertEl.innerHTML='<div class="alert error">❌ Password must be at least 6 characters.</div>';return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){alertEl.innerHTML='<div class="alert error">❌ Invalid email.</div>';return;}
  const students=DB.get('students')||[];
  const existing=students.find(s=>s.roll_number===roll||s.email===email);
  if(existing){
    if(existing.password){alertEl.innerHTML='<div class="alert error">❌ Roll number or email already exists.</div>';return;}
    existing.name=name; existing.email=email; existing.password=pass;
    DB.set('students',students);
    DB.set('session',{type:'student',id:existing.id,name,roll:existing.roll_number});
    document.getElementById('sp-username').textContent=`👤 ${name} (${existing.roll_number})`;
    alertEl.innerHTML='';
    goTo('student-portal');
    loadStudentPortal(existing.id);
  } else {
    const newS={id:nextId('student'),roll_number:roll,name,email,password:pass,overall_category:null};
    students.push(newS);
    DB.set('students',students);
    DB.set('session',{type:'student',id:newS.id,name,roll});
    document.getElementById('sp-username').textContent=`👤 ${name} (${roll})`;
    alertEl.innerHTML='';
    goTo('student-portal');
    loadStudentPortal(newS.id);
  }
}
function studentLogout(){ DB.set('session',null); goTo('landing'); }

// ══════════════════════════════════════════════════════════════
// STUDENT PORTAL
// ══════════════════════════════════════════════════════════════
function spNav(section,btn){
  document.querySelectorAll('.sp-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.sp-nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('sp-'+section).classList.add('active');
  btn.classList.add('active');
}

function loadStudentPortal(sid){
  const students=DB.get('students')||[];
  const student=students.find(s=>s.id===sid);
  if(!student){toast('Student not found.','error');return;}
  const marks=getStudentMarks(sid);
  const notifications=(DB.get('notifications')||[]).filter(n=>n.student_id===sid);
  const assignments=getStudentAssignments(sid);
  const mentorMap=(DB.get('mentor_mapping')||[]).find(m=>m.mentee_id===sid);
  const subjs=DB.get('subjects')||[];
  const allStudents=DB.get('students')||[];
  const mentor=mentorMap?allStudents.find(s=>s.id===mentorMap.mentor_id):null;
  const mentees=(DB.get('mentor_mapping')||[]).filter(m=>m.mentor_id===sid).map(m=>allStudents.find(s=>s.id===m.mentee_id)).filter(Boolean);

  const cat=student.overall_category;
  const cc=catClass(cat);
  const catMsgs={slow:'You have been enrolled in Remedial Classes — Monday & Wednesday, 4:00 PM, Room 204.',intermediate:'Keep it up! You have pending assignments. Complete them within the deadline.',advanced:'Excellent work! You are an Advanced Learner and a mentor to your peers.'};
  const unreadNotifs=notifications.filter(n=>!n.is_read).length;
  document.getElementById('sp-overview').innerHTML=`
    <div style="margin-bottom:20px">
      <h2 style="font-size:1.4rem;font-weight:800;color:var(--navy)">Welcome, ${student.name}! 👋</h2>
      <p style="font-size:.85rem;color:var(--gray-500);margin-top:4px">Roll: ${student.roll_number} • ${student.email}</p>
    </div>
    ${cat?`<div class="cat-banner ${cc}">
      <div class="banner-icon">${catEmoji(cat)}</div>
      <div>
        <h3 style="color:${cc==='slow'?'var(--slow)':cc==='inter'?'var(--inter)':'var(--adv)'}">${catLabel(cat)}</h3>
        <p>${catMsgs[cat]||''}</p>
      </div>
    </div>`:'<div class="alert info">📊 No marks entered yet. Contact your admin.</div>'}
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card"><div class="stat-icon">📝</div><div class="stat-info"><h3>${marks.length}</h3><p>Subjects</p></div></div>
      <div class="stat-card"><div class="stat-icon">🔔</div><div class="stat-info"><h3>${unreadNotifs}</h3><p>New Notifications</p></div></div>
      <div class="stat-card"><div class="stat-icon">📋</div><div class="stat-info"><h3>${assignments.length}</h3><p>Assignments</p></div></div>
    </div>
    <div class="card">
      <div class="card-header"><span>📊</span><h2>Marks at a Glance</h2></div>
      <div class="card-body">
        ${marks.length?marks.map(m=>{const c=m.category;const ccc=catClass(c);return`<div class="marks-subj-card"><span class="subj-name">📖 ${m.subject_name}</span><div class="marks-val"><div class="mv-label">CAE 1</div><div class="mv-num">${m.cae1}</div><div class="mv-max">/20</div></div><div class="marks-val"><div class="mv-label">CAE 2</div><div class="mv-num">${m.cae2}</div><div class="mv-max">/20</div></div><span class="badge ${ccc}">${catEmoji(c)} ${catLabel(c)}</span></div>`;}).join(''):'<div class="empty-state"><div class="icon">📝</div><p>No marks entered yet.</p></div>'}
      </div>
    </div>
  `;

  document.getElementById('sp-marks').innerHTML=`
    <h3 style="font-size:1rem;font-weight:700;color:var(--navy);margin-bottom:16px">📝 Detailed Marks</h3>
    ${marks.length?marks.map(m=>{const c=m.category;const ccc=catClass(c);return`<div class="card" style="margin-bottom:16px"><div class="card-header"><span>📖</span><h2>${m.subject_name}</h2><span class="badge ${ccc}" style="margin-left:auto">${catEmoji(c)} ${catLabel(c)}</span></div><div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div style="text-align:center;padding:20px;background:var(--gray-50);border-radius:10px"><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;color:var(--gray-400);margin-bottom:8px">CAE 1</div><div style="font-size:2.2rem;font-weight:800;color:var(--navy)">${m.cae1}</div><div style="font-size:.75rem;color:var(--gray-400)">out of 20</div></div><div style="text-align:center;padding:20px;background:var(--gray-50);border-radius:10px"><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;color:var(--gray-400);margin-bottom:8px">CAE 2</div><div style="font-size:2.2rem;font-weight:800;color:var(--navy)">${m.cae2}</div><div style="font-size:.75rem;color:var(--gray-400)">out of 20</div></div></div></div>`;}).join(''):'<div class="empty-state"><div class="icon">📝</div><p>No marks entered yet.</p></div>'}
  `;

  const today=new Date();
  document.getElementById('sp-assignments').innerHTML=`
    <h3 style="font-size:1rem;font-weight:700;color:var(--navy);margin-bottom:16px">📋 My Assignments</h3>
    ${assignments.length?assignments.map(a=>{const due=new Date(a.deadline);const overdue=due<today;const subj=subjs.find(s=>s.id===a.subject_id);return`<div class="assign-card"><div><h4>📖 ${subj?subj.name:'Subject'}</h4><p>Deadline: ${fmtDate(a.deadline)}</p></div><div style="display:flex;align-items:center;gap:10px"><span class="deadline-chip ${overdue?'overdue':''}">${overdue?'⚠️ Overdue':'📅 Due: '+fmtDate(a.deadline)}</span><a href="${a.assignment_link}" target="_blank" class="btn primary sm">Open →</a></div></div>`;}).join(''):'<div class="empty-state"><div class="icon">📋</div><p>No assignments yet.</p></div>'}
  `;

  let mentorHTML=`<h3 style="font-size:1rem;font-weight:700;color:var(--navy);margin-bottom:16px">🤝 My Mentor</h3>`;
  if(mentor){
    mentorHTML+=`<div class="mentor-info-card"><div class="mentor-avatar-big">🎓</div><div><h3>${mentor.name}</h3><p>Roll: ${mentor.roll_number}</p><p>📧 ${mentor.email}</p></div></div>`;
  } else if(cat==='slow'){
    mentorHTML+=`<div class="alert info">Mentor will be assigned soon. Please attend remedial classes in the meantime.</div>`;
  } else {
    mentorHTML+=`<div class="empty-state"><div class="icon">🤝</div><p>No mentor assigned — you are ${catLabel(cat)||'not categorized yet'}.</p></div>`;
  }
  if(mentees.length){
    mentorHTML+=`<h3 style="font-size:1rem;font-weight:700;color:var(--navy);margin:20px 0 12px">👨‍🏫 Students You Are Mentoring</h3>`;
    mentorHTML+=mentees.map(m=>`<div class="mentor-info-card" style="margin-bottom:10px;border:1.5px solid var(--slow-border)"><div class="mentor-avatar-big" style="background:var(--slow-bg);border-color:var(--slow-border)">📚</div><div><h3>${m.name}</h3><p style="color:var(--slow)">Roll: ${m.roll_number}</p><p>📧 ${m.email}</p></div></div>`).join('');
  }
  document.getElementById('sp-mentor').innerHTML=mentorHTML;

  document.getElementById('sp-notifications').innerHTML=`
    <h3 style="font-size:1rem;font-weight:700;color:var(--navy);margin-bottom:16px">🔔 Notifications</h3>
    ${notifications.length?notifications.map(n=>`<div class="notif-item ${n.type}"><h4>${n.type==='remedial'?'⚠️ Remedial Class Alert':n.type==='mentor'?'🎓 Achievement Notice':'📋 Assignment Notice'}</h4><p>${n.message}</p><div style="font-size:.72rem;color:var(--gray-400);margin-top:6px">${fmtDate(n.created_at)}</div></div>`).join(''):'<div class="empty-state"><div class="icon">🔔</div><p>No notifications.</p></div>'}
  `;
}

function getStudentMarks(sid){
  const marks=DB.get('student_marks')||[];
  const subjs=DB.get('subjects')||[];
  return marks.filter(m=>m.student_id===sid).map(m=>{
    const s=subjs.find(s=>s.id===m.subject_id);
    return {...m,subject_name:s?s.name:'Unknown'};
  });
}
function getStudentAssignments(sid){
  return (DB.get('assignments')||[]).filter(a=>a.student_id===sid);
}

// ══════════════════════════════════════════════════════════════
// ADMIN NAV
// ══════════════════════════════════════════════════════════════
const pageTitles={dashboard:'Dashboard',students:'Students',subjects:'Manage Subjects',categories:'Category View',mentors:'Mentor Mapping',certificates:'Certificates'};
function adminNav(page,el){
  document.querySelectorAll('.admin-page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  document.getElementById('admin-page-'+page).classList.add('active');
  if(el) el.classList.add('active');
  document.getElementById('topbar-title').textContent=pageTitles[page]||page;
  const loaders={dashboard:loadDashboard,students:()=>loadStudents(''),subjects:loadSubjects,categories:loadCategories,mentors:loadMentors,certificates:loadCertificates};
  loaders[page]?.();
}

// ══════════════════════════════════════════════════════════════
// ADMIN — DASHBOARD
// ══════════════════════════════════════════════════════════════
function loadDashboard(){
  const students=DB.get('students')||[];
  const subjects=DB.get('subjects')||[];
  document.getElementById('s-total').textContent=students.length;
  document.getElementById('s-subj').textContent=subjects.length;
  document.getElementById('s-slow').textContent=students.filter(s=>s.overall_category==='slow').length;
  document.getElementById('s-inter').textContent=students.filter(s=>s.overall_category==='intermediate').length;
  document.getElementById('s-adv').textContent=students.filter(s=>s.overall_category==='advanced').length;
  const mentorMap=DB.get('mentor_mapping')||[];
  const recent=students.slice(-6).reverse();
  document.getElementById('recent-students-tbody').innerHTML=recent.length
    ?recent.map(s=>{const cc=catClass(s.overall_category);const mm=mentorMap.find(m=>m.mentee_id===s.id);const mentor=mm?(DB.get('students')||[]).find(st=>st.id===mm.mentor_id):null;return`<tr><td><strong>${s.roll_number}</strong></td><td>${s.name}</td><td>${s.overall_category?`<span class="badge ${cc}">${catEmoji(s.overall_category)} ${catLabel(s.overall_category)}</span>`:'—'}</td><td>${mentor?`<span style="font-size:.78rem;color:var(--adv)">🎓 ${mentor.name}</span>`:'—'}</td></tr>`;}).join('')
    :'<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--gray-400)">No students yet.</td></tr>';
}

// ══════════════════════════════════════════════════════════════
// ADMIN — SUBJECTS
// ══════════════════════════════════════════════════════════════
function loadSubjects(){
  const subjects=DB.get('subjects')||[];
  document.getElementById('subjects-tbody').innerHTML=subjects.length
    ?subjects.map((s,i)=>`<tr><td>${i+1}</td><td><strong>${s.name}</strong></td><td><button class="btn danger sm" onclick="deleteSubject(${s.id},'${s.name}')">🗑 Delete</button></td></tr>`).join('')
    :'<tr><td colspan="3" style="text-align:center;padding:24px;color:var(--gray-400)">No subjects yet.</td></tr>';
}
function addSubject(){
  const input=document.getElementById('subj-input');
  const name=input.value.trim();
  const alertEl=document.getElementById('subj-alert');
  if(!name){alertEl.innerHTML='<div class="alert error">Name required.</div>';return;}
  const subjects=DB.get('subjects')||[];
  if(subjects.find(s=>s.name.toLowerCase()===name.toLowerCase())){alertEl.innerHTML='<div class="alert error">Subject already exists.</div>';return;}
  subjects.push({id:nextId('subj'),name});
  DB.set('subjects',subjects);
  input.value='';
  alertEl.innerHTML=`<div class="alert success">✅ "${name}" added!</div>`;
  setTimeout(()=>alertEl.innerHTML='',2500);
  loadSubjects();
  toast(`"${name}" added!`,'success');
}
function deleteSubject(id,name){
  if(!confirm(`Delete "${name}"?`)) return;
  DB.set('subjects',(DB.get('subjects')||[]).filter(s=>s.id!==id));
  DB.set('student_marks',(DB.get('student_marks')||[]).filter(m=>m.subject_id!==id));
  toast(`"${name}" deleted.`,'info');
  loadSubjects();
}

// ══════════════════════════════════════════════════════════════
// ADMIN — STUDENTS
// ══════════════════════════════════════════════════════════════
let currentFilter='';
function loadStudents(filter){
  currentFilter=filter;
  const students=DB.get('students')||[];
  const mentorMap=DB.get('mentor_mapping')||[];
  const filtered=filter?students.filter(s=>s.overall_category===filter):students;
  document.getElementById('students-tbody').innerHTML=filtered.length
    ?filtered.map(s=>{const cc=catClass(s.overall_category);const mm=mentorMap.find(m=>m.mentee_id===s.id);const mentor=mm?students.find(st=>st.id===mm.mentor_id):null;return`<tr><td><strong>${s.roll_number}</strong></td><td>${s.name}</td><td style="font-size:.78rem;color:var(--gray-500)">${s.email}</td><td>${s.overall_category?`<span class="badge ${cc}">${catEmoji(s.overall_category)} ${catLabel(s.overall_category)}</span>`:'—'}</td><td>${mentor?`<span style="font-size:.75rem;color:var(--adv)">🎓 ${mentor.name}</span>`:'—'}</td><td style="white-space:nowrap"><button class="btn outline sm" onclick="openAddModal(${s.id})">✏️ Edit</button> <button class="btn danger sm" onclick="deleteStudent(${s.id},'${s.name}')">🗑</button></td></tr>`;}).join('')
    :'<tr><td colspan="6"><div class="empty-state"><div class="icon">🎓</div><p>No students found.</p></div></td></tr>';
}
function filterStudents(cat,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  loadStudents(cat);
}
function deleteStudent(id,name){
  if(!confirm(`Delete "${name}"?`)) return;
  DB.set('students',(DB.get('students')||[]).filter(s=>s.id!==id));
  DB.set('student_marks',(DB.get('student_marks')||[]).filter(m=>m.student_id!==id));
  DB.set('notifications',(DB.get('notifications')||[]).filter(n=>n.student_id!==id));
  DB.set('assignments',(DB.get('assignments')||[]).filter(a=>a.student_id!==id));
  DB.set('mentor_mapping',(DB.get('mentor_mapping')||[]).filter(m=>m.mentor_id!==id&&m.mentee_id!==id));
  toast(`${name} deleted.`,'info');
  loadStudents(currentFilter);
  loadDashboard();
}

// ══════════════════════════════════════════════════════════════
// ADD / EDIT MODAL
// ══════════════════════════════════════════════════════════════
let editingId=null;
function openAddModal(id=null){
  editingId=id;
  document.getElementById('modal-title').textContent=id?'Edit Student':'Add New Student';
  document.getElementById('form-id').value=id||'';
  document.getElementById('form-alert').innerHTML='';
  document.getElementById('f-roll').value='';
  document.getElementById('f-name').value='';
  document.getElementById('f-email').value='';
  document.getElementById('err-roll').textContent='';
  document.getElementById('err-name').textContent='';
  document.getElementById('err-email').textContent='';
  document.getElementById('studentModal').classList.add('open');
  buildMarksForm();
  if(id) prefillForm(id);
}
function closeModal(){
  document.getElementById('studentModal').classList.remove('open');
}
function buildMarksForm(){
  const subjects=DB.get('subjects')||[];
  const container=document.getElementById('marks-container');
  if(!subjects.length){
    container.innerHTML=`<div class="alert error">⚠️ No subjects found. <a href="#" onclick="closeModal();adminNav('subjects',document.querySelector('[data-page=subjects]'))" style="color:var(--slow);font-weight:700">Add subjects first.</a></div>`;
    return;
  }
  container.innerHTML=subjects.map(s=>`
    <div class="marks-row" id="mrow-${s.id}">
      <span style="font-size:.85rem;font-weight:600;color:var(--navy)">📖 ${s.name}</span>
      <div>
        <div style="font-size:.68rem;color:var(--gray-400);margin-bottom:3px;text-align:center">CAE 1</div>
        <input class="input" type="number" id="cae1-${s.id}" placeholder="0" min="0" max="20" step="0.5" oninput="updatePill(${s.id})" style="width:70px;text-align:center;padding:8px">
      </div>
      <div>
        <div style="font-size:.68rem;color:var(--gray-400);margin-bottom:3px;text-align:center">CAE 2</div>
        <input class="input" type="number" id="cae2-${s.id}" placeholder="0" min="0" max="20" step="0.5" oninput="updatePill(${s.id})" style="width:70px;text-align:center;padding:8px">
      </div>
      <div class="cat-pill" id="pill-${s.id}">—</div>
    </div>
  `).join('');
  document.getElementById('overall-pill').textContent='— Enter marks';
  document.getElementById('overall-pill').style.cssText='background:var(--gray-200);color:var(--gray-500)';
}
function updatePill(sid){
  const c1=parseFloat(document.getElementById(`cae1-${sid}`)?.value);
  const c2=parseFloat(document.getElementById(`cae2-${sid}`)?.value);
  const pill=document.getElementById(`pill-${sid}`);
  if(!pill) return;
  if(isNaN(c1)||isNaN(c2)){pill.className='cat-pill';pill.textContent='—';}
  else { const cat=determineCategory(c1,c2); const cc=catClass(cat); pill.className=`cat-pill ${cc}`; pill.textContent=`${catEmoji(cat)} ${cc==='inter'?'Avg':cat==='slow'?'Slow':'Good'}`; }
  updateOverallPill();
}
function updateOverallPill(){
  const subjects=DB.get('subjects')||[];
  const cats=[];
  subjects.forEach(s=>{
    const c1=parseFloat(document.getElementById(`cae1-${s.id}`)?.value);
    const c2=parseFloat(document.getElementById(`cae2-${s.id}`)?.value);
    if(!isNaN(c1)&&!isNaN(c2)) cats.push(determineCategory(c1,c2));
  });
  const pill=document.getElementById('overall-pill');
  if(!cats.length){pill.textContent='— Enter marks';pill.style.cssText='background:var(--gray-200);color:var(--gray-500)';return;}
  const overall=determineOverall(cats);
  const cc=catClass(overall);
  const map={slow:'background:var(--slow-bg);color:var(--slow)',inter:'background:var(--inter-bg);color:var(--inter)',adv:'background:var(--adv-bg);color:var(--adv)'};
  pill.style.cssText=map[cc];
  pill.textContent=`${catEmoji(overall)} ${catLabel(overall)}`;
}
function prefillForm(id){
  const students=DB.get('students')||[];
  const student=students.find(s=>s.id===id);
  if(!student) return;
  document.getElementById('f-roll').value=student.roll_number;
  document.getElementById('f-name').value=student.name;
  document.getElementById('f-email').value=student.email;
  const marks=DB.get('student_marks')||[];
  marks.filter(m=>m.student_id===id).forEach(m=>{
    const c1=document.getElementById(`cae1-${m.subject_id}`);
    const c2=document.getElementById(`cae2-${m.subject_id}`);
    if(c1) c1.value=m.cae1;
    if(c2) c2.value=m.cae2;
    updatePill(m.subject_id);
  });
}
function saveStudent(){
  const roll=document.getElementById('f-roll').value.trim();
  const name=document.getElementById('f-name').value.trim();
  const email=document.getElementById('f-email').value.trim();
  let valid=true;
  function setErr(fId,eId,msg){document.getElementById(fId).classList.toggle('error',!!msg);document.getElementById(eId).textContent=msg||'';if(msg)valid=false;}
  setErr('f-roll','err-roll',!roll?'Required.':/^[A-Za-z0-9]+$/.test(roll)?'':'Alphanumeric only.');
  setErr('f-name','err-name',!name?'Required.':'');
  setErr('f-email','err-email',!email?'Required.':/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?'':'Invalid email.');
  if(!valid) return;
  const subjects=DB.get('subjects')||[];
  const marksInput={};
  subjects.forEach(s=>{
    const c1=parseFloat(document.getElementById(`cae1-${s.id}`)?.value);
    const c2=parseFloat(document.getElementById(`cae2-${s.id}`)?.value);
    if(!isNaN(c1)&&!isNaN(c2)){
      if(c1<0||c1>20||c2<0||c2>20){document.getElementById('form-alert').innerHTML='<div class="alert error">❌ Marks must be 0–20.</div>';valid=false;return;}
      marksInput[s.id]={cae1:c1,cae2:c2};
    }
  });
  if(!valid) return;
  if(!Object.keys(marksInput).length){document.getElementById('form-alert').innerHTML='<div class="alert error">❌ Enter marks for at least one subject.</div>';return;}
  const subjectCats={};
  Object.entries(marksInput).forEach(([sid,m])=>subjectCats[sid]=determineCategory(m.cae1,m.cae2));
  const overall=determineOverall(Object.values(subjectCats));
  const students=DB.get('students')||[];
  const id=editingId;
  let studentId;
  if(id){
    const idx=students.findIndex(s=>s.id===id);
    if(students.some(s=>s.id!==id&&(s.roll_number===roll||s.email===email))){document.getElementById('form-alert').innerHTML='<div class="alert error">❌ Duplicate roll number or email.</div>';return;}
    students[idx]={...students[idx],roll_number:roll,name,email,overall_category:overall};
    studentId=id;
  } else {
    if(students.some(s=>s.roll_number===roll||s.email===email)){document.getElementById('form-alert').innerHTML='<div class="alert error">❌ Duplicate roll number or email.</div>';return;}
    studentId=nextId('student');
    students.push({id:studentId,roll_number:roll,name,email,password:null,overall_category:overall});
  }
  DB.set('students',students);
  let marks=DB.get('student_marks')||[];
  marks=marks.filter(m=>m.student_id!==studentId);
  Object.entries(marksInput).forEach(([sid,m])=>{
    marks.push({id:nextId('mark'),student_id:studentId,subject_id:parseInt(sid),cae1:m.cae1,cae2:m.cae2,category:subjectCats[sid]});
  });
  DB.set('student_marks',marks);
  DB.set('notifications',(DB.get('notifications')||[]).filter(n=>n.student_id!==studentId));
  DB.set('assignments',(DB.get('assignments')||[]).filter(a=>a.student_id!==studentId));
  DB.set('mentor_mapping',(DB.get('mentor_mapping')||[]).filter(m=>m.mentee_id!==studentId));
  const notifs=DB.get('notifications')||[];
  const assigns=DB.get('assignments')||[];
  if(overall==='slow'){
    notifs.push({id:nextId('notif'),student_id:studentId,type:'remedial',message:'You have been enrolled in remedial classes. Extra sessions every Monday & Wednesday at 4:00 PM, Room 204.',is_read:0,created_at:new Date().toISOString()});
    const allSt=DB.get('students')||[];
    const mentorMappingAll=DB.get('mentor_mapping')||[];
    const mentorCounts={};
    mentorMappingAll.forEach(m=>{mentorCounts[m.mentor_id]=(mentorCounts[m.mentor_id]||0)+1;});
    const advStudents=allSt.filter(s=>s.overall_category==='advanced'&&s.id!==studentId);
    const mentor=advStudents.sort((a,b)=>(mentorCounts[a.id]||0)-(mentorCounts[b.id]||0)).find(m=>(mentorCounts[m.id]||0)<3);
    if(mentor){mentorMappingAll.push({id:nextId('mentor'),mentor_id:mentor.id,mentee_id:studentId});DB.set('mentor_mapping',mentorMappingAll);}
  } else if(overall==='intermediate'){
    Object.entries(subjectCats).forEach(([sid,cat])=>{
      if(cat==='slow'||cat==='intermediate'){
        assigns.push({id:nextId('assign'),student_id:studentId,subject_id:parseInt(sid),assignment_link:`https://classroom.google.com/assignment/subject-${sid}-student-${studentId}`,deadline:futureDate(7),status:'pending'});
      }
    });
  } else if(overall==='advanced'){
    notifs.push({id:nextId('notif'),student_id:studentId,type:'mentor',message:'Congratulations! You are an Advanced Learner. Please upload your achievement certificates.',is_read:0,created_at:new Date().toISOString()});
  }
  DB.set('notifications',notifs);
  DB.set('assignments',assigns);
  closeModal();
  toast(`Student saved as ${catLabel(overall)}!`,'success');
  loadStudents(currentFilter);
  loadDashboard();
}

// ══════════════════════════════════════════════════════════════
// ADMIN — CATEGORY VIEW
// ══════════════════════════════════════════════════════════════
function loadCategories(){
  const students=DB.get('students')||[];
  const marks=DB.get('student_marks')||[];
  const subjects=DB.get('subjects')||[];
  const mentorMap=DB.get('mentor_mapping')||[];
  const groups={slow:[],intermediate:[],advanced:[]};
  students.forEach(s=>{
    if(s.overall_category) groups[s.overall_category].push(s);
  });
  const container=document.getElementById('cat-view-container');
  container.innerHTML=['slow','intermediate','advanced'].map(cat=>{
    const cc=catClass(cat);
    const list=groups[cat]||[];
    const rows=list.map(s=>{
      const sm=marks.filter(m=>m.student_id===s.id).map(m=>{const subj=subjects.find(sub=>sub.id===m.subject_id);return`<tr style="background:rgba(0,0,0,.015)"><td style="padding-left:32px;font-size:.78rem;color:var(--gray-600)">📖 ${subj?subj.name:'?'}</td><td style="font-size:.8rem">${m.cae1}/20</td><td style="font-size:.8rem">${m.cae2}/20</td><td><span class="badge ${catClass(m.category)}" style="font-size:.65rem">${catEmoji(m.category)} ${catLabel(m.category)}</span></td><td></td></tr>`;}).join('');
      const mm=mentorMap.find(m=>m.mentee_id===s.id);
      const mentor=mm?students.find(st=>st.id===mm.mentor_id):null;
      return`<tr><td><strong>${s.roll_number}</strong></td><td><strong>${s.name}</strong></td><td colspan="2" style="font-size:.78rem;color:var(--gray-400)">${marks.filter(m=>m.student_id===s.id).length} subjects</td><td>${mentor?`<span style="font-size:.75rem;color:var(--adv)">🎓 ${mentor.name}</span>`:'—'}</td></tr>${sm}`;
    }).join('');
    return`<div class="cat-section"><div class="cat-section-header ${cc}">${catEmoji(cat)} ${catLabel(cat)} <span style="font-weight:400">(${list.length})</span></div><div class="cat-table-wrap"><div class="table-wrap"><table><thead><tr><th>Roll</th><th>Name</th><th>CAE1</th><th>CAE2</th><th>Mentor</th></tr></thead><tbody>${rows||`<tr><td colspan="5" style="text-align:center;padding:16px;color:var(--gray-400)">No students.</td></tr>`}</tbody></table></div></div></div>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
// ADMIN — MENTORS
// ══════════════════════════════════════════════════════════════
function loadMentors(){
  const mentorMap=DB.get('mentor_mapping')||[];
  const students=DB.get('students')||[];
  const container=document.getElementById('mentors-list');
  if(!mentorMap.length){container.innerHTML='<div class="empty-state"><div class="icon">🤝</div><p>No mentor assignments yet. Add slow learner students to auto-assign mentors.</p></div>';return;}
  container.innerHTML=mentorMap.map(m=>{
    const mentor=students.find(s=>s.id===m.mentor_id);
    const mentee=students.find(s=>s.id===m.mentee_id);
    if(!mentor||!mentee) return '';
    return`<div class="mentor-pair-card">
      <div class="mentor-mini-avatar" style="background:var(--adv-bg);border:2px solid var(--adv-border)">🎓</div>
      <div class="mentor-pair-info"><h4>${mentor.name}</h4><p style="color:var(--adv)">Advanced • ${mentor.roll_number}</p></div>
      <div class="arrow-icon">→</div>
      <div class="mentor-mini-avatar" style="background:var(--slow-bg);border:2px solid var(--slow-border)">📚</div>
      <div class="mentor-pair-info"><h4>${mentee.name}</h4><p style="color:var(--slow)">Slow Learner • ${mentee.roll_number}</p></div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
// ADMIN — CERTIFICATES
// ══════════════════════════════════════════════════════════════
function loadCertificates(){
  const students=DB.get('students')||[];
  const certs=DB.get('certificates')||[];
  const advStudents=students.filter(s=>s.overall_category==='advanced');
  const sel=document.getElementById('cert-student-sel');
  sel.innerHTML='<option value="">— Select Advanced Learner —</option>'+advStudents.map(s=>`<option value="${s.id}">${s.roll_number} – ${s.name}</option>`).join('');
  document.getElementById('certs-tbody').innerHTML=certs.length
    ?certs.map(c=>{const s=students.find(st=>st.id===c.student_id);return`<tr><td><strong>${s?s.roll_number:'?'}</strong></td><td>${s?s.name:'?'}</td><td>${c.description||'—'}</td><td><a href="${c.link}" target="_blank" class="btn amber sm">🔗 Open</a></td></tr>`;}).join('')
    :'<tr><td colspan="4"><div class="empty-state"><div class="icon">📄</div><p>No certificates yet.</p></div></td></tr>';
}
function submitCertificate(){
  const sid=parseInt(document.getElementById('cert-student-sel').value);
  const link=document.getElementById('cert-link').value.trim();
  const desc=document.getElementById('cert-desc').value.trim();
  const alertEl=document.getElementById('cert-alert');
  if(!sid){alertEl.innerHTML='<div class="alert error">❌ Select a student.</div>';return;}
  if(!link||!/^https?:\/\//i.test(link)){alertEl.innerHTML='<div class="alert error">❌ Enter a valid URL.</div>';return;}
  const certs=DB.get('certificates')||[];
  certs.push({id:nextId('cert'),student_id:sid,link,description:desc,uploaded_at:new Date().toISOString()});
  DB.set('certificates',certs);
  document.getElementById('cert-link').value='';
  document.getElementById('cert-desc').value='';
  alertEl.innerHTML='<div class="alert success">✅ Certificate submitted!</div>';
  setTimeout(()=>alertEl.innerHTML='',2500);
  toast('Certificate saved!','success');
  loadCertificates();
}

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{
  DB.init(() => {
    document.getElementById('studentModal').addEventListener('click',e=>{
      if(e.target===document.getElementById('studentModal')) closeModal();
    });
    const sess=DB.get('session');
    if(sess?.type==='admin'){
      document.getElementById('admin-display-name').textContent=sess.name;
      goTo('admin-portal');
      adminNav('dashboard',document.querySelector('[data-page="dashboard"]'));
    } else if(sess?.type==='student'){
      const students=DB.get('students')||[];
      const student=students.find(s=>s.id===sess.id);
      if(student){
        document.getElementById('sp-username').textContent=`👤 ${student.name} (${student.roll_number})`;
        goTo('student-portal');
        loadStudentPortal(student.id);
      } else {
        goTo('landing');
      }
    }
  });
});
