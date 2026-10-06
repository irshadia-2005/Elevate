function scrollToId(id){document.getElementById(id).scrollIntoView({behavior:"smooth"})}
function showLogin(){document.getElementById("loginModal").classList.add("show")}
function hideLogin(){document.getElementById("loginModal").classList.remove("show")}
function closeLogin(e){if(e.target.id==="loginModal")hideLogin()}
function loginAs(role){hideLogin();openDashboard(role)}
function openDashboard(role){
  if(role==="Academia"){
    document.getElementById("dash-title").textContent="Academia Dashboard";
    document.getElementById("genericDashboard").style.display="none";
    document.getElementById("academiaDashboard").style.display="block";
    renderAcademiaTable();
    scrollToId("dashboard");
    return;
  }
  document.getElementById("genericDashboard").style.display="grid";
  document.getElementById("academiaDashboard").style.display="none";
  document.getElementById("dash-title").textContent=role+" Dashboard";
  document.getElementById("welcome-role").textContent=role;
  document.getElementById("score").textContent=role==="Industry"?"91%":role==="Academia"?"82%":role==="Institution"?"88%":"87%";
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
function openAcademiaLogin(){document.getElementById("academiaLoginModal").classList.add("show");document.getElementById("acLoginError").textContent="";}
function hideAcademiaLogin(){document.getElementById("academiaLoginModal").classList.remove("show");}
function academiaLogin(){
var uni=document.getElementById("acUniName").value.trim();
var pass=document.getElementById("acUniPass").value.trim();
var err=document.getElementById("acLoginError");
if(!uni){err.textContent="Please enter university name.";return;}
if(!pass){err.textContent="Please enter password (demo only, not verified).";return;}
hideAcademiaLogin();
document.getElementById("academiaUniName").textContent=uni;
document.getElementById("academiaWelcomeSub").textContent="University portal - "+uni;
document.getElementById("academiaAvatar").textContent=uni.substring(0,2).toUpperCase();
openDashboard("Academia");
}
function academiaSubjects(course){var s={};academiaRecords.forEach(function(r){if(!course||course==="All Courses"||r.course===course){Object.keys(r.scores).forEach(function(k){s[k]=1;});}});return Object.keys(s);}
function academiaLogout(){document.getElementById("academiaDashboard").style.display="none";document.getElementById("genericDashboard").style.display="grid";document.getElementById("dash-title").textContent="Student Dashboard";scrollToId("roles");}
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
openDashboard("Academia");
alert("Record saved for "+name+" ("+course+" Sem "+sem+") — dashboard updated.");
}
function addAcademiaRow(){openAcAddForm();}