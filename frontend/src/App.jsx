import { useState } from "react";
import {
BrowserRouter as Router,
Routes,
Route,
Link,
useLocation
} from "react-router-dom";

import Upload from "./components/Upload";
import QA from "./components/QA";
import Summary from "./components/Summary";
import Planner from "./components/Planner";
import LecturePlanner from "./components/LecturePlanner";
import LabPlanner from "./components/LabPlanner";
import Podcast from "./components/Podcast";


/* ================= GLOBAL CSS ================= */

const G = `

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

*{
box-sizing:border-box;
margin:0;
padding:0;
}

body{
font-family:'Plus Jakarta Sans',sans-serif;
background:#0d0d18;
}


/* ================= LAYOUT ================= */

.app-shell{
display:flex;
height:100vh;
overflow:hidden;
}


/* ================= SIDEBAR ================= */

.sidebar{

width:230px;
min-width:230px;

background:linear-gradient(170deg,#12122a,#0d0d1e);

border-right:1px solid rgba(255,255,255,.06);

padding:18px 14px;

display:flex;
flex-direction:column;

transition:.35s ease;

position:relative;
}

.sidebar.closed{

width:70px;
min-width:70px;

padding:18px 10px;

align-items:center;
}


/* logo */

.logo-wrap{

display:flex;
align-items:center;
gap:10px;

background:rgba(255,255,255,.05);

padding:8px 10px;

border-radius:12px;

margin-bottom:22px;
}

.logo-icon{

width:28px;
height:28px;

border-radius:8px;

background:linear-gradient(135deg,#6d5aff,#a78bfa);

display:flex;
align-items:center;
justify-content:center;
}

.logo-text{

font-weight:800;

background:linear-gradient(90deg,#a78bfa,#7dd3fc);

-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
}


/* toggle button */

.toggle-btn{

position:absolute;

top:22px;
right:-12px;

width:26px;
height:26px;

border-radius:50%;

border:2px solid #0d0d18;

background:#6d5aff;

color:white;

cursor:pointer;

display:flex;
align-items:center;
justify-content:center;

font-size:14px;

transition:.25s ease;

box-shadow:0 4px 12px rgba(109,90,255,.35);
}

.toggle-btn:hover{

background:#8b77ff;

transform:scale(1.1);
}


/* section label */

.sec-label{

font-size:10px;

color:rgba(255,255,255,.28);

margin:16px 0 8px;
}


/* nav item */

.nav-item{

display:flex;

align-items:center;

gap:12px;

padding:10px 12px;

border-radius:10px;

font-size:14px;

color:rgba(255,255,255,.55);

text-decoration:none;

transition:.2s ease;
}

.nav-item:hover{

background:rgba(255,255,255,.08);

color:white;
}

.nav-item.active{

background:linear-gradient(
90deg,
rgba(109,90,255,.35),
rgba(109,90,255,.15)
);

color:#c4b5fd;
}


/* ================= MAIN AREA ================= */

.main-area{

flex:1;

background:#f4f3ff;

overflow-y:auto;
}


/* ================= TOPBAR ================= */

.topbar{

display:flex;

gap:14px;

padding:16px 24px;

background:white;

border-bottom:1px solid #ede9fe;
}

.topbar-badge{

width:34px;
height:34px;

background:linear-gradient(135deg,#6d5aff,#a78bfa);

border-radius:10px;

display:flex;
align-items:center;
justify-content:center;
}

.topbar h1{

font-size:16px;

color:#1e1b4b;
}

.topbar p{

font-size:12px;

color:#7c3aed;
}


/* ================= CONTENT ================= */

.page-content{

padding:24px;

display:flex;

flex-direction:column;

gap:18px;
}


/* ================= CARD ================= */

.card{

background:white;

border-radius:16px;

padding:22px;

border:1px solid #ede9fe;

color:#1e1b4b;
}

.card-header{

display:flex;

gap:10px;

margin-bottom:14px;
}

.card-icon{

width:32px;
height:32px;

border-radius:9px;

display:flex;
align-items:center;
justify-content:center;
}

.card-icon.purple{background:#ede9fe;}
.card-icon.blue{background:#dbeafe;}
.card-icon.green{background:#dcfce7;}

.card-title{

font-weight:700;
color:#1e1b4b;
}

.card-sub{

font-size:12px;

color:#8b5cf6;
}


/* ================= INPUT ================= */

.card input,
.card textarea{

width:100%;

padding:10px 12px;

border-radius:10px;

border:1px solid #ddd6fe;

background:#fafaff;

color:#1e1b4b;
}

.card input::placeholder{

color:#a78bfa;
}


/* ================= BUTTON ================= */

.card button{

background:linear-gradient(135deg,#6d5aff,#8b77ff);

border:none;

padding:10px 16px;

border-radius:10px;

color:white;

font-weight:600;

cursor:pointer;

transition:.2s ease;
}

.card button:hover{

transform:translateY(-1px);

box-shadow:0 6px 14px rgba(109,90,255,.25);
}

`;


/* ================= NAV ITEM ================= */

function NavItem({ to, icon, label, collapsed }){

const location=useLocation();

const active=location.pathname===to;

return(

<Link
to={to}
className={`nav-item ${active?"active":""}`}
title={collapsed?label:""}
>

<span>{icon}</span>

{!collapsed&&label}

</Link>

);

}


/* ================= SIDEBAR ================= */

function Sidebar({collapsed,onToggle}){

return(

<div className={`sidebar ${collapsed?"closed":""}`}>

<div className="logo-wrap">

<div className="logo-icon">⚡</div>

{!collapsed&&<div className="logo-text">StudyAI</div>}

</div>

<button className="toggle-btn" onClick={onToggle}>

{collapsed?"›":"‹"}

</button>

{/* STUDENT TOOLS */}

<span className="sec-label">
{!collapsed && "Student Tools"}
</span>

<NavItem
to="/"
icon="📄"
label="Summary + QA"
collapsed={collapsed}
/>

<NavItem
to="/planner"
icon="📅"
label="Student Planner"
collapsed={collapsed}
/>
<NavItem
to="/podcast"
icon="🎧"
label="Document Podcast"
collapsed={collapsed}
/>

{/* TEACHER TOOLS */}

<span className="sec-label">
{!collapsed && "Teacher Tools"}
</span>

<NavItem
to="/lecture-planner"
icon="🧑‍🏫"
label="Lecture Planner"
collapsed={collapsed}
/>

<NavItem
to="/lab-planner"
icon="🧪"
label="Lab Planner"
collapsed={collapsed}
/>

</div>

);

}


/* ================= PAGE SHELL ================= */

function PageShell({badge,title,subtitle,children}){

return(

<div className="main-area">

<div className="topbar">

<div className="topbar-badge">{badge}</div>

<div>

<h1>{title}</h1>

<p>{subtitle}</p>

</div>

</div>

<div className="page-content">

{children}

</div>

</div>

);

}


/* ================= CARD WRAP ================= */

function CardWrap({icon,color,title,sub,children}){

return(

<div className="card">

<div className="card-header">

<div className={`card-icon ${color}`}>

{icon}

</div>

<div>

<div className="card-title">{title}</div>

<div className="card-sub">{sub}</div>

</div>

</div>

{children}

</div>

);

}


/* ================= DOCUMENT PAGE ================= */

function DocumentAssistantPage(){

const [activeTab,setActiveTab]=useState("summary");

return(

<PageShell
badge="📄"
title="Document Assistant"
subtitle="Upload · Analyze · Summarize"
>

<CardWrap
icon="📁"
color="purple"
title="Upload Document"
sub="PDF, DOCX, TXT supported"
>
<Upload/>
</CardWrap>


{/* TAB SWITCHER */}

<div style={{
display:"flex",
gap:"10px",
marginBottom:"10px"
}}>

<button
onClick={()=>setActiveTab("summary")}
style={{
padding:"10px 18px",
borderRadius:"10px",
border:"none",
cursor:"pointer",
fontWeight:"600",
background:
activeTab==="summary"
? "linear-gradient(135deg,#6d5aff,#8b77ff)"
: "#e9e8ff",
color:
activeTab==="summary"
? "white"
: "#4c46a6"
}}
>
Summary
</button>

<button
onClick={()=>setActiveTab("qa")}
style={{
padding:"10px 18px",
borderRadius:"10px",
border:"none",
cursor:"pointer",
fontWeight:"600",
background:
activeTab==="qa"
? "linear-gradient(135deg,#6d5aff,#8b77ff)"
: "#e9e8ff",
color:
activeTab==="qa"
? "white"
: "#4c46a6"
}}
>
Q&A
</button>

</div>


{/* TAB CONTENT */}

{activeTab==="qa" && (

<CardWrap
icon="💬"
color="blue"
title="Ask Anything"
sub="Ask questions about your document"
>
<QA/>
</CardWrap>

)}


{activeTab==="summary" && (

<CardWrap
icon="✨"
color="green"
title="Generate Summary"
sub="AI-powered key insights extraction"
>
<Summary/>
</CardWrap>

)}

</PageShell>

);
}


/* ================= MAIN APP ================= */

export default function App(){

const[collapsed,setCollapsed]=useState(false);

return(

<>

<style>{G}</style>

<Router>

<div className="app-shell">

<Sidebar
collapsed={collapsed}
onToggle={()=>setCollapsed(!collapsed)}
/>

<Routes>

<Route
path="/"
element={<DocumentAssistantPage/>}
/>

<Route
path="/planner"
element={

<PageShell
badge="📅"
title="Study Planner"
subtitle="Plan · Schedule · Track"
>

<div className="card">

<Planner/>

</div>

</PageShell>

}
/>

<Route
path="/lecture-planner"
element={
<PageShell
badge="🧑‍🏫"
title="Lecture Planner"
subtitle="Generate date-wise lecture schedule"
>

<div className="card">
<LecturePlanner/>
</div>

</PageShell>
}
/>

<Route
path="/lab-planner"
element={
<PageShell
badge="🧪"
title="Lab Planner"
subtitle="Generate week-wise lab schedule"
>


<div className="card">
<LabPlanner/>
</div>

</PageShell>
}
/>

<Route
path="/podcast"
element={
<PageShell
badge="🎧"
title="Document Podcast"
subtitle="Listen to your PDF as AI conversation"
>

<div className="card">

<Podcast/>

</div>

</PageShell>
}
/>

</Routes>

</div>

</Router>

</>

);

}