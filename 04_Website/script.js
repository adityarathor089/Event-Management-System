const defaultEvents = [
 {id:1,name:"Campus Tech Fest",date:"2026-11-28",venue:"Main Auditorium",category:"Competition"},
 {id:2,name:"Web Design Workshop",date:"2026-12-03",venue:"Computer Lab 2",category:"Workshop"},
 {id:3,name:"Cultural Evening",date:"2026-12-10",venue:"Open Air Theatre",category:"Cultural"}
];
let events = JSON.parse(localStorage.getItem("ce_events") || "null") || defaultEvents;
let participants = JSON.parse(localStorage.getItem("ce_participants") || "[]");
const $ = id => document.getElementById(id);
function saveData(){localStorage.setItem("ce_events",JSON.stringify(events));localStorage.setItem("ce_participants",JSON.stringify(participants));}
function renderEvents(){
 $("eventList").innerHTML = "";
 events.forEach((event,index)=>{
  const card=document.createElement("article"); card.className="event-card";
  card.style.setProperty("--accent",["#6c55d9","#ff9d66","#48b783"][index%3]);
  card.innerHTML=`<span class="category">${event.category}</span><h3></h3><div class="event-meta">▣ ${event.date}<br>⌖ ${event.venue}<br>♙ ${participants.filter(p=>p.eventId===event.id).length} registrations</div><button data-delete-event="${event.id}">Remove event</button>`;
  card.querySelector("h3").textContent=event.name; $("eventList").appendChild(card);
 });
 $("selectedEvent").innerHTML='<option value="">Choose an event</option>'+events.map(e=>`<option value="${e.id}">${escapeHTML(e.name)}</option>`).join("");
 $("totalEvents").textContent=events.length;
 $("upcomingEvents").textContent=events.filter(e=>e.date>=new Date().toISOString().slice(0,10)).length;
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderParticipants(query=""){
 const filtered=participants.filter(p=>(p.name+" "+p.email+" "+p.eventName).toLowerCase().includes(query.toLowerCase()));
 $("participantTable").innerHTML="";
 filtered.forEach(p=>{
  const tr=document.createElement("tr");
  [p.name,p.email,p.phone,p.eventName].forEach(value=>{const td=document.createElement("td");td.textContent=value;tr.appendChild(td);});
  const action=document.createElement("td");const btn=document.createElement("button");btn.className="delete-btn";btn.textContent="Delete";btn.dataset.deleteParticipant=p.id;action.appendChild(btn);tr.appendChild(action);$("participantTable").appendChild(tr);
 });
 $("emptyMessage").style.display=filtered.length?"none":"block";
 $("totalRegistrations").textContent=participants.length;
}
$("showEventForm").addEventListener("click",()=>$("eventFormPanel").classList.toggle("hidden"));
$("cancelEvent").addEventListener("click",()=>$("eventFormPanel").classList.add("hidden"));
$("eventForm").addEventListener("submit",e=>{
 e.preventDefault();
 const name=$("eventName").value.trim(),date=$("eventDate").value,venue=$("eventVenue").value.trim();
 if(!name||!date||!venue){alert("Please complete all event details.");return;}
 events.push({id:Date.now(),name,date,venue,category:$("eventCategory").value});
 saveData();renderEvents();renderParticipants($("searchInput").value);e.target.reset();$("eventFormPanel").classList.add("hidden");
});
$("registrationForm").addEventListener("submit",e=>{
 e.preventDefault();
 const name=$("participantName").value.trim(),email=$("participantEmail").value.trim(),phone=$("participantPhone").value.trim(),eventId=Number($("selectedEvent").value);
 const event=events.find(x=>x.id===eventId);
 if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!/^[0-9]{10}$/.test(phone)||!event){$("formMessage").textContent="Please enter valid details and select an event.";return;}
 if(participants.some(p=>p.email.toLowerCase()===email.toLowerCase()&&p.eventId===eventId)){$("formMessage").textContent="This email is already registered for this event.";return;}
 participants.push({id:Date.now(),name,email,phone,eventId,eventName:event.name});
 saveData();renderEvents();renderParticipants($("searchInput").value);e.target.reset();$("formMessage").textContent="Registration completed successfully!";
});
$("searchInput").addEventListener("input",e=>renderParticipants(e.target.value));
document.addEventListener("click",e=>{
 if(e.target.dataset.deleteParticipant){participants=participants.filter(p=>p.id!==Number(e.target.dataset.deleteParticipant));saveData();renderParticipants($("searchInput").value);renderEvents();}
 if(e.target.dataset.deleteEvent){const id=Number(e.target.dataset.deleteEvent);if(participants.some(p=>p.eventId===id)){alert("Delete or move this event's registrations first.");return;}events=events.filter(x=>x.id!==id);saveData();renderEvents();}
});
renderEvents();renderParticipants();
