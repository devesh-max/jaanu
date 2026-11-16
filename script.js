
const SECRET_CODE="2512";
let entered="";
function update(){const el=document.getElementById("display");if(el)el.textContent=entered.padEnd(4,"•").split("").join(" ")}
function press(n){if(entered.length<4){entered+=n;update();if(entered.length===4)setTimeout(unlock,250)}}
function clearCode(){entered="";update();const e=document.getElementById("error");if(e)e.textContent=""}
function unlock(){if(entered===SECRET_CODE){sessionStorage.setItem("jaanuUnlocked","yes");location.href="home.html"}else{const e=document.getElementById("error");if(e)e.textContent="Not quite! Try the date hint 💗";entered="";update()}}
function reveal(id){const el=document.getElementById(id);if(el)el.classList.toggle("show")}
function randomReason(){const reasons=["Your laugh makes ordinary moments memorable.","You make little things feel special.","You are wonderfully, unmistakably you.","You bring your own kind of sunshine.","The way you care about people matters.","You make a good day even better.","You deserve reminders of how appreciated you are."];const el=document.getElementById("reason");if(el)el.textContent=reasons[Math.floor(Math.random()*reasons.length)]}
function yes(){const a=document.getElementById("answer");if(a)a.textContent="Surprise! You are a favourite part of my story. I hope this makes you smile. 💗✨";celebrate()}
function nope(){const a=document.getElementById("answer");if(a)a.textContent="The surprise is that you're amazing, and that doesn't need a button. 😄💞"}
function celebrate(){for(let i=0;i<24;i++){const s=document.createElement("span");s.className="spark";s.textContent=["💗","✨","🌸","💕","⭐"][i%5];s.style.left=Math.random()*100+"vw";s.style.bottom="-30px";s.style.animationDelay=Math.random()*.8+"s";document.body.appendChild(s);setTimeout(()=>s.remove(),3000)}}
function addWish(){const input=document.getElementById("wishInput"),list=document.getElementById("wishList");if(!input||!list||!input.value.trim())return;const li=document.createElement("li");li.textContent=input.value.trim();list.appendChild(li);input.value=""}

const SCORE_KEY="jaanuQuizScores";
function getScores(){try{return JSON.parse(localStorage.getItem(SCORE_KEY)||"{}")}catch(e){return {}}}
function updateScoreChip(){
 const chip=document.getElementById("scoreChip");if(!chip)return;
 const scores=getScores(), total=Object.values(scores).reduce((a,b)=>a+(Number(b)||0),0);
 chip.textContent="🏆 Best quiz points: "+total+" / 20";
}
function renderQuiz(){
 const mount=document.getElementById("quizMount");if(!mount||typeof QUIZ_DATA==="undefined")return;
 const key=mount.dataset.quiz, quiz=QUIZ_DATA[key];if(!quiz)return;
 const area=document.createElement("div");
 quiz.questions.forEach((q,i)=>{
  const card=document.createElement("section");card.className="quiz-question";
  const heading=document.createElement("h3");heading.textContent=(i+1)+". "+q.question;card.appendChild(heading);
  q.options.forEach((opt,j)=>{
   const label=document.createElement("label");label.className="quiz-option";
   const radio=document.createElement("input");radio.type="radio";radio.name="q"+i;radio.value=String(j);
   const span=document.createElement("span");span.textContent=opt;
   label.append(radio,span);card.appendChild(label);
  });
  area.appendChild(card);
 });
 mount.appendChild(area);
 const submit=document.createElement("button");submit.className="btn quiz-submit";submit.textContent="Submit my answers 💗";
 submit.addEventListener("click",()=>{
  let correct=0,answered=0;
  quiz.questions.forEach((q,i)=>{const picked=mount.querySelector('input[name="q'+i+'"]:checked');if(picked){answered++;if(Number(picked.value)===q.answer)correct++}});
  const points=correct;const percent=Math.round(correct/quiz.questions.length*100);
  const levels=percent===100?"PERFECT SCORE! 🌟":percent>=80?"SUPERSTAR! 💖":percent>=60?"NICE WORK! 🌷":percent>=40?"KEEP GOING! ✨":"GOOD TRY! 💗";
  const scores=getScores();scores[key]=Math.max(Number(scores[key])||0,points);localStorage.setItem(SCORE_KEY,JSON.stringify(scores));
  const result=document.getElementById("quizResult");result.classList.add("show");
  result.innerHTML='<div class="score-big">'+correct+' / '+quiz.questions.length+'</div><h3>'+levels+'</h3><p>'+percent+'% · '+answered+' of '+quiz.questions.length+' answered</p><p>Best score saved for this quiz. Try again if you want to beat it!</p>';
  updateScoreChip();result.scrollIntoView({behavior:"smooth",block:"center"});
 });
 mount.appendChild(submit);
}
document.addEventListener("DOMContentLoaded",()=>{
 const audio=document.getElementById("siteMusic");
 if(audio){
  const savedTime=Number(sessionStorage.getItem("jaanuMusicTime")||0);
  const wanted=sessionStorage.getItem("jaanuMusicPlaying")==="yes";
  audio.preload="auto";
  const restoreMusic=()=>{
   if(savedTime>0&&Number.isFinite(audio.duration)&&savedTime<audio.duration)audio.currentTime=savedTime;
   // Try to resume automatically. Browsers may block audible autoplay until the visitor interacts.
   if(wanted)audio.play().catch(()=>{});
  };
  if(audio.readyState>=1)restoreMusic();else audio.addEventListener("loadedmetadata",restoreMusic,{once:true});
  const startMusicFromFirstInteraction=()=>{
   if(audio.paused){
    audio.play().then(()=>sessionStorage.setItem("jaanuMusicPlaying","yes")).catch(()=>{});
   }
  };
  // No need to press the audio controls: the first tap, click, or key press anywhere starts the song.
  document.addEventListener("pointerdown",startMusicFromFirstInteraction,{once:true,capture:true});
  document.addEventListener("keydown",startMusicFromFirstInteraction,{once:true,capture:true});
  audio.addEventListener("timeupdate",()=>sessionStorage.setItem("jaanuMusicTime",String(audio.currentTime)));
  audio.addEventListener("play",()=>sessionStorage.setItem("jaanuMusicPlaying","yes"));
  audio.addEventListener("pause",()=>sessionStorage.setItem("jaanuMusicPlaying","no"));
  window.addEventListener("pagehide",()=>sessionStorage.setItem("jaanuMusicTime",String(audio.currentTime)));
 }
 updateScoreChip();renderQuiz();
 const f=document.getElementById("songFile"),p=document.getElementById("player");
 if(f&&p)f.addEventListener("change",()=>{if(f.files[0]){p.src=URL.createObjectURL(f.files[0]);p.play().catch(()=>{})}});
});
