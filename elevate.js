function scrollToId(id){document.getElementById(id).scrollIntoView({behavior:"smooth"})}
document.getElementById("footYear").textContent=new Date().getFullYear();
var rolePasswords={Student:"student123",Industry:"industry123",Academia:"academia123"};
var loggedRole=null;
function showLogin(){document.getElementById("loginModal").classList.add("show")}
function hideLogin(){document.getElementById("loginModal").classList.remove("show")}
function closeLogin(e){if(e.target.id==="loginModal")hideLogin()}
var pendingRole="Student";
function openRoleLogin(role){pendingRole=role||"Student";document.getElementById("roleLoginTitle").textContent=pendingRole+" Login";document.getElementById("roleLoginSub").textContent="Enter your "+pendingRole.toLowerCase()+" password to view the dashboard.";document.getElementById("roleLoginNameLabel").firstChild.textContent=(pendingRole==="Academia"?"University / Your name":pendingRole==="Industry"?"Company / Your name":"Your name")+" ";document.getElementById("roleLoginName").placeholder=pendingRole==="Academia"?"e.g. Mumbai University":"Enter name";document.getElementById("roleLoginName").value="";document.getElementById("roleLoginPass").value="";document.getElementById("roleLoginError").textContent="";document.getElementById("roleLoginModal").classList.add("show");setTimeout(function(){document.getElementById("roleLoginPass").focus();},50);}
function hideRoleLogin(){document.getElementById("roleLoginModal").classList.remove("show")}
function submitRoleLogin(){
  var name=document.getElementById("roleLoginName").value.trim();
  var pass=document.getElementById("roleLoginPass").value;
  var err=document.getElementById("roleLoginError");
  if(!name){err.textContent="Please enter name.";return;}
  if(!pass){err.textContent="Please enter password.";return;}
  // TEMP: accept any password — real authentication to be added later
  hideRoleLogin();hideLogin();hideAcademiaLogin();
  loggedRole=pendingRole;
  if(pendingRole==="Academia"){
    document.getElementById("academiaUniName").textContent=name;
    document.getElementById("academiaWelcomeSub").textContent="University portal - "+name;
    document.getElementById("academiaAvatar").textContent=name.substring(0,2).toUpperCase();
  }
  openDashboard(pendingRole,name);
}
function loginAs(role){hideLogin();openRoleLogin(role)}
function goToDashboard(e){if(e)e.preventDefault();if(loggedRole){scrollToId("dashboard");return;}openRoleLogin("Student");scrollToId("dashboard");}
function lockDashboard(){loggedRole=null;document.getElementById("dashLock").style.display="block";document.getElementById("genericDashboard").style.display="none";document.getElementById("studentDashboard").style.display="none";document.getElementById("academiaDashboard").style.display="none";document.getElementById("dash-title").textContent="Login to view dashboard";}
function genericLogout(){lockDashboard();scrollToId("roles");}
function openDashboard(role,name){
  if(role!=="Academia"&&role!=="Student"&&role!=="Industry")return;
  if(loggedRole!==role)return;
  document.getElementById("dashLock").style.display="none";
  if(role==="Academia"){
    document.getElementById("dash-title").textContent="Academia Dashboard";
    document.getElementById("genericDashboard").style.display="none";
    document.getElementById("studentDashboard").style.display="none";
    document.getElementById("academiaDashboard").style.display="block";
    renderAcademiaTable();
    scrollToId("dashboard");
    return;
  }
  if(role==="Student"){
    document.getElementById("dash-title").textContent="Student Dashboard";
    document.getElementById("genericDashboard").style.display="none";
    document.getElementById("academiaDashboard").style.display="none";
    document.getElementById("studentDashboard").style.display="block";
    initStudentDashboard(name);
    scrollToId("dashboard");
    return;
  }
  document.getElementById("genericDashboard").style.display="grid";
  document.getElementById("studentDashboard").style.display="none";
  document.getElementById("academiaDashboard").style.display="none";
  document.getElementById("dash-title").textContent=role+" Dashboard";
  document.getElementById("welcome-role").textContent=(name?role+" - "+name:role);
  document.getElementById("score").textContent=role==="Industry"?"91%":role==="Academia"?"82%":"87%";
  scrollToId("dashboard");
}
function apply(btn){
  btn.textContent="Applied ✓";
  btn.disabled=true;
  btn.style.background="#eef8f2";
  btn.style.color="#238354";
  btn.style.borderColor="#8cc8a9";
}
function filterJobs(){
  const value=document.getElementById("filter").value;
  document.querySelectorAll(".job").forEach(job=>{
    job.style.display=(value==="all"||job.dataset.type===value)?"grid":"none";
  });
}
var academiaCourses=["B.Tech","BCA","B.Sc","B.Com","BA","BBA","MBA","B.Ed"];
var academiaSessions=[];
for(var sessionStart=2020;sessionStart<=2030;sessionStart++){academiaSessions.push(sessionStart+"-"+(sessionStart+1));}
var academiaRecords=[
{name:"Aarav Sharma",id:"BTECH-001",course:"B.Tech",session:"2025-2026",scores:{"Data Structures":86,"Operating Systems":78,"DBMS":91}},
{name:"Diya Patel",id:"BTECH-002",course:"B.Tech",session:"2025-2026",scores:{"Data Structures":92,"Operating Systems":88,"DBMS":84}},
{name:"Rohan Verma",id:"BBA-101",course:"BBA",session:"2025-2026",scores:{"Marketing":76,"Accounting":81,"Business Law":69}},
{name:"Sneha Iyer",id:"BBA-102",course:"BBA",session:"2025-2026",scores:{"Marketing":89,"Accounting":93,"Business Law":87}},
{name:"Kabir Singh",id:"BSC-011",course:"B.Sc",session:"2025-2026",scores:{"Physics":95,"Chemistry":82,"Maths":77}},
{name:"Ananya Rao",id:"BSC-012",course:"B.Sc",session:"2025-2026",scores:{"Physics":68,"Chemistry":74,"Maths":71}},
{name:"Imran Khan",id:"BCA-021",course:"BCA",session:"2025-2026",scores:{"C Programming":88,"Web Tech":81,"DBMS":79}},
{name:"Pooja Nair",id:"BCOM-031",course:"B.Com",session:"2025-2026",scores:{"Accounting":84,"Economics":77,"Business Law":80}}];
var academiaSheets=3;
function showAcademiaView(view){
var isMarksheets=view==="marksheets";
document.getElementById("acMarksheetsView").hidden=!isMarksheets;
document.getElementById("acCoursesView").hidden=isMarksheets;
document.getElementById("acCourseRoster").hidden=true;
document.getElementById("acCourseCards").hidden=false;
document.getElementById("acCoursesHeading").hidden=false;
document.querySelectorAll(".ac-side-row [data-ac-view]").forEach(function(button){button.classList.toggle("active",button.dataset.acView===view);});
if(!isMarksheets){
document.getElementById("acCatalogTitle").textContent=view==="students"?"Students by course":"Courses";
renderAcademiaCourses();
}
}
function renderAcademiaCourses(){
var from=document.getElementById("acSessionFrom");
var to=document.getElementById("acSessionTo");
function setSessionOptions(select,selected){
select.innerHTML=academiaSessions.map(function(session){return '<option value="'+session+'"'+(session===selected?' selected':'')+'>'+session+'</option>';}).join("");
}
var fromValue=from.value||"2025-2026";
var toValue=to.value||"2025-2026";
setSessionOptions(from,fromValue);
setSessionOptions(to,toValue);
if(academiaSessions.indexOf(from.value)>academiaSessions.indexOf(to.value))to.value=from.value;
var start=academiaSessions.indexOf(from.value);
var end=academiaSessions.indexOf(to.value);
document.getElementById("acCourseCards").innerHTML=academiaCourses.map(function(course){
var count=academiaRecords.filter(function(record){var sessionIndex=academiaSessions.indexOf(record.session||"2025-2026");return record.course===course&&sessionIndex>=start&&sessionIndex<=end;}).length;
return '<button type="button" class="ac-course-card" onclick="openAcademiaRoster(\''+course+'\')"><span class="ac-course-mark">'+course.replace(/[^A-Z]/g,"").slice(0,2)+'</span><span class="ac-course-details"><span class="ac-course-name">'+course+'</span><span class="ac-course-description">'+count+' '+(count===1?'student':'students')+' in selected session</span></span><span class="ac-course-count">'+count+'</span></button>';
}).join("");
}
function openAcademiaRoster(course){
var from=document.getElementById("acSessionFrom").value;
var to=document.getElementById("acSessionTo").value;
var start=academiaSessions.indexOf(from);
var end=academiaSessions.indexOf(to);
var students=[];
academiaRecords.forEach(function(record){
var session=record.session||"2025-2026";
var sessionIndex=academiaSessions.indexOf(session);
if(record.course!==course||sessionIndex<start||sessionIndex>end)return;
var student=students.filter(function(item){return item.id===record.id;})[0];
if(!student){student={name:record.name,id:record.id,sessions:{},semesters:{}};students.push(student);}
student.sessions[session]=true;
var semester=Number(record.sem);
if(semester>=1&&semester<=8)student.semesters[semester]=true;
});
students.sort(function(a,b){return a.name.localeCompare(b.name);});
document.getElementById("acCatalogTitle").textContent="Students by course";
document.getElementById("acCourseCards").hidden=true;
document.getElementById("acCoursesHeading").hidden=true;
document.getElementById("acCourseRoster").hidden=false;
document.getElementById("acRosterTitle").textContent=course+" students";
document.getElementById("acRosterSessionLabel").textContent=from===to?"SESSION "+from:"SESSIONS "+from+" TO "+to;
var body=document.getElementById("acRosterRows");
body.textContent="";
if(!students.length){
var emptyRow=document.createElement("tr");
emptyRow.className="empty-row";
var emptyCell=document.createElement("td");
emptyCell.colSpan=5;
emptyCell.textContent="No students found for "+course+" in this session range.";
emptyRow.appendChild(emptyCell);
body.appendChild(emptyRow);
return;
}
students.forEach(function(student){
var semesters=Object.keys(student.semesters).map(Number).sort(function(a,b){return a-b;});
var sessions=Object.keys(student.sessions).sort(function(a,b){return academiaSessions.indexOf(a)-academiaSessions.indexOf(b);});
var semesterLabel=semesters.length?semesters.map(function(number){return "Sem "+number;}).join(", "):"No semester records";
var currentSemester=semesters.length?"Sem "+semesters[semesters.length-1]:"Not recorded";
var row=document.createElement("tr");
[student.name,student.id,sessions.join(", "),semesterLabel,currentSemester].forEach(function(value,index){
var cell=document.createElement("td");
if(index===0){var name=document.createElement("b");name.textContent=value;cell.appendChild(name);}
else cell.textContent=value;
row.appendChild(cell);
});
body.appendChild(row);
});
}
function closeAcademiaRoster(){
document.getElementById("acCourseRoster").hidden=true;
document.getElementById("acCourseCards").hidden=false;
document.getElementById("acCoursesHeading").hidden=false;
}
function openAcademiaLogin(){openRoleLogin("Academia");}
function hideAcademiaLogin(){document.getElementById("academiaLoginModal").classList.remove("show");}
function academiaLogin(){
var uni=document.getElementById("acUniName").value.trim();
var pass=document.getElementById("acUniPass").value;
var err=document.getElementById("acLoginError");
if(!uni){err.textContent="Please enter university name.";return;}
if(!pass){err.textContent="Please enter password.";return;}
// TEMP: accept any password — real authentication to be added later
hideAcademiaLogin();
loggedRole="Academia";
document.getElementById("academiaUniName").textContent=uni;
document.getElementById("academiaWelcomeSub").textContent="University portal - "+uni;
document.getElementById("academiaAvatar").textContent=uni.substring(0,2).toUpperCase();
openDashboard("Academia",uni);
}
function academiaSubjects(course){var s={};academiaRecords.forEach(function(r){if(!course||course==="All Courses"||r.course===course){Object.keys(r.scores).forEach(function(k){s[k]=1;});}});return Object.keys(s);}
function academiaLogout(){lockDashboard();scrollToId("roles");}
function gradePill(avg){if(avg>=75)return '<span class="pill pill-good">'+avg+'% Good</span>';if(avg>=60)return '<span class="pill pill-mid">'+avg+'% Average</span>';return '<span class="pill pill-low">'+avg+'% Low</span>';}
function renderAcademiaTable(){
var courseSel=document.getElementById("acCourseFilter");
var q=(document.getElementById("acSearch").value||"").toLowerCase();
var courses=["All Courses"].concat(academiaCourses);
var current=courseSel.value||"All Courses";
if(courses.indexOf(current)<0)current="All Courses";
courseSel.innerHTML=courses.map(function(c){return '<option value="'+c+'"'+(c===current?' selected':'')+'>'+c+'</option>';}).join("");
var course=courseSel.value;
var subjects=academiaSubjects(course);
if(!subjects.length)subjects=["Subject 1"];
var head=document.getElementById("acHeadRow");
head.innerHTML="<th>Student</th><th>Roll No</th><th>Course</th><th>Sem</th>"+subjects.map(function(s){return "<th>"+s+"</th>";}).join("")+"<th>Average</th><th>Status</th><th></th>";
var rows=academiaRecords.filter(function(r){var okC=(course==="All Courses"||r.course===course);var okQ=!q||r.name.toLowerCase().indexOf(q)>=0||r.id.toLowerCase().indexOf(q)>=0;return okC&&okQ;});
var body=document.getElementById("acBodyRows");
if(!rows.length){body.innerHTML='<tr class="empty-row"><td colspan="'+(6+subjects.length)+'">No students found. Upload a marksheet or add a record.</td></tr>';}
else{body.innerHTML=rows.map(function(r){
var vals=subjects.map(function(s){var v=r.scores[s];return (v===undefined||v===null)?"-":v;});
var nums=subjects.map(function(s){return Number(r.scores[s]);}).filter(function(n){return !isNaN(n);});
var avg=nums.length?Math.round(nums.reduce(function(a,b){return a+b;},0)/nums.length):0;
var idx=academiaRecords.indexOf(r);
var cells=subjects.map(function(s){var v=r.scores[s];var shown=(v===undefined?"":v);return '<td><input type="number" min="0" max="100" value="'+shown+'" onchange="editAcademiaScore('+idx+',\''+s+'\',this.value)"></td>';}).join("");
return "<tr><td><b>"+r.name+"</b></td><td>"+r.id+"</td><td>"+r.course+"</td><td>"+(r.sem||"-")+"</td>"+cells+"<td><b>"+avg+"%</b></td><td>"+gradePill(avg)+"</td><td><button class='mini-del' onclick='deleteAcademiaRow("+idx+")'>Delete</button></td></tr>";
}).join("");}
var total=rows.length;var allNums=[];rows.forEach(function(r){Object.keys(r.scores).forEach(function(k){var n=Number(r.scores[k]);if(!isNaN(n))allNums.push(n);});});
var avgAll=allNums.length?Math.round(allNums.reduce(function(a,b){return a+b;},0)/allNums.length)+"%":"-";
document.getElementById("acTotalStudents").textContent=academiaRecords.length;
document.getElementById("acTotalCourses").textContent=courses.length-1;
document.getElementById("acCourseListLabel").textContent=courses.slice(1).join(", ")||"-";
document.getElementById("acAvgScore").textContent=avgAll;
document.getElementById("acTotalSheets").textContent=academiaSheets;
}
function editAcademiaScore(idx,subject,val){var n=Number(val);if(val===""||isNaN(n)||n<0||n>100){renderAcademiaTable();return;}academiaRecords[idx].scores[subject]=n;renderAcademiaTable();}
function deleteAcademiaRow(idx){if(confirm("Delete marksheet record for "+academiaRecords[idx].name+"?")){academiaRecords.splice(idx,1);renderAcademiaTable();}}
function openAcAddForm(){
document.getElementById("acFName").value="";
document.getElementById("acFRoll").value="";
document.getElementById("acFCourse").value="";
document.getElementById("acFSem").value="";
var sessionSelect=document.getElementById("acFSession");
sessionSelect.innerHTML=academiaSessions.map(function(session){return '<option value="'+session+'">'+session+'</option>';}).join("");
sessionSelect.value="2025-2026";
document.getElementById("acFError").textContent="";
document.getElementById("acFSubjects").innerHTML="";
acAddSubjectRow();acAddSubjectRow();acAddSubjectRow();
document.getElementById("acAddModal").classList.add("show");
}
function closeAcAddForm(){document.getElementById("acAddModal").classList.remove("show");}
function acAddSubjectRow(name,marks){
var wrap=document.getElementById("acFSubjects");
var div=document.createElement("div");
div.className="sub-row";
div.innerHTML='<input type="text" placeholder="Subject name" value="'+(name||"")+'"><input type="number" min="0" max="100" placeholder="Marks"><label class="file-btn">Add file .csv<input type="file" accept=".csv" hidden></label><button class="mini-del" type="button">Remove</button>';
if(marks!==undefined&&marks!==null&&marks!=="")div.querySelector('input[type=number]').value=marks;
div.querySelector(".mini-del").onclick=function(){div.remove();};
div.querySelector('input[type=file]').onchange=function(e){acFillMarksFromCSV(e,div);};
wrap.appendChild(div);
}
function acFillMarksFromCSV(e,rowDiv){
var file=e.target.files[0];if(!file)return;
var reader=new FileReader();
reader.onload=function(){
var text=String(reader.result).trim();
if(!text)return;
var num=null;var subName=null;
var lines=text.split(/\r?\n/).filter(function(l){return l.trim();});
for(var i=lines.length-1;i>=0;i--){
var parts=lines[i].split(",").map(function(c){return c.trim();});
for(var j=parts.length-1;j>=0;j--){
var n=Number(parts[j]);
if(parts[j]!==""&&!isNaN(n)&&n>=0&&n<=100){num=n;break;}
}
if(num!==null){
var nameParts=parts.filter(function(c){return c!==""&&isNaN(Number(c));});
if(nameParts.length)subName=nameParts[nameParts.length-1];
break;
}
}
var markInput=rowDiv.querySelector('input[type=number]');
var nameInput=rowDiv.querySelector('input[type=text]');
var btn=rowDiv.querySelector('.file-btn');
if(num!==null){
markInput.value=num;
if(subName&&!nameInput.value)nameInput.value=subName;
btn.classList.add("has-file");
btn.childNodes[0].textContent=file.name+" ✓ ";
}else{alert("Could not find marks (0-100) in "+file.name);}
};
reader.readAsText(file);
}
function submitAcAddForm(){
var err=document.getElementById("acFError");
var name=document.getElementById("acFName").value.trim();
var roll=document.getElementById("acFRoll").value.trim();
var course=document.getElementById("acFCourse").value;
var sem=document.getElementById("acFSem").value;
var session=document.getElementById("acFSession").value;
if(!name){err.textContent="Please enter student name.";return;}
if(!roll){err.textContent="Please enter roll no.";return;}
if(!course){err.textContent="Please select a course.";return;}
if(!sem){err.textContent="Please select semester no.";return;}
var scores={};var ok=false;
var rows=document.querySelectorAll("#acFSubjects .sub-row");
for(var i=0;i<rows.length;i++){
var sName=rows[i].querySelector('input[type=text]').value.trim();
var sMarks=rows[i].querySelector('input[type=number]').value.trim();
if(!sName&&!sMarks)continue;
if(!sName){err.textContent="Row "+(i+1)+": enter subject name (or remove the row).";return;}
if(sMarks===""||isNaN(Number(sMarks))){err.textContent="Enter marks (0-100) for "+sName+".";return;}
var n=Math.max(0,Math.min(100,Number(sMarks)));
scores[sName]=n;ok=true;
}
if(!ok){err.textContent="Add at least one subject with marks (or attach its .csv).";return;}
academiaRecords.push({name:name,id:roll,course:course,sem:sem,session:session,scores:scores});
academiaSheets++;
closeAcAddForm();
var f=document.getElementById("acCourseFilter");
if(f)f.value=course;
var s=document.getElementById("acSearch");
if(s)s.value="";
renderAcademiaTable();
if(!document.getElementById("acCoursesView").hidden)renderAcademiaCourses();
if(loggedRole==="Academia")openDashboard("Academia",document.getElementById("academiaUniName").textContent);
alert("Record saved for "+name+" ("+course+" Sem "+sem+") — dashboard updated.");
}
function addAcademiaRow(){openAcAddForm();}
/* ---------- STUDENT DASHBOARD ---------- */
var studentProfile={fullName:"",gender:"",age:"",email:"",university:"",course:"",roll:"",sem:""};
var studentVerified=[
 {title:"Sem 5 Marksheet",subject:"B.Tech · Sem 5",detail:"Data Structures 86 · Operating Systems 78 · DBMS 91",score:"Avg 85%",date:"Jan 2026",source:"Mumbai University"},
 {title:"Sem 4 Marksheet",subject:"B.Tech · Sem 4",detail:"C Programming 88 · Web Tech 81 · Maths 77",score:"Avg 82%",date:"Aug 2025",source:"Mumbai University"}
];
var studentSelf=[
 {title:"React Frontend Certificate",subject:"Certificate · Coursera",detail:"Completed React specialization project",score:"Grade A",date:"Feb 2026",source:"Uploaded by you",file:""},
 {title:"Python Practice Log",subject:"Self practice",detail:"50 HackerRank problems solved",score:"—",date:"Mar 2026",source:"Uploaded by you",file:""}
];
var studentMocks=[
 {id:"mock1",title:"Frontend Development Mock",subjects:["React","JavaScript","HTML / CSS"],status:"attempted",score:87,subjectScores:{"React":92,"JavaScript":84,"HTML / CSS":95},date:"12 Mar 2026"},
 {id:"mock2",title:"Python + SQL Mock",subjects:["Python","SQL"],status:"attempted",score:81,subjectScores:{"Python":84,"SQL":78},date:"28 Feb 2026"},
 {id:"mock3",title:"Machine Learning Basics Mock",subjects:["ML Concepts","Statistics"],status:"pending",questions:[
   {q:"Which of these is supervised learning?",opts:["K-Means clustering","Linear Regression","PCA","Apriori"],a:1},
   {q:"Mean of [4, 8, 15, 16, 23, 42] is?",opts:["16","18","20","22"],a:1},
   {q:"Overfitting means the model…",opts:["Generalizes well","Memorizes training data","Underfits badly","Needs no data"],a:1}
 ]},
 {id:"mock4",title:"System Design Foundations Mock",subjects:["System Design","Databases"],status:"pending",questions:[
   {q:"Which DB is best for flexible JSON documents?",opts:["MySQL","MongoDB","SQLite","Redis"],a:1},
   {q:"Load balancer mainly helps with…",opts:["Styling pages","Distributing traffic","Writing SQL","Caching images only"],a:1},
   {q:"What does horizontal scaling mean?",opts:["Bigger single server","More servers","Faster CPU only","Less storage"],a:1}
 ]}
];
var activeMockId=null;
function escHtml(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function initStudentDashboard(name){
 if(!studentProfile.fullName&&name)studentProfile.fullName=name;
 renderStudentProfile();renderStudentRecords();renderStudentMocks();showStudentView("overview");
}
function renderStudentProfile(){
 var p=studentProfile;
 document.getElementById("stName").textContent=p.fullName||"Student";
 document.getElementById("stAvatar").textContent=((p.fullName||"ST").trim().substring(0,2)||"ST").toUpperCase();
 document.getElementById("stSub").textContent=[p.course,p.university].filter(Boolean).join(" · ")||"Complete your profile to personalize";
 document.getElementById("stFullName").textContent=p.fullName||"—";
 document.getElementById("stGender").textContent=p.gender||"—";
 document.getElementById("stAge").textContent=p.age||"—";
 document.getElementById("stEmail").textContent=p.email||"—";
 document.getElementById("stUni").textContent=p.university||"—";
 document.getElementById("stCourse").textContent=p.course||"—";
 document.getElementById("stRoll").textContent=p.roll||"—";
 document.getElementById("stSem").textContent=p.sem?("Semester "+p.sem):"—";
 document.getElementById("stVerifiedCount").textContent=studentVerified.length;
 document.getElementById("stSelfCount").textContent=studentSelf.length;
 var att=studentMocks.filter(function(m){return m.status==="attempted";});
 var pend=studentMocks.filter(function(m){return m.status==="pending";});
 document.getElementById("stAttemptedCount").textContent=att.length;
 document.getElementById("stPendingCount").textContent=pend.length;
 document.getElementById("stAvgLabel").textContent=att.length?("avg "+Math.round(att.reduce(function(s,m){return s+m.score;},0)/att.length)+"%"):"avg —";
}
function toggleStudentEdit(forceClose){
 var w=document.getElementById("stEditWrap");
 if(forceClose===true){w.hidden=true;return;}
 if(!w.hidden){w.hidden=true;return;}
 document.getElementById("stFName").value=studentProfile.fullName||"";
 document.getElementById("stFGender").value=studentProfile.gender||"";
 document.getElementById("stFAge").value=studentProfile.age||"";
 document.getElementById("stFEmail").value=studentProfile.email||"";
 document.getElementById("stFUni").value=studentProfile.university||"";
 document.getElementById("stFCourse").value=studentProfile.course||"";
 document.getElementById("stFRoll").value=studentProfile.roll||"";
 document.getElementById("stFSem").value=studentProfile.sem||"";
 document.getElementById("stFError").textContent="";
 w.hidden=false;
}
function saveStudentProfile(){
 var err=document.getElementById("stFError");
 var fullName=document.getElementById("stFName").value.trim();
 var email=document.getElementById("stFEmail").value.trim();
 if(!fullName){err.textContent="Please enter full name.";return;}
 if(email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){err.textContent="Please enter a valid email.";return;}
 studentProfile={fullName:fullName,gender:document.getElementById("stFGender").value,age:document.getElementById("stFAge").value.trim(),email:email,university:document.getElementById("stFUni").value.trim(),course:document.getElementById("stFCourse").value,roll:document.getElementById("stFRoll").value.trim(),sem:document.getElementById("stFSem").value};
 document.getElementById("stEditWrap").hidden=true;
 renderStudentProfile();
}
function showStudentView(view){
 var map={overview:"stViewOverview",records:"stViewRecords",mocks:"stViewMocks"};
 Object.keys(map).forEach(function(k){document.getElementById(map[k]).hidden=(k!==view);});
 document.querySelectorAll("[data-st-view]").forEach(function(b){b.classList.toggle("active",b.dataset.stView===view);});
}
function showStudentRecordsTab(tab){
 var isV=tab==="verified";
 document.getElementById("stVerifiedList").hidden=!isV;
 document.getElementById("stSelfList").hidden=isV;
 document.getElementById("stTabVerified").classList.toggle("active",isV);
 document.getElementById("stTabSelf").classList.toggle("active",!isV);
}
function stRecordCard(r,verified){
 return '<div class="st-record"><div class="st-record-top"><b>'+escHtml(r.title)+'</b><span class="pill '+(verified?"pill-verified":"pill-self")+'">'+(verified?"Verified":"Self-declared")+'</span></div><p>'+escHtml(r.subject)+' · '+escHtml(r.detail)+'</p><p><small>'+escHtml(r.score||"")+(r.date?" · "+escHtml(r.date):"")+' · '+escHtml(r.source||"")+(r.file?" · 📎 "+escHtml(r.file):"")+'</small></p></div>';
}
function renderStudentRecords(){
 document.getElementById("stVerifiedList").innerHTML=studentVerified.length?studentVerified.map(function(r){return stRecordCard(r,true);}).join(""):'<div class="st-record"><p>No verified records yet.</p></div>';
 document.getElementById("stSelfList").innerHTML=studentSelf.length?studentSelf.map(function(r){return stRecordCard(r,false);}).join(""):'<div class="st-record"><p>No self-declared uploads yet. Click Upload Record to add one.</p></div>';
 document.getElementById("stVerifiedCount").textContent=studentVerified.length;
 document.getElementById("stSelfCount").textContent=studentSelf.length;
}
function openStudentUpload(){document.getElementById("stUTitle").value="";document.getElementById("stUSubject").value="";document.getElementById("stUScore").value="";document.getElementById("stUFile").value="";document.getElementById("stUError").textContent="";document.getElementById("stUploadModal").classList.add("show");}
function closeStudentUpload(){document.getElementById("stUploadModal").classList.remove("show");}
function submitStudentUpload(){
 var err=document.getElementById("stUError");
 var title=document.getElementById("stUTitle").value.trim();
 var subject=document.getElementById("stUSubject").value.trim();
 var score=document.getElementById("stUScore").value.trim()||"—";
 if(!title){err.textContent="Please enter a title.";return;}
 if(!subject){err.textContent="Please enter subject / type.";return;}
 var f=document.getElementById("stUFile").files[0];
 var d=new Date();
 var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
 studentSelf.unshift({title:title,subject:subject,detail:subject,score:score,date:d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear(),source:"Uploaded by you",file:f?f.name:""});
 closeStudentUpload();showStudentRecordsTab("self");renderStudentRecords();
}
function showStudentMocksTab(tab){
 var isA=tab==="attempted";
 document.getElementById("stAttemptedList").hidden=!isA;
 document.getElementById("stPendingList").hidden=isA;
 document.getElementById("stTabAttempted").classList.toggle("active",isA);
 document.getElementById("stTabPending").classList.toggle("active",!isA);
}
function renderStudentMocks(){
 var att=studentMocks.filter(function(m){return m.status==="attempted";});
 var pend=studentMocks.filter(function(m){return m.status==="pending";});
 var html="";
 for(var i=0;i<att.length;i++){var m=att[i];
  var subs=Object.keys(m.subjectScores||{}).map(function(s){return "<span>"+escHtml(s)+": "+m.subjectScores[s]+"%</span>";}).join("");
  html+='<div class="st-mock"><div class="st-mock-top"><b>'+escHtml(m.title)+'</b><span class="pill pill-verified">Attempted</span><span class="st-score">'+m.score+'%</span></div><div class="st-mock-subjects">'+subs+'</div><p><small>'+escHtml(m.date||"")+'</small></p></div>';
 }
 document.getElementById("stAttemptedList").innerHTML=html||'<div class="st-mock"><p>No attempted tests yet. Start one from Pending.</p></div>';
 var html2="";
 for(var j=0;j<pend.length;j++){var p=pend[j];
  var tags="";
  for(var k=0;k<p.subjects.length;k++){tags+="<span>"+escHtml(p.subjects[k])+"</span>";}
  html2+='<div class="st-mock"><div class="st-mock-top"><b>'+escHtml(p.title)+'</b><span class="pill pill-self">Pending</span></div><div class="st-mock-subjects">'+tags+'</div><div class="st-mock-actions"><button class="primary-btn small" onclick="openStudentMock(\''+p.id+'\')">Start Test</button><small>'+(p.questions?p.questions.length:0)+' questions</small></div></div>';
 }
 document.getElementById("stPendingList").innerHTML=html2||'<div class="st-mock"><p>All mock tests completed.</p></div>';
 document.getElementById("stAttemptedCount").textContent=att.length;
 document.getElementById("stPendingCount").textContent=pend.length;
 var total=0;for(var t=0;t<att.length;t++){total+=att[t].score;}
 document.getElementById("stAvgLabel").textContent=att.length?("avg "+Math.round(total/att.length)+"%"):"avg —";
}
function openStudentMock(id){
 var m=null;for(var i=0;i<studentMocks.length;i++){if(studentMocks[i].id===id){m=studentMocks[i];break;}}
 if(!m||!m.questions)return;
 activeMockId=id;
 document.getElementById("stMockTitle").textContent=m.title;
 document.getElementById("stMockSub").textContent=m.subjects.join(" · ")+" — answer all questions and submit.";
 var html="";
 for(var qi=0;qi<m.questions.length;qi++){var q=m.questions[qi];
  html+='<div class="st-q"><p>Q'+(qi+1)+'. '+escHtml(q.q)+'</p>';
  for(var oi=0;oi<q.opts.length;oi++){html+='<label><input type="radio" name="stq'+qi+'" value="'+oi+'"> '+escHtml(q.opts[oi])+'</label>';}
  html+='</div>';
 }
 document.getElementById("stMockQs").innerHTML=html;
 document.getElementById("stMockError").textContent="";
 document.getElementById("stMockModal").classList.add("show");
}
function closeStudentMock(){document.getElementById("stMockModal").classList.remove("show");activeMockId=null;}
function submitStudentMock(){
 var m=null;for(var i=0;i<studentMocks.length;i++){if(studentMocks[i].id===activeMockId){m=studentMocks[i];break;}}
 if(!m)return;
 var err=document.getElementById("stMockError");
 var total=m.questions.length,correct=0;
 var perSubject={},perTotal={};
 for(var s=0;s<m.subjects.length;s++){perSubject[m.subjects[s]]=0;perTotal[m.subjects[s]]=0;}
 for(var qi=0;qi<total;qi++){
  var sel=document.querySelector('input[name="stq'+qi+'"]:checked');
  if(!sel){err.textContent="Please answer Q"+(qi+1)+" before submitting.";return;}
  var subj=m.subjects[qi%m.subjects.length];
  perTotal[subj]++;
  if(Number(sel.value)===m.questions[qi].a){correct++;perSubject[subj]++;}
 }
 var score=Math.round((correct/total)*100);
 var subjectScores={};
 for(var k2=0;k2<m.subjects.length;k2++){var sn=m.subjects[k2];subjectScores[sn]=perTotal[sn]?Math.round((perSubject[sn]/perTotal[sn])*100):0;}
 m.status="attempted";m.score=score;m.subjectScores=subjectScores;
 var d=new Date();var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
 m.date=d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear();
 closeStudentMock();showStudentMocksTab("attempted");renderStudentMocks();
 alert(m.title+" submitted! Score: "+score+"% ("+correct+"/"+total+" correct)");
}