import { useState, useEffect, useCallback } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const isOverdue = (deadline, status) => deadline && status !== "Completed" && new Date(deadline) < new Date();

const SEED = (() => {
  const adminId = uid(), m1 = uid(), m2 = uid(), m3 = uid();
  const p1 = uid(), p2 = uid(), p3 = uid();
  const t1 = uid(), t2 = uid(), t3 = uid(), t4 = uid(), t5 = uid(), t6 = uid();

  const users = [
    { id: adminId, name: "Arjun Sharma",    email: "arjun@taskflow.com",    password: "arjun@123",  role: "Admin",  avatar: "AS", bio: "Project lead & system admin",          joined: now() },
    { id: m1,      name: "Tejaswee Thorat", email: "tejaswee@taskflow.com", password: "tejas@123",  role: "Member", avatar: "TT", bio: "Frontend developer & UI designer",     joined: now() },
    { id: m2,      name: "Rohan Kulkarni",  email: "rohan@taskflow.com",    password: "rohan@123",  role: "Member", avatar: "RK", bio: "Backend developer & DevOps engineer",  joined: now() },
    { id: m3,      name: "Priya Desai",     email: "priya@taskflow.com",    password: "priya@123",  role: "Member", avatar: "PD", bio: "QA engineer & test automation lead",   joined: now() },
  ];

  const projects = [
    { id: p1, name: "Website Redesign",    description: "Complete overhaul of company website with new brand identity",    deadline: "2026-07-01", priority: "High",     createdBy: adminId, members: [adminId, m1, m2, m3], createdAt: now() },
    { id: p2, name: "Mobile App MVP",      description: "Build iOS and Android MVP for product launch",                    deadline: "2026-06-15", priority: "Critical", createdBy: adminId, members: [adminId, m2, m3],     createdAt: now() },
    { id: p3, name: "QA Automation Suite", description: "Build end-to-end automated test suite covering all core flows",  deadline: "2026-08-01", priority: "Medium",   createdBy: adminId, members: [adminId, m3, m1],     createdAt: now() },
  ];

  const tasks = [
    { id: t1, title: "Design new homepage mockup",      description: "Create Figma wireframes and high-fidelity mockups for the homepage.",   projectId: p1, assignedTo: m1, status: "In Progress", priority: "High",     deadline: "2026-05-30", createdBy: adminId, createdAt: now(), comments: [{ id: uid(), userId: m1, text: "Wireframes done, working on high-fidelity now.", time: now() }], files: [] },
    { id: t2, title: "Set up CI/CD pipeline",           description: "Configure GitHub Actions for automated testing and deployment.",         projectId: p1, assignedTo: m2, status: "Completed",  priority: "Critical", deadline: "2026-05-20", createdBy: adminId, createdAt: now(), comments: [], files: [] },
    { id: t3, title: "API endpoint documentation",      description: "Document all REST endpoints using Swagger/OpenAPI spec.",                projectId: p2, assignedTo: m2, status: "To Do",      priority: "Medium",   deadline: "2026-06-05", createdBy: adminId, createdAt: now(), comments: [], files: [] },
    { id: t4, title: "User authentication flow",        description: "Implement JWT-based auth with refresh tokens for the mobile app.",       projectId: p2, assignedTo: m2, status: "In Progress", priority: "Critical", deadline: "2026-05-28", createdBy: adminId, createdAt: now(), comments: [], files: [] },
    { id: t5, title: "Write login & signup test cases", description: "Create automated Selenium tests for login, signup, and forgot-password.",projectId: p3, assignedTo: m3, status: "In Progress", priority: "High",     deadline: "2026-06-10", createdBy: adminId, createdAt: now(), comments: [{ id: uid(), userId: m3, text: "Login tests done. Working on signup tests now.", time: now() }], files: [] },
    { id: t6, title: "Cross-browser compatibility QA",  description: "Run full regression suite across Chrome, Firefox, Safari and Edge.",    projectId: p3, assignedTo: m3, status: "To Do",      priority: "Medium",   deadline: "2026-06-20", createdBy: adminId, createdAt: now(), comments: [], files: [] },
  ];

  const logs = [
    { id: uid(), userId: adminId, action: "Created project 'Website Redesign'",       time: now() },
    { id: uid(), userId: adminId, action: "Created project 'Mobile App MVP'",          time: now() },
    { id: uid(), userId: adminId, action: "Created project 'QA Automation Suite'",     time: now() },
    { id: uid(), userId: adminId, action: "Assigned tasks to Tejaswee, Rohan & Priya", time: now() },
    { id: uid(), userId: m2,      action: "Completed 'Set up CI/CD pipeline'",         time: now() },
    { id: uid(), userId: m3,      action: "Started 'Write login & signup test cases'", time: now() },
  ];

  return { users, projects, tasks, logs };
})();

const useStore = () => {
  const [users, setUsers] = useState(SEED.users);
  const [projects, setProjects] = useState(SEED.projects);
  const [tasks, setTasks] = useState(SEED.tasks);
  const [logs, setLogs] = useState(SEED.logs);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const addLog = useCallback((userId, action) => setLogs(l => [{ id: uid(), userId, action, time: now() }, ...l]), []);
  const addNotif = useCallback((msg, type = "info") => {
    const id = uid();
    setNotifications(n => [...n, { id, msg, type }]);
    setTimeout(() => setNotifications(n => n.filter(x => x.id !== id)), 3500);
  }, []);
  return { users, setUsers, projects, setProjects, tasks, setTasks, logs, setLogs, currentUser, setCurrentUser, notifications, addLog, addNotif };
};

const PRIORITY_COLOR = { Low: "#22c55e", Medium: "#f59e0b", High: "#f97316", Critical: "#ef4444" };
const STATUS_COLOR = { "To Do": "#64748b", "In Progress": "#3b82f6", "Completed": "#22c55e" };
const STATUS_BG = { "To Do": "#1e2533", "In Progress": "#1a2744", "Completed": "#0f2e1a" };

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#0a0d14;--surface:#111520;--surface2:#161b28;--surface3:#1c2233;
    --border:#1f2840;--border2:#253050;
    --text:#e8eaf2;--text2:#8892b0;--text3:#4a5568;
    --accent:#5c7cfa;--accent2:#7c3aed;--accent3:#06b6d4;
    --success:#22c55e;--warning:#f59e0b;--danger:#ef4444;
    --font-display:'Syne',sans-serif;--font-body:'DM Sans',sans-serif;
    --radius:12px;--radius-sm:8px;--radius-lg:16px;
    --shadow:0 4px 24px rgba(0,0,0,0.4);
  }
  html,body,#root{height:100%;background:var(--bg);color:var(--text);font-family:var(--font-body);font-size:14px;line-height:1.6}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:var(--bg)}
  ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
  button{cursor:pointer;font-family:var(--font-body);border:none;outline:none}
  input,textarea,select{font-family:var(--font-body);outline:none}
  .app{display:flex;height:100vh;overflow:hidden}
  .sidebar{width:240px;min-width:240px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto}
  .main{flex:1;display:flex;flex-direction:column;overflow:hidden}
  .topbar{height:56px;min-height:56px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 24px;gap:16px}
  .content{flex:1;overflow-y:auto;padding:24px}
  .sidebar-logo{padding:20px 20px 12px;display:flex;align-items:center;gap:10px}
  .logo-icon{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px}
  .logo-text{font-family:var(--font-display);font-weight:800;font-size:16px;letter-spacing:-0.5px;background:linear-gradient(135deg,#fff 60%,var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .sidebar-section{padding:8px 12px 4px;font-size:10px;font-weight:600;letter-spacing:1.5px;color:var(--text3);text-transform:uppercase}
  .nav-item{display:flex;align-items:center;gap:10px;padding:9px 14px;margin:2px 8px;border-radius:var(--radius-sm);color:var(--text2);font-size:13.5px;font-weight:500;cursor:pointer;transition:all 0.15s;position:relative}
  .nav-item:hover{background:var(--surface2);color:var(--text)}
  .nav-item.active{background:rgba(92,124,250,0.12);color:var(--accent)}
  .nav-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:18px;background:var(--accent);border-radius:0 2px 2px 0}
  .nav-icon{font-size:16px;width:20px;text-align:center}
  .badge{margin-left:auto;background:var(--danger);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:99px;min-width:18px;text-align:center}
  .sidebar-footer{margin-top:auto;padding:12px;border-top:1px solid var(--border)}
  .user-card{display:flex;align-items:center;gap:10px;padding:10px;border-radius:var(--radius-sm);cursor:pointer;transition:background 0.15s}
  .user-card:hover{background:var(--surface2)}
  .avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
  .avatar.lg{width:48px;height:48px;font-size:16px}
  .avatar.xl{width:64px;height:64px;font-size:20px}
  .user-info{flex:1;overflow:hidden}
  .user-name{font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .user-role{font-size:11px;color:var(--text3)}
  .topbar-title{font-family:var(--font-display);font-weight:700;font-size:18px;letter-spacing:-0.3px}
  .topbar-right{margin-left:auto;display:flex;align-items:center;gap:12px}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px}
  .card-hover{transition:border-color 0.2s,box-shadow 0.2s;cursor:pointer}
  .card-hover:hover{border-color:var(--border2);box-shadow:var(--shadow)}
  .grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
  .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .flex{display:flex}.flex-col{flex-direction:column}
  .items-center{align-items:center}.justify-between{justify-content:space-between}.justify-end{justify-content:flex-end}
  .flex-1{flex:1}.flex-wrap{flex-wrap:wrap}
  .gap-4{gap:4px}.gap-6{gap:6px}.gap-8{gap:8px}.gap-10{gap:10px}.gap-12{gap:12px}.gap-16{gap:16px}
  .mb-4{margin-bottom:4px}.mb-8{margin-bottom:8px}.mb-12{margin-bottom:12px}.mb-16{margin-bottom:16px}.mb-20{margin-bottom:20px}.mb-24{margin-bottom:24px}
  .mt-4{margin-top:4px}.mt-8{margin-top:8px}.mt-12{margin-top:12px}.mt-16{margin-top:16px}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:var(--radius-sm);font-size:13.5px;font-weight:500;transition:all 0.15s}
  .btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{background:#4a6cf7;box-shadow:0 0 20px rgba(92,124,250,0.3)}
  .btn-secondary{background:var(--surface2);border:1px solid var(--border);color:var(--text)}.btn-secondary:hover{background:var(--surface3);border-color:var(--border2)}
  .btn-danger{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:var(--danger)}.btn-danger:hover{background:rgba(239,68,68,0.2)}
  .btn-success{background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);color:var(--success)}.btn-success:hover{background:rgba(34,197,94,0.2)}
  .btn-sm{padding:5px 12px;font-size:12.5px}
  .btn-xs{padding:3px 8px;font-size:11.5px;border-radius:6px}
  .form-group{display:flex;flex-direction:column;gap:6px}
  .label{font-size:12.5px;font-weight:500;color:var(--text2)}
  .input{background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:9px 12px;border-radius:var(--radius-sm);font-size:13.5px;width:100%;transition:border-color 0.15s}
  .input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(92,124,250,0.1)}
  .input::placeholder{color:var(--text3)}
  textarea.input{resize:vertical;min-height:80px}
  select.input{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238892b0' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:28px}
  .tag{display:inline-flex;align-items:center;padding:2px 8px;border-radius:99px;font-size:11.5px;font-weight:600}
  .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px 22px;display:flex;flex-direction:column;gap:6px;position:relative;overflow:hidden}
  .stat-value{font-family:var(--font-display);font-weight:700;font-size:28px;letter-spacing:-1px}
  .stat-label{font-size:12px;color:var(--text2);font-weight:500}
  .stat-icon{position:absolute;right:16px;top:16px;font-size:24px;opacity:0.15}
  .progress-bar{height:6px;background:var(--surface3);border-radius:99px;overflow:hidden}
  .progress-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:99px;transition:width 0.5s}
  .task-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;transition:all 0.2s;cursor:pointer}
  .task-card:hover{border-color:var(--border2);box-shadow:var(--shadow);transform:translateY(-1px)}
  .task-card.overdue{border-color:rgba(239,68,68,0.3);background:rgba(239,68,68,0.03)}
  .task-title{font-weight:600;font-size:14px;margin-bottom:4px}
  .task-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
  .modal{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius-lg);padding:28px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow)}
  .modal-lg{max-width:700px}
  .modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
  .modal-title{font-family:var(--font-display);font-weight:700;font-size:18px}
  .close-btn{background:var(--surface2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:14px;display:flex;align-items:center;justify-content:center}
  .close-btn:hover{background:var(--surface3);color:var(--text)}
  .auth-screen{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:20px;position:relative;overflow:hidden}
  .auth-screen::before{content:'';position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(92,124,250,0.08) 0%,transparent 70%);top:-200px;left:-200px}
  .auth-screen::after{content:'';position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%);bottom:-100px;right:-100px}
  .auth-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:36px;width:100%;max-width:440px;position:relative;z-index:1}
  .auth-logo{display:flex;align-items:center;gap:10px;margin-bottom:20px;justify-content:center}
  .auth-title{font-family:var(--font-display);font-weight:800;font-size:22px;text-align:center;margin-bottom:4px}
  .auth-subtitle{color:var(--text2);font-size:13px;text-align:center;margin-bottom:20px}
  .auth-switch{text-align:center;margin-top:20px;color:var(--text2);font-size:13px}
  .auth-switch span{color:var(--accent);cursor:pointer;font-weight:500}
  .notif-container{position:fixed;top:16px;right:16px;z-index:999;display:flex;flex-direction:column;gap:8px;pointer-events:none}
  .notif{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius-sm);padding:12px 16px;font-size:13px;font-weight:500;box-shadow:var(--shadow);animation:slideIn 0.3s ease;pointer-events:all;max-width:300px}
  .notif.success{border-color:rgba(34,197,94,0.4);color:var(--success)}
  .notif.error{border-color:rgba(239,68,68,0.4);color:var(--danger)}
  .notif.info{border-color:rgba(92,124,250,0.4);color:var(--accent)}
  @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  .text-sm{font-size:12.5px}.text-xs{font-size:11.5px}
  .text-muted{color:var(--text2)}.text-danger{color:var(--danger)}.text-success{color:var(--success)}
  .font-bold{font-weight:700}.font-semibold{font-weight:600}
  .text-center{text-align:center}
  .truncate{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .empty-state{text-align:center;padding:48px 24px;color:var(--text3)}
  .empty-icon{font-size:40px;margin-bottom:12px}
  .empty-text{font-size:14px}
  .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
  .section-title{font-family:var(--font-display);font-weight:700;font-size:16px}
  .kanban{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}
  .kanban-col{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:14px}
  .kanban-col-header{font-weight:700;font-size:13px;margin-bottom:12px;display:flex;align-items:center;gap:8px}
  .kanban-col-count{font-size:11px;background:var(--surface3);padding:1px 7px;border-radius:99px;color:var(--text2)}
  .member-chip{display:inline-flex;align-items:center;gap:6px;background:var(--surface2);border:1px solid var(--border);padding:4px 10px;border-radius:99px;font-size:12px;font-weight:500}
  .tab-bar{display:flex;gap:4px;background:var(--surface2);border-radius:var(--radius-sm);padding:4px;margin-bottom:20px}
  .tab{padding:7px 16px;border-radius:6px;font-size:13px;font-weight:500;color:var(--text2);cursor:pointer;transition:all 0.15s}
  .tab.active{background:var(--surface);color:var(--text);box-shadow:0 1px 4px rgba(0,0,0,0.3)}
  .table{width:100%;border-collapse:collapse}
  .table th{text-align:left;padding:10px 14px;font-size:11.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.8px;border-bottom:1px solid var(--border)}
  .table td{padding:12px 14px;border-bottom:1px solid var(--border);font-size:13.5px;vertical-align:middle}
  .table tr:hover td{background:var(--surface2)}
  .table tr:last-child td{border-bottom:none}
  .comment{background:var(--surface2);border-radius:var(--radius-sm);padding:10px 12px;margin-bottom:8px}
  .comment-header{display:flex;align-items:center;gap:8px;margin-bottom:4px}
  .role-badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600}
  .role-badge.Admin{background:rgba(92,124,250,0.15);color:var(--accent)}
  .role-badge.Member{background:rgba(139,92,246,0.15);color:#a78bfa}
  .status-toggle{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
  .status-btn{padding:5px 12px;border-radius:99px;font-size:12px;font-weight:600;cursor:pointer;border:1.5px solid transparent;transition:all 0.15s}
  .member-progress-card{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:12px}
  .task-row-member{display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--surface3);border-radius:8px;margin-bottom:6px}
  @media(max-width:900px){
    .grid-4{grid-template-columns:repeat(2,1fr)}
    .grid-3{grid-template-columns:repeat(2,1fr)}
    .kanban{grid-template-columns:1fr}
    .sidebar{width:200px;min-width:200px}
  }
`;

// ── Icons ──
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const FullscreenIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
    <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);

// ── Shared UI ──
const PriorityTag = ({ p }) => (
  <span className="tag" style={{ background: `${PRIORITY_COLOR[p]}22`, color: PRIORITY_COLOR[p] }}>{p}</span>
);
const StatusTag = ({ s }) => (
  <span className="tag" style={{ background: STATUS_BG[s], color: STATUS_COLOR[s], border: `1px solid ${STATUS_COLOR[s]}33` }}>{s}</span>
);
const Modal = ({ title, onClose, children, large }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={`modal ${large ? "modal-lg" : ""}`}>
      <div className="modal-header">
        <div className="modal-title">{title}</div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      {children}
    </div>
  </div>
);
const NotifContainer = ({ notifications }) => (
  <div className="notif-container">
    {notifications.map(n => <div key={n.id} className={`notif ${n.type}`}>{n.msg}</div>)}
  </div>
);

// ── Auth ──
const AuthScreen = ({ users, setUsers, setCurrentUser, addNotif, addLog }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Member" });
  const [err, setErr] = useState("");
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    setErr("");
    if (mode === "login") {
      const u = users.find(x => x.email === form.email && x.password === form.password);
      if (!u) return setErr("Invalid email or password.");
      setCurrentUser(u); addNotif(`Welcome back, ${u.name}! 👋`, "success"); addLog(u.id, "Logged in");
    } else {
      if (!form.name || !form.email || !form.password) return setErr("All fields are required.");
      if (users.find(x => x.email === form.email)) return setErr("Email already registered.");
      const u = { id: uid(), name: form.name, email: form.email, password: form.password, role: form.role, avatar: form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2), bio: "", joined: now() };
      setUsers(us => [...us, u]); setCurrentUser(u);
      addNotif(`Account created! Welcome, ${u.name}! 🎉`, "success"); addLog(u.id, `Signed up as ${u.role}`);
    }
  };

  const reset = () => {
    if (!users.find(x => x.email === form.email)) return setErr("Email not found.");
    addNotif("Password reset link sent! (demo)", "info");
  };

  const adminSel = form.email === "arjun@taskflow.com";
  const memberSel = form.email === "tejaswee@taskflow.com";

  if (mode === "reset") return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo"><div className="logo-icon">⚡</div><div className="logo-text">TaskFlow</div></div>
        <div className="auth-title">Reset Password</div>
        <div className="auth-subtitle">Enter your email to receive a reset link</div>
        {err && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--danger)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13 }}>{err}</div>}
        <div className="flex flex-col gap-12">
          <div className="form-group"><label className="label">Email</label><input className="input" type="email" placeholder="you@company.com" value={form.email} onChange={upd("email")} /></div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={reset}>Send Reset Link</button>
        </div>
        <div className="auth-switch"><span onClick={() => setMode("login")}>← Back to Login</span></div>
      </div>
    </div>
  );

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo"><div className="logo-icon">⚡</div><div className="logo-text">TaskFlow</div></div>
        <div className="auth-title">{mode === "login" ? "Welcome back" : "Create account"}</div>
        <div className="auth-subtitle">{mode === "login" ? "Sign in to your workspace" : "Join your team on TaskFlow"}</div>

        {/* ── SELECT ROLE — clean pill buttons, NO credentials shown ── */}
        {mode === "login" && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text3)", textAlign: "center", marginBottom: 12 }}>Select Role</div>
            <div style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 6 }}>

              {/* ── Admin button ── */}
              <div
                onClick={() => setForm(f => ({ ...f, email: "arjun@taskflow.com", password: "arjun@123" }))}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "14px 16px", borderRadius: 12, cursor: "pointer", transition: "all 0.22s",
                  background: adminSel
                    ? "linear-gradient(135deg, rgba(92,124,250,0.45) 0%, rgba(124,58,237,0.35) 100%)"
                    : "rgba(255,255,255,0.04)",
                  border: adminSel ? "1.5px solid rgba(92,124,250,0.6)" : "1.5px solid rgba(255,255,255,0.06)",
                  boxShadow: adminSel ? "0 4px 20px rgba(92,124,250,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" : "none",
                }}>
                <div style={{
                  color: adminSel ? "#a5b4fc" : "#4a5f80",
                  transition: "all 0.22s",
                  filter: adminSel ? "drop-shadow(0 0 6px rgba(165,180,252,0.6))" : "none",
                  display: "flex"
                }}>
                  <ShieldIcon />
                </div>
                <span style={{
                  fontWeight: 700, fontSize: 15.5, letterSpacing: "0.2px", transition: "color 0.22s",
                  color: adminSel ? "#ffffff" : "#4a5f80",
                  textShadow: adminSel ? "0 0 12px rgba(165,180,252,0.5)" : "none"
                }}>Admin</span>
              </div>

              {/* ── Member button ── */}
              <div
                onClick={() => setForm(f => ({ ...f, email: "tejaswee@taskflow.com", password: "tejas@123" }))}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "14px 16px", borderRadius: 12, cursor: "pointer", transition: "all 0.22s",
                  background: memberSel
                    ? "linear-gradient(135deg, rgba(92,124,250,0.45) 0%, rgba(124,58,237,0.35) 100%)"
                    : "rgba(255,255,255,0.04)",
                  border: memberSel ? "1.5px solid rgba(92,124,250,0.6)" : "1.5px solid rgba(255,255,255,0.06)",
                  boxShadow: memberSel ? "0 4px 20px rgba(92,124,250,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" : "none",
                }}>
                <div style={{
                  color: memberSel ? "#a5b4fc" : "#4a5f80",
                  transition: "all 0.22s",
                  filter: memberSel ? "drop-shadow(0 0 6px rgba(165,180,252,0.6))" : "none",
                  display: "flex"
                }}>
                  <UserIcon />
                </div>
                <span style={{
                  fontWeight: 700, fontSize: 15.5, letterSpacing: "0.2px", transition: "color 0.22s",
                  color: memberSel ? "#ffffff" : "#4a5f80",
                  textShadow: memberSel ? "0 0 12px rgba(165,180,252,0.5)" : "none"
                }}>Member</span>
              </div>

            </div>
          </div>
        )}

        {err && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--danger)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13 }}>{err}</div>}
        <div className="flex flex-col gap-12">
          {mode === "signup" && <div className="form-group"><label className="label">Full Name</label><input className="input" placeholder="Jordan Lee" value={form.name} onChange={upd("name")} /></div>}
          <div className="form-group"><label className="label">Email</label><input className="input" type="email" placeholder="you@company.com" value={form.email} onChange={upd("email")} /></div>
          <div className="form-group"><label className="label">Password</label><input className="input" type="password" placeholder="••••••••" value={form.password} onChange={upd("password")} /></div>
          {mode === "signup" && (
            <div className="form-group"><label className="label">Role</label>
              <select className="input" value={form.role} onChange={upd("role")}>
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          )}
          {mode === "login" && <div style={{ textAlign: "right", marginTop: -4 }}><span style={{ color: "var(--accent)", fontSize: 12, cursor: "pointer" }} onClick={() => setMode("reset")}>Forgot password?</span></div>}
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "11px" }} onClick={submit}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
        <div className="auth-switch">{mode === "login" ? <>Don't have an account? <span onClick={() => setMode("signup")}>Sign up</span></> : <>Already have an account? <span onClick={() => setMode("login")}>Sign in</span></>}</div>
      </div>
    </div>
  );
};

// ── Dashboard ──
const Dashboard = ({ store }) => {
  const { currentUser, tasks, projects, users } = store;
  const isAdmin = currentUser.role === "Admin";
  const myTasks = isAdmin ? tasks : tasks.filter(t => t.assignedTo === currentUser.id);
  const inProg = myTasks.filter(t => t.status === "In Progress");
  const done = myTasks.filter(t => t.status === "Completed");
  const overdue = myTasks.filter(t => isOverdue(t.deadline, t.status));
  const myProjects = isAdmin ? projects : projects.filter(p => p.members.includes(currentUser.id));
  const stats = [
    { label: "Total Tasks", value: myTasks.length, icon: "📋", color: "var(--accent)" },
    { label: "In Progress", value: inProg.length, icon: "⚡", color: "var(--warning)" },
    { label: "Completed", value: done.length, icon: "✅", color: "var(--success)" },
    { label: "Overdue", value: overdue.length, icon: "🔴", color: "var(--danger)" },
  ];
  return (
    <div>
      <div className="mb-24">
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {currentUser.name.split(" ")[0]} 👋
        </h2>
        <p className="text-muted">Here's what's happening in your workspace today.</p>
      </div>
      <div className="grid-4 mb-24">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color, borderRadius: "12px 12px 0 0" }} />
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid-2 mb-24">
        <div className="card">
          <div className="section-header"><div className="section-title">Active Projects</div></div>
          {myProjects.slice(0, 4).map(p => {
            const ptasks = tasks.filter(t => t.projectId === p.id);
            const pdone = ptasks.filter(t => t.status === "Completed").length;
            const pct = ptasks.length ? Math.round((pdone / ptasks.length) * 100) : 0;
            return (
              <div key={p.id} style={{ marginBottom: 16 }}>
                <div className="flex items-center justify-between mb-4">
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                  <PriorityTag p={p.priority} />
                </div>
                <div className="progress-bar mb-4"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>{pdone}/{ptasks.length} tasks</span><span>{pct}%</span>
                </div>
              </div>
            );
          })}
          {myProjects.length === 0 && <div className="empty-state" style={{ padding: "24px 0" }}><div className="empty-icon">📁</div><div className="empty-text">No projects yet</div></div>}
        </div>
        <div className="card">
          <div className="section-header"><div className="section-title">Recent Tasks</div></div>
          {myTasks.slice(0, 5).map(t => {
            const proj = projects.find(p => p.id === t.projectId);
            return (
              <div key={t.id} className="flex items-center gap-12 mb-12" style={{ paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }} className="truncate">{t.title}</div>
                  <div className="text-xs text-muted">{proj?.name}</div>
                </div>
                <StatusTag s={t.status} />
              </div>
            );
          })}
          {myTasks.length === 0 && <div className="empty-state" style={{ padding: "24px 0" }}><div className="empty-icon">✨</div><div className="empty-text">No tasks assigned</div></div>}
        </div>
      </div>
      {overdue.length > 0 && (
        <div className="card" style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.03)" }}>
          <div className="section-title mb-16" style={{ color: "var(--danger)" }}>⚠️ Overdue Tasks ({overdue.length})</div>
          {overdue.map(t => {
            const proj = projects.find(p => p.id === t.projectId);
            const assignee = users.find(u => u.id === t.assignedTo);
            return (
              <div key={t.id} className="flex items-center gap-12 mb-8" style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{t.title}</div>
                  <div className="text-xs text-muted">{proj?.name} · Due {fmtDate(t.deadline)}</div>
                </div>
                {isAdmin && assignee && <div className="member-chip"><div className="avatar" style={{ width: 20, height: 20, fontSize: 9 }}>{assignee.avatar}</div>{assignee.name}</div>}
                <PriorityTag p={t.priority} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Projects ──
const Projects = ({ store }) => {
  const { projects, setProjects, tasks, users, currentUser, addNotif, addLog } = store;
  const isAdmin = currentUser.role === "Admin";
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", deadline: "", priority: "Medium", members: [] });
  const [editId, setEditId] = useState(null);
  const myProjects = isAdmin ? projects : projects.filter(p => p.members.includes(currentUser.id));
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const openCreate = () => { setForm({ name: "", description: "", deadline: "", priority: "Medium", members: [currentUser.id] }); setEditId(null); setModal("form"); };
  const openEdit = p => { setForm({ name: p.name, description: p.description, deadline: p.deadline, priority: p.priority, members: p.members }); setEditId(p.id); setModal("form"); };
  const save = () => {
    if (!form.name.trim()) return addNotif("Project name required", "error");
    if (editId) { setProjects(ps => ps.map(p => p.id === editId ? { ...p, ...form } : p)); addNotif("Project updated", "success"); addLog(currentUser.id, `Updated project '${form.name}'`); }
    else { const np = { id: uid(), ...form, members: form.members.length ? form.members : [currentUser.id], createdBy: currentUser.id, createdAt: now() }; setProjects(ps => [...ps, np]); addNotif("Project created!", "success"); addLog(currentUser.id, `Created project '${form.name}'`); }
    setModal(null);
  };
  const del = id => { const p = projects.find(x => x.id === id); setProjects(ps => ps.filter(x => x.id !== id)); addNotif("Project deleted", "info"); addLog(currentUser.id, `Deleted project '${p?.name}'`); };
  const toggleMember = id => setForm(f => ({ ...f, members: f.members.includes(id) ? f.members.filter(x => x !== id) : [...f.members, id] }));
  return (
    <div>
      <div className="section-header mb-24">
        <div><div className="section-title" style={{ fontSize: 20 }}>Projects</div><div className="text-sm text-muted">{myProjects.length} project{myProjects.length !== 1 ? "s" : ""}</div></div>
        {isAdmin && <button className="btn btn-primary" onClick={openCreate}>+ New Project</button>}
      </div>
      {myProjects.length === 0 ? <div className="empty-state"><div className="empty-icon">📁</div><div className="empty-text">No projects found</div>{isAdmin && <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openCreate}>Create First Project</button>}</div> : (
        <div className="grid-3">
          {myProjects.map(p => {
            const ptasks = tasks.filter(t => t.projectId === p.id);
            const pdone = ptasks.filter(t => t.status === "Completed").length;
            const pct = ptasks.length ? Math.round((pdone / ptasks.length) * 100) : 0;
            const over = isOverdue(p.deadline, "active");
            return (
              <div key={p.id} className="card card-hover" style={over ? { borderColor: "rgba(239,68,68,0.3)" } : {}}>
                <div className="flex items-center justify-between mb-12">
                  <PriorityTag p={p.priority} />
                  {isAdmin && <div className="flex gap-4"><button className="btn btn-xs btn-secondary" onClick={() => openEdit(p)}>Edit</button><button className="btn btn-xs btn-danger" onClick={() => del(p.id)}>Delete</button></div>}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{p.name}</div>
                <div className="text-sm text-muted mb-16" style={{ minHeight: 36 }}>{p.description}</div>
                <div className="progress-bar mb-8"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                <div className="flex items-center justify-between text-xs text-muted mb-12"><span>{pdone}/{ptasks.length} tasks done</span><span>{pct}%</span></div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    {p.members.slice(0, 4).map(mid => { const m = users.find(u => u.id === mid); return m ? <div key={mid} className="avatar" style={{ width: 24, height: 24, fontSize: 9 }} title={m.name}>{m.avatar}</div> : null; })}
                    {p.members.length > 4 && <div className="avatar" style={{ width: 24, height: 24, fontSize: 9, background: "var(--surface3)" }}>+{p.members.length - 4}</div>}
                  </div>
                  <div className="text-xs text-muted" style={over ? { color: "var(--danger)" } : {}}>{over ? "⚠️ " : "📅 "}{fmtDate(p.deadline)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modal === "form" && (
        <Modal title={editId ? "Edit Project" : "New Project"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-16">
            <div className="form-group"><label className="label">Project Name *</label><input className="input" placeholder="e.g. Website Redesign" value={form.name} onChange={upd("name")} /></div>
            <div className="form-group"><label className="label">Description</label><textarea className="input" placeholder="What is this project about?" value={form.description} onChange={upd("description")} /></div>
            <div className="grid-2">
              <div className="form-group"><label className="label">Deadline</label><input className="input" type="date" value={form.deadline} onChange={upd("deadline")} /></div>
              <div className="form-group"><label className="label">Priority</label>
                <select className="input" value={form.priority} onChange={upd("priority")}>{["Low","Medium","High","Critical"].map(p => <option key={p}>{p}</option>)}</select>
              </div>
            </div>
            <div className="form-group"><label className="label">Team Members</label>
              <div className="flex flex-wrap gap-8" style={{ marginTop: 4 }}>
                {users.map(u => (
                  <label key={u.id} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", background: form.members.includes(u.id) ? "rgba(92,124,250,0.12)" : "var(--surface2)", border: `1px solid ${form.members.includes(u.id) ? "var(--accent)" : "var(--border)"}`, borderRadius: 99, padding: "4px 10px", fontSize: 12.5, fontWeight: 500, transition: "all 0.15s" }}>
                    <input type="checkbox" checked={form.members.includes(u.id)} onChange={() => toggleMember(u.id)} style={{ display: "none" }} />
                    <div className="avatar" style={{ width: 20, height: 20, fontSize: 8 }}>{u.avatar}</div>{u.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-8 justify-end">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editId ? "Update" : "Create"} Project</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── Tasks ──
const Tasks = ({ store }) => {
  const { tasks, setTasks, projects, users, currentUser, addNotif, addLog } = store;
  const isAdmin = currentUser.role === "Admin";
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", projectId: "", assignedTo: "", status: "To Do", priority: "Medium", deadline: "" });
  const [editId, setEditId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [comment, setComment] = useState("");

  const myProjects = isAdmin ? projects : projects.filter(p => p.members.includes(currentUser.id));
  const allTasks = isAdmin ? tasks : tasks.filter(t => t.assignedTo === currentUser.id);
  const filtered = filter === "All" ? allTasks : allTasks.filter(t => t.status === filter);
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const openCreate = () => { setForm({ title: "", description: "", projectId: myProjects[0]?.id || "", assignedTo: "", status: "To Do", priority: "Medium", deadline: "" }); setEditId(null); setModal("form"); };
  const openEdit = t => { setForm({ title: t.title, description: t.description, projectId: t.projectId, assignedTo: t.assignedTo, status: t.status, priority: t.priority, deadline: t.deadline }); setEditId(t.id); setModal("form"); };

  const save = () => {
    if (!form.title.trim()) return addNotif("Task title required", "error");
    if (!form.projectId) return addNotif("Select a project", "error");
    if (editId) { setTasks(ts => ts.map(t => t.id === editId ? { ...t, ...form } : t)); addNotif("Task updated", "success"); addLog(currentUser.id, `Updated task '${form.title}'`); }
    else { const nt = { id: uid(), ...form, createdBy: currentUser.id, createdAt: now(), comments: [], files: [] }; setTasks(ts => [...ts, nt]); addNotif("Task created!", "success"); addLog(currentUser.id, `Created task '${form.title}'`); }
    setModal(null);
  };

  const del = id => { const t = tasks.find(x => x.id === id); setTasks(ts => ts.filter(x => x.id !== id)); addNotif("Task deleted", "info"); addLog(currentUser.id, `Deleted task '${t?.title}'`); setDetail(null); };

  const changeStatus = (id, status) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status } : t));
    addLog(currentUser.id, `Changed task status to '${status}'`);
    if (detail?.id === id) setDetail(d => ({ ...d, status }));
    addNotif(`Status → ${status}`, "success");
  };

  const addComment = () => {
    if (!comment.trim()) return;
    const c = { id: uid(), userId: currentUser.id, text: comment, time: now() };
    setTasks(ts => ts.map(t => t.id === detail.id ? { ...t, comments: [...t.comments, c] } : t));
    setDetail(d => ({ ...d, comments: [...d.comments, c] }));
    setComment("");
  };

  // Inline status toggle for member task rows
  const InlineStatusToggle = ({ task }) => {
    const statuses = ["To Do", "In Progress", "Completed"];
    return (
      <div className="status-toggle">
        {statuses.map(s => (
          <button key={s} className="status-btn"
            style={{
              background: task.status === s ? `${STATUS_COLOR[s]}22` : "var(--surface3)",
              border: `1.5px solid ${task.status === s ? STATUS_COLOR[s] : "var(--border)"}`,
              color: task.status === s ? STATUS_COLOR[s] : "var(--text3)",
            }}
            onClick={e => { e.stopPropagation(); changeStatus(task.id, s); }}>
            {s === "To Do" ? "○" : s === "In Progress" ? "◑" : "●"} {s}
          </button>
        ))}
      </div>
    );
  };

  const TaskCard = ({ t }) => {
    const proj = projects.find(p => p.id === t.projectId);
    const assignee = users.find(u => u.id === t.assignedTo);
    const over = isOverdue(t.deadline, t.status);
    const canEdit = isAdmin || t.assignedTo === currentUser.id;
    return (
      <div className={`task-card ${over ? "overdue" : ""}`} onClick={() => setDetail(t)}>
        <div className="flex items-center gap-8 mb-4">
          <PriorityTag p={t.priority} />
          {over && <span className="tag" style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)" }}>Overdue</span>}
          {t.status === "Completed" && <span style={{ fontSize: 13 }}>✅</span>}
        </div>
        <div className="task-title" style={{ textDecoration: t.status === "Completed" ? "line-through" : "none", opacity: t.status === "Completed" ? 0.6 : 1 }}>{t.title}</div>
        <div className="text-xs text-muted mb-4">{proj?.name}</div>
        {canEdit && !isAdmin && <InlineStatusToggle task={t} />}
        <div className="task-meta">
          {isAdmin && <StatusTag s={t.status} />}
          {assignee && <div className="member-chip"><div className="avatar" style={{ width: 18, height: 18, fontSize: 8 }}>{assignee.avatar}</div>{assignee.name}</div>}
          {t.deadline && <span className="text-xs text-muted" style={over ? { color: "var(--danger)" } : {}}>📅 {fmtDate(t.deadline)}</span>}
        </div>
      </div>
    );
  };

  const detailTask = detail ? tasks.find(t => t.id === detail.id) || detail : null;

  return (
    <div>
      <div className="section-header mb-16">
        <div><div className="section-title" style={{ fontSize: 20 }}>Tasks</div><div className="text-sm text-muted">{filtered.length} task{filtered.length !== 1 ? "s" : ""}</div></div>
        <div className="flex gap-8">
          <div className="flex gap-4">
            {["list","kanban"].map(v => <button key={v} className={`btn btn-sm ${view === v ? "btn-primary" : "btn-secondary"}`} onClick={() => setView(v)}>{v === "list" ? "☰ List" : "⊞ Board"}</button>)}
          </div>
          {isAdmin && <button className="btn btn-primary" onClick={openCreate}>+ New Task</button>}
        </div>
      </div>
      <div className="tab-bar">
        {["All","To Do","In Progress","Completed"].map(f => (
          <div key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</div>
        ))}
      </div>

      {view === "list" ? (
        filtered.length === 0 ? <div className="empty-state"><div className="empty-icon">✨</div><div className="empty-text">No tasks here</div></div> : (
          isAdmin ? (
            <div className="card" style={{ padding: 0 }}>
              <table className="table">
                <thead><tr><th>Task</th><th>Project</th><th>Assignee</th><th>Status</th><th>Priority</th><th>Deadline</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(t => {
                    const proj = projects.find(p => p.id === t.projectId);
                    const assignee = users.find(u => u.id === t.assignedTo);
                    const over = isOverdue(t.deadline, t.status);
                    return (
                      <tr key={t.id} style={{ cursor: "pointer" }} onClick={() => setDetail(t)}>
                        <td><div style={{ fontWeight: 500, textDecoration: t.status === "Completed" ? "line-through" : "none", opacity: t.status === "Completed" ? 0.6 : 1 }}>{t.title}</div>{over && <span style={{ color: "var(--danger)", fontSize: 11 }}>⚠ Overdue</span>}</td>
                        <td><span className="text-sm text-muted">{proj?.name || "—"}</span></td>
                        <td>{assignee ? <div className="member-chip"><div className="avatar" style={{ width: 20, height: 20, fontSize: 9 }}>{assignee.avatar}</div>{assignee.name}</div> : <span className="text-muted">—</span>}</td>
                        <td><StatusTag s={t.status} /></td>
                        <td><PriorityTag p={t.priority} /></td>
                        <td><span className={`text-sm ${over ? "text-danger" : "text-muted"}`}>{fmtDate(t.deadline)}</span></td>
                        <td onClick={e => e.stopPropagation()}>
                          <div className="flex gap-4">
                            <button className="btn btn-xs btn-secondary" onClick={() => openEdit(t)}>Edit</button>
                            <button className="btn btn-xs btn-danger" onClick={() => del(t.id)}>Del</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // Member list view – shows status toggles inline
            <div className="flex flex-col gap-12">
              {filtered.map(t => {
                const proj = projects.find(p => p.id === t.projectId);
                const over = isOverdue(t.deadline, t.status);
                return (
                  <div key={t.id} className="card" style={over ? { borderColor: "rgba(239,68,68,0.3)" } : {}}>
                    <div className="flex items-center gap-8 mb-8">
                      <PriorityTag p={t.priority} />
                      <StatusTag s={t.status} />
                      {over && <span className="tag" style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)" }}>⚠ Overdue</span>}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, textDecoration: t.status === "Completed" ? "line-through" : "none", opacity: t.status === "Completed" ? 0.6 : 1 }}>{t.title}</div>
                    {t.description && <div className="text-sm text-muted mb-8">{t.description}</div>}
                    <div className="text-xs text-muted mb-10">{proj?.name} {t.deadline && <span style={over ? { color: "var(--danger)" } : {}}>· 📅 {fmtDate(t.deadline)}</span>}</div>
                    {/* Status toggle for member */}
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                      <div className="text-xs text-muted mb-6" style={{ fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>Update Status</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {["To Do", "In Progress", "Completed"].map(s => (
                          <button key={s} onClick={() => changeStatus(t.id, s)}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 99, fontSize: 12.5, fontWeight: 600, cursor: "pointer", border: `2px solid ${t.status === s ? STATUS_COLOR[s] : "var(--border)"}`, background: t.status === s ? `${STATUS_COLOR[s]}18` : "var(--surface2)", color: t.status === s ? STATUS_COLOR[s] : "var(--text2)", transition: "all 0.15s" }}>
                            {t.status === s && <span style={{ fontSize: 10 }}>✓</span>} {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="btn btn-xs btn-secondary" style={{ marginTop: 10 }} onClick={() => setDetail(t)}>View Details & Comment</button>
                  </div>
                );
              })}
            </div>
          )
        )
      ) : (
        <div className="kanban">
          {["To Do","In Progress","Completed"].map(s => {
            const col = filtered.filter(t => t.status === s);
            return (
              <div key={s} className="kanban-col">
                <div className="kanban-col-header" style={{ color: STATUS_COLOR[s] }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[s], display: "inline-block" }} />
                  {s} <span className="kanban-col-count">{col.length}</span>
                </div>
                <div className="flex flex-col gap-8">
                  {col.map(t => <TaskCard key={t.id} t={t} />)}
                  {col.length === 0 && <div className="text-xs text-muted text-center" style={{ padding: "16px 0" }}>No tasks</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task form modal */}
      {modal === "form" && (
        <Modal title={editId ? "Edit Task" : "New Task"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-14">
            <div className="form-group"><label className="label">Title *</label><input className="input" placeholder="e.g. Design homepage mockup" value={form.title} onChange={upd("title")} /></div>
            <div className="form-group"><label className="label">Description</label><textarea className="input" placeholder="Task details..." value={form.description} onChange={upd("description")} /></div>
            <div className="form-group"><label className="label">Project *</label>
              <select className="input" value={form.projectId} onChange={upd("projectId")}>
                <option value="">Select project</option>
                {myProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            {isAdmin && <div className="form-group"><label className="label">Assign To</label>
              <select className="input" value={form.assignedTo} onChange={upd("assignedTo")}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            </div>}
            <div className="grid-2">
              <div className="form-group"><label className="label">Status</label>
                <select className="input" value={form.status} onChange={upd("status")}>{["To Do","In Progress","Completed"].map(s => <option key={s}>{s}</option>)}</select>
              </div>
              <div className="form-group"><label className="label">Priority</label>
                <select className="input" value={form.priority} onChange={upd("priority")}>{["Low","Medium","High","Critical"].map(p => <option key={p}>{p}</option>)}</select>
              </div>
            </div>
            <div className="form-group"><label className="label">Deadline</label><input className="input" type="date" value={form.deadline} onChange={upd("deadline")} /></div>
            <div className="flex gap-8 justify-end">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editId ? "Update" : "Create"} Task</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Task detail modal */}
      {detailTask && (
        <Modal title="Task Details" onClose={() => setDetail(null)} large>
          <div className="flex flex-col gap-16">
            <div>
              <div className="flex items-center gap-8 mb-8">
                <PriorityTag p={detailTask.priority} />
                {isOverdue(detailTask.deadline, detailTask.status) && <span className="tag" style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)" }}>⚠ Overdue</span>}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 8, textDecoration: detailTask.status === "Completed" ? "line-through" : "none", opacity: detailTask.status === "Completed" ? 0.7 : 1 }}>{detailTask.title}</h3>
              {detailTask.description && <p className="text-muted" style={{ fontSize: 14 }}>{detailTask.description}</p>}
            </div>
            <div className="grid-2">
              <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "12px 14px" }}>
                <div className="text-xs text-muted mb-8" style={{ fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>Update Status</div>
                <div className="flex flex-col gap-6">
                  {["To Do","In Progress","Completed"].map(s => (
                    <button key={s}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left",
                        border: `2px solid ${detailTask.status === s ? STATUS_COLOR[s] : "var(--border)"}`,
                        background: detailTask.status === s ? `${STATUS_COLOR[s]}18` : "var(--surface3)",
                        color: detailTask.status === s ? STATUS_COLOR[s] : "var(--text2)", transition: "all 0.15s" }}
                      onClick={() => changeStatus(detailTask.id, s)}>
                      <span style={{ fontSize: 16 }}>{detailTask.status === s ? "●" : "○"}</span> {s}
                      {detailTask.status === s && <span style={{ marginLeft: "auto", fontSize: 11 }}>✓ Current</span>}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "12px 14px" }}>
                <div className="text-xs text-muted mb-8" style={{ fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>Details</div>
                <div className="flex flex-col gap-8 text-sm">
                  <div><span className="text-muted">Project: </span>{projects.find(p => p.id === detailTask.projectId)?.name || "—"}</div>
                  <div><span className="text-muted">Assignee: </span>{users.find(u => u.id === detailTask.assignedTo)?.name || "Unassigned"}</div>
                  <div><span className="text-muted">Deadline: </span>{fmtDate(detailTask.deadline)}</div>
                  <div><span className="text-muted">Created: </span>{fmtDate(detailTask.createdAt)}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="section-title mb-12" style={{ fontSize: 14 }}>Comments ({detailTask.comments.length})</div>
              {detailTask.comments.map(c => {
                const u = users.find(x => x.id === c.userId);
                return (
                  <div key={c.id} className="comment">
                    <div className="comment-header">
                      <div className="avatar" style={{ width: 22, height: 22, fontSize: 9 }}>{u?.avatar || "?"}</div>
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>{u?.name || "Unknown"}</span>
                      <span className="text-xs text-muted">{new Date(c.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div style={{ fontSize: 13, marginLeft: 30 }}>{c.text}</div>
                  </div>
                );
              })}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input className="input" style={{ flex: 1 }} placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()} />
                <button className="btn btn-primary" onClick={addComment}>Send</button>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-8 justify-end" style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                <button className="btn btn-secondary" onClick={() => { openEdit(detailTask); setDetail(null); }}>Edit Task</button>
                <button className="btn btn-danger" onClick={() => del(detailTask.id)}>Delete Task</button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── Team (Admin only) – with member progress view matching screenshot ──
const Team = ({ store }) => {
  const { users, setUsers, tasks, projects, currentUser, addNotif, addLog } = store;
  const [sel, setSel] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);

  const changeRole = (id, role) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, role } : u));
    addNotif("Role updated", "success"); addLog(currentUser.id, `Changed role to ${role}`);
  };
  const doRemove = id => {
    const u = users.find(x => x.id === id);
    setUsers(us => us.filter(x => x.id !== id));
    addNotif(`${u?.name} removed from team`, "info"); addLog(currentUser.id, `Removed member ${u?.name}`);
    setConfirmRemove(null);
  };

  const members = users.filter(u => u.role === "Member");
  const admins = users.filter(u => u.role === "Admin");

  return (
    <div>
      <div className="section-header mb-8">
        <div>
          <div className="section-title" style={{ fontSize: 20 }}>Team Members</div>
          <div className="text-sm text-muted">{users.length} total · {admins.length} admin{admins.length !== 1 ? "s" : ""} · {members.length} member{members.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid-4 mb-24">
        {[
          { label: "Total Members", value: users.length, color: "var(--accent)" },
          { label: "Admins", value: admins.length, color: "#818cf8" },
          { label: "Members", value: members.length, color: "#a78bfa" },
          { label: "Active Tasks", value: tasks.filter(t => t.status !== "Completed").length, color: "var(--warning)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color, borderRadius: "12px 12px 0 0" }} />
            <div className="stat-value" style={{ color: s.color, fontSize: 24 }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Member progress cards – styled like screenshot */}
      <div className="flex flex-col gap-16">
        {users.map(u => {
          const uTasks = tasks.filter(t => t.assignedTo === u.id);
          const done = uTasks.filter(t => t.status === "Completed").length;
          const pct = uTasks.length ? Math.round((done / uTasks.length) * 100) : 0;
          const isMe = u.id === currentUser.id;
          return (
            <div key={u.id} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 24px" }}>
              {/* Header row */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-14">
                  <div className="avatar lg" style={{ background: u.role === "Admin" ? "linear-gradient(135deg,#5c7cfa,#7c3aed)" : "linear-gradient(135deg,#7c3aed,#06b6d4)", width: 52, height: 52, fontSize: 17 }}>{u.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{u.name} {isMe && <span style={{ fontSize: 11, background: "var(--surface3)", padding: "1px 8px", borderRadius: 99, color: "var(--text3)", fontWeight: 500 }}>You</span>}</div>
                    <div className="text-sm text-muted">{uTasks.length} task{uTasks.length !== 1 ? "s" : ""} assigned</div>
                    <span className={`role-badge ${u.role}`} style={{ marginTop: 4, display: "inline-block" }}>{u.role}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: pct === 100 ? "var(--success)" : pct > 0 ? "var(--accent)" : "var(--text3)" }}>{pct}%</div>
                  <div className="text-xs text-muted">{done}/{uTasks.length} done</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress-bar mb-14" style={{ height: 8 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "var(--success)" : "linear-gradient(90deg,var(--accent),var(--accent2))", borderRadius: 99, transition: "width 0.5s" }} />
              </div>

              {/* Task rows */}
              {uTasks.length > 0 ? (
                <div className="flex flex-col gap-6 mb-14">
                  {uTasks.map(t => (
                    <div key={t.id} className="task-row-member">
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.status === "Completed" ? "var(--success)" : t.status === "In Progress" ? "var(--accent)" : "var(--text3)", flexShrink: 0 }} />
                      <div style={{ flex: 1, fontWeight: 500, fontSize: 13.5, textDecoration: t.status === "Completed" ? "line-through" : "none", opacity: t.status === "Completed" ? 0.55 : 1 }}>{t.title}</div>
                      <PriorityTag p={t.priority} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted mb-14">No tasks assigned yet</div>
              )}

              {/* Admin controls */}
              {!isMe && (
                <div className="flex items-center gap-8" style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                  <div className="text-xs text-muted" style={{ marginRight: 4 }}>Role:</div>
                  <select className="input" style={{ flex: 1, maxWidth: 160, padding: "5px 10px", fontSize: 12 }} value={u.role} onChange={e => changeRole(u.id, e.target.value)}>
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <button className="btn btn-xs btn-secondary" onClick={() => setSel(u)}>View Profile</button>
                  <button className="btn btn-xs btn-danger" onClick={() => setConfirmRemove(u)}>Remove</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Profile modal */}
      {sel && (
        <Modal title="Member Profile" onClose={() => setSel(null)}>
          <div className="flex flex-col items-center gap-16" style={{ textAlign: "center" }}>
            <div className="avatar xl" style={{ background: sel.role === "Admin" ? "linear-gradient(135deg,#5c7cfa,#7c3aed)" : "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>{sel.avatar}</div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20 }}>{sel.name}</div>
              <div className="text-muted mt-4">{sel.email}</div>
              <span className={`role-badge ${sel.role}`} style={{ marginTop: 8, display: "inline-block" }}>{sel.role}</span>
            </div>
            {sel.bio && <div className="text-sm text-muted">{sel.bio}</div>}
            <div className="grid-3" style={{ width: "100%" }}>
              {[
                { label: "Total Tasks", value: tasks.filter(t => t.assignedTo === sel.id).length },
                { label: "Completed", value: tasks.filter(t => t.assignedTo === sel.id && t.status === "Completed").length },
                { label: "Projects", value: projects.filter(p => p.members.includes(sel.id)).length },
              ].map(s => (
                <div key={s.label} style={{ background: "var(--surface2)", borderRadius: 8, padding: "12px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22 }}>{s.value}</div>
                  <div className="text-xs text-muted">{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text3)" }}>Joined {fmtDate(sel.joined)}</div>
          </div>
        </Modal>
      )}

      {/* Confirm remove modal */}
      {confirmRemove && (
        <Modal title="Remove Member" onClose={() => setConfirmRemove(null)}>
          <div className="text-center flex flex-col gap-16">
            <div style={{ fontSize: 40 }}>⚠️</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Remove {confirmRemove.name}?</div>
              <div className="text-muted text-sm">This will remove them from the team. Their tasks will remain.</div>
            </div>
            <div className="flex gap-8 justify-end">
              <button className="btn btn-secondary" onClick={() => setConfirmRemove(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => doRemove(confirmRemove.id)}>Yes, Remove</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── Reports ──
const Reports = ({ store }) => {
  const { tasks, projects, users, logs } = store;
  const statuses = ["To Do","In Progress","Completed"];
  const priorities = ["Low","Medium","High","Critical"];
  return (
    <div>
      <div className="section-header mb-24"><div className="section-title" style={{ fontSize: 20 }}>Reports & Activity</div></div>
      <div className="grid-2 mb-24">
        <div className="card">
          <div className="section-title mb-16">Task Status Breakdown</div>
          {statuses.map(s => {
            const count = tasks.filter(t => t.status === s).length;
            const pct = tasks.length ? Math.round((count / tasks.length) * 100) : 0;
            return (
              <div key={s} className="mb-12">
                <div className="flex items-center justify-between mb-4 text-sm"><span>{s}</span><span style={{ color: STATUS_COLOR[s] }}>{count} ({pct}%)</span></div>
                <div className="progress-bar"><div style={{ height: "100%", width: `${pct}%`, background: STATUS_COLOR[s], borderRadius: 99, transition: "width 0.5s" }} /></div>
              </div>
            );
          })}
        </div>
        <div className="card">
          <div className="section-title mb-16">Priority Distribution</div>
          {priorities.map(p => {
            const count = tasks.filter(t => t.priority === p).length;
            const pct = tasks.length ? Math.round((count / tasks.length) * 100) : 0;
            return (
              <div key={p} className="mb-12">
                <div className="flex items-center justify-between mb-4 text-sm"><span>{p}</span><span style={{ color: PRIORITY_COLOR[p] }}>{count} ({pct}%)</span></div>
                <div className="progress-bar"><div style={{ height: "100%", width: `${pct}%`, background: PRIORITY_COLOR[p], borderRadius: 99, transition: "width 0.5s" }} /></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card mb-24">
        <div className="section-title mb-16">Team Performance</div>
        <table className="table">
          <thead><tr><th>Member</th><th>Role</th><th>Assigned</th><th>Completed</th><th>In Progress</th><th>Overdue</th><th>Rate</th></tr></thead>
          <tbody>
            {users.map(u => {
              const ut = tasks.filter(t => t.assignedTo === u.id);
              const done = ut.filter(t => t.status === "Completed").length;
              const inp = ut.filter(t => t.status === "In Progress").length;
              const over = ut.filter(t => isOverdue(t.deadline, t.status)).length;
              const rate = ut.length ? Math.round((done / ut.length) * 100) : 0;
              return (
                <tr key={u.id}>
                  <td><div className="flex items-center gap-8"><div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{u.avatar}</div>{u.name}</div></td>
                  <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                  <td>{ut.length}</td>
                  <td style={{ color: "var(--success)" }}>{done}</td>
                  <td style={{ color: "var(--warning)" }}>{inp}</td>
                  <td style={{ color: over > 0 ? "var(--danger)" : "var(--text3)" }}>{over}</td>
                  <td><div className="flex items-center gap-8"><div className="progress-bar" style={{ flex: 1 }}><div className="progress-fill" style={{ width: `${rate}%` }} /></div><span className="text-xs">{rate}%</span></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="card">
        <div className="section-title mb-16">Activity Log</div>
        {logs.slice(0, 20).map(l => {
          const u = users.find(x => x.id === l.userId);
          return (
            <div key={l.id} className="flex items-center gap-12" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div className="avatar" style={{ width: 26, height: 26, fontSize: 9 }}>{u?.avatar || "?"}</div>
              <div style={{ flex: 1 }}><span style={{ fontWeight: 500, fontSize: 13 }}>{u?.name || "Unknown"}</span><span className="text-muted text-sm"> {l.action}</span></div>
              <span className="text-xs text-muted">{new Date(l.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Profile ──
const Profile = ({ store }) => {
  const { currentUser, setUsers, users, tasks, projects, addNotif, addLog } = store;
  const [form, setForm] = useState({ name: currentUser.name, bio: currentUser.bio || "", email: currentUser.email });
  const [pwd, setPwd] = useState({ old: "", new1: "", new2: "" });
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const updP = k => e => setPwd(p => ({ ...p, [k]: e.target.value }));
  const saveProfile = () => {
    if (!form.name.trim()) return addNotif("Name required", "error");
    setUsers(us => us.map(u => u.id === currentUser.id ? { ...u, ...form } : u));
    Object.assign(currentUser, form);
    addNotif("Profile updated!", "success"); addLog(currentUser.id, "Updated profile");
  };
  const changePassword = () => {
    if (pwd.old !== currentUser.password) return addNotif("Incorrect current password", "error");
    if (!pwd.new1 || pwd.new1.length < 6) return addNotif("Password must be 6+ chars", "error");
    if (pwd.new1 !== pwd.new2) return addNotif("Passwords don't match", "error");
    setUsers(us => us.map(u => u.id === currentUser.id ? { ...u, password: pwd.new1 } : u));
    currentUser.password = pwd.new1; setPwd({ old: "", new1: "", new2: "" });
    addNotif("Password changed!", "success");
  };
  const myTasks = tasks.filter(t => t.assignedTo === currentUser.id);
  const done = myTasks.filter(t => t.status === "Completed").length;
  const isAdmin = currentUser.role === "Admin";
  return (
    <div>
      <div className="section-title mb-24" style={{ fontSize: 20 }}>Profile</div>
      <div className="grid-2 gap-16">
        <div className="flex flex-col gap-16">
          <div className="card">
            <div className="flex items-center gap-16 mb-20">
              <div className="avatar xl" style={{ background: isAdmin ? "linear-gradient(135deg,#5c7cfa,#7c3aed)" : "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>{currentUser.avatar}</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20 }}>{currentUser.name}</div>
                <span className={`role-badge ${currentUser.role}`}>{currentUser.role}</span>
                <div className="text-sm text-muted mt-4">{currentUser.email}</div>
              </div>
            </div>
            <div className="grid-3" style={{ gap: 8 }}>
              {[{ label: "Tasks", value: myTasks.length }, { label: "Done", value: done }, { label: "Projects", value: projects.filter(p => p.members.includes(currentUser.id)).length }].map(s => (
                <div key={s.label} style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20 }}>{s.value}</div>
                  <div className="text-xs text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="section-title mb-16">Edit Profile</div>
            <div className="flex flex-col gap-12">
              <div className="form-group"><label className="label">Full Name</label><input className="input" value={form.name} onChange={upd("name")} /></div>
              <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={upd("email")} /></div>
              <div className="form-group"><label className="label">Bio</label><textarea className="input" placeholder="Tell us about yourself..." value={form.bio} onChange={upd("bio")} style={{ minHeight: 60 }} /></div>
              <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={saveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="section-title mb-16">Change Password</div>
          <div className="flex flex-col gap-12">
            <div className="form-group"><label className="label">Current Password</label><input className="input" type="password" placeholder="••••••••" value={pwd.old} onChange={updP("old")} /></div>
            <div className="form-group"><label className="label">New Password</label><input className="input" type="password" placeholder="••••••••" value={pwd.new1} onChange={updP("new1")} /></div>
            <div className="form-group"><label className="label">Confirm New Password</label><input className="input" type="password" placeholder="••••••••" value={pwd.new2} onChange={updP("new2")} /></div>
            <button className="btn btn-secondary" style={{ alignSelf: "flex-start" }} onClick={changePassword}>Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main App ──
export default function App() {
  const store = useStore();
  const { currentUser, setCurrentUser, notifications, addLog } = store;
  const [page, setPage] = useState("dashboard");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const logout = () => { addLog(currentUser.id, "Logged out"); setCurrentUser(null); setPage("dashboard"); };

  if (!currentUser) return (
    <>
      <NotifContainer notifications={notifications} />
      <AuthScreen {...store} />
    </>
  );

  const isAdmin = currentUser.role === "Admin";
  const overdueTasks = store.tasks.filter(t => isOverdue(t.deadline, t.status) && (isAdmin || t.assignedTo === currentUser.id));

  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "projects", icon: "📁", label: "Projects" },
    { id: "tasks", icon: "✅", label: "Tasks", badge: overdueTasks.length || null },
    ...(isAdmin ? [{ id: "team", icon: "👥", label: "Team" }] : []),
    ...(isAdmin ? [{ id: "reports", icon: "📊", label: "Reports & Logs" }] : []),
    { id: "profile", icon: "👤", label: "My Profile" },
  ];

  const pageTitle = { dashboard: "Dashboard", projects: "Projects", tasks: "Tasks", team: "Team", reports: "Reports", profile: "Profile" };

  return (
    <div className="app">
      <NotifContainer notifications={notifications} />
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">⚡</div>
          <div className="logo-text">TaskFlow</div>
        </div>
        <div className="sidebar-section">Navigation</div>
        {navItems.map(n => (
          <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
            <span className="nav-icon">{n.icon}</span>{n.label}
            {n.badge ? <span className="badge">{n.badge}</span> : null}
          </div>
        ))}
        <div className="sidebar-footer">
          <div className="user-card" onClick={() => setPage("profile")}>
            <div className="avatar" style={{ background: isAdmin ? "linear-gradient(135deg,#5c7cfa,#7c3aed)" : "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>{currentUser.avatar}</div>
            <div className="user-info">
              <div className="user-name">{currentUser.name}</div>
              <div className="user-role">{currentUser.role}</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ width: "100%", marginTop: 8, justifyContent: "center" }} onClick={logout}>Sign Out</button>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <div className="topbar-title">{pageTitle[page]}</div>
          <div className="topbar-right">
            {overdueTasks.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "5px 12px", fontSize: 12.5, color: "var(--danger)" }}>
                ⚠ {overdueTasks.length} overdue
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text2)" }}>
              <div className="avatar" style={{ width: 28, height: 28, fontSize: 10, background: isAdmin ? "linear-gradient(135deg,#5c7cfa,#7c3aed)" : "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>{currentUser.avatar}</div>
              {currentUser.name}
              <span className={`role-badge ${currentUser.role}`}>{currentUser.role}</span>
            </div>
            {/* Fullscreen button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 9px", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
              onMouseOver={e => { e.currentTarget.style.background = "var(--surface3)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--text2)"; }}
            >
              <FullscreenIcon />
            </button>
          </div>
        </div>
        <div className="content">
          {page === "dashboard" && <Dashboard store={store} />}
          {page === "projects" && <Projects store={store} />}
          {page === "tasks" && <Tasks store={store} />}
          {page === "team" && isAdmin && <Team store={store} />}
          {page === "reports" && isAdmin && <Reports store={store} />}
          {page === "profile" && <Profile store={store} />}
        </div>
      </div>
    </div>
  );
}
