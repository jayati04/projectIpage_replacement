// Vertical frames + hit & miss counters — page replacement (FIFO, LRU, Optimal)
const canvas = document.getElementById('can');
const ctx = canvas.getContext('2d');
const algoSel = document.getElementById('algo');
const framesInput = document.getElementById('frames');
const refStrInput = document.getElementById('refStr');
const sampleA = document.getElementById('sampleA');
const sampleB = document.getElementById('sampleB');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const stepBtn = document.getElementById('step');
const resetBtn = document.getElementById('reset');
const speedEl = document.getElementById('speed');
const themeToggle = document.getElementById('themeToggle');
const exportBtn = document.getElementById('export');
const narrationEl = document.getElementById('narration');
const curRefEl = document.getElementById('curRef');
const faultCountEl = document.getElementById('faultCount');
const hitCountEl = document.getElementById('hitCount');
const totalCountEl = document.getElementById('totalCount');

let refArray = [];
let frames = [];
let frameCount = 3;
let pos = 0;
let algo = "fifo";
let playing = false;
let interval = null;
let faultCount = 0, hitCount = 0;
let speed = 1;
let initialized = false;
let animationFrame = null;

function parseRefString(str){
  return str.trim().split(/\s+/).filter(Boolean).map(Number);
}

function loadSampleA(){ refStrInput.value = "7 0 1 2 0 3 0 4 2 3 0 3"; initFromInputs(true); }
function loadSampleB(){ refStrInput.value = "1 2 3 2 4 1 5 2 1 2 3 4"; initFromInputs(true); }

function initFromInputs(forceReset = false){
  if(initialized && !forceReset) return;
  refArray = parseRefString(refStrInput.value || "");
  frameCount = Math.max(1, Number(framesInput.value) || 3);
  frames = Array.from({length: frameCount}, () => ({ page: null, lastUsed: -1, insertedAt: -1 }));
  pos = 0; faultCount = 0; hitCount = 0;
  updateStats();
  algo = algoSel.value;
  drawAll();
  narrate("Ready. Press Play or Step.");
  initialized = true;
}

function narrate(txt){ narrationEl.textContent = "Narration: " + txt; }
function updateStats(){ faultCountEl.textContent = faultCount; hitCountEl.textContent = hitCount; totalCountEl.textContent = refArray.length; curRefEl.textContent = (pos < refArray.length ? refArray[pos] : '-'); }

function drawAll(highlight = {}){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = document.body.classList.contains('dark');
  ctx.fillStyle = isDark ? "#0a0f1e" : "#081224";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Vertical frames on left with animations
  const leftX = 60, topY = 60;
  const frameW = 120, frameH = 60, gap = 18;
  const time = Date.now() * 0.001;
  
  for(let i=0;i<frameCount;i++){
    const y = topY + i*(frameH + gap);
    const f = frames[i];
    const isHighlighted = highlight.index === i;
    
    // Animated pulse for highlighted frames
    let pulseScale = 1;
    if (isHighlighted) {
      pulseScale = 1 + Math.sin(time * 8) * 0.05;
    }
    
    // Gradient colors based on state
    let frameColor;
    if (f.page === null) {
      frameColor = "#60a5fa";
    } else if (isHighlighted) {
      frameColor = highlight.type === 'hit' ? "#34d399" : "#f87171";
    } else {
      frameColor = "#0ea5a6";
    }
    
    // Draw frame with glow effect if highlighted
    if (isHighlighted) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = frameColor;
    } else {
      ctx.shadowBlur = 0;
    }
    
    const adjustedW = frameW * pulseScale;
    const adjustedH = frameH * pulseScale;
    const adjustedX = leftX - (adjustedW - frameW) / 2;
    const adjustedY = y - (adjustedH - frameH) / 2;
    
    ctx.fillStyle = frameColor;
    roundRect(ctx, adjustedX, adjustedY, adjustedW, adjustedH, 12, true, false);
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = isDark ? "#cbd5e1" : "#001219";
    ctx.font = "14px Poppins, sans-serif";
    ctx.fillText("Frame " + (i+1), leftX + 12, y + 20);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Poppins, sans-serif";
    ctx.fillText(f.page === null ? "-" : f.page, leftX + 48, y + 44);
  }

  // Reference timeline to right/bottom with animations
  ctx.fillStyle = "#fff"; ctx.font = "bold 16px Poppins, sans-serif";
  ctx.fillText("Reference String:", leftX + frameW + 40, 40);
  let tx = leftX + frameW + 40;
  const boxW = 56, boxH = 46, gap2 = 10;
  const timelineY = 70;
  
  for(let i=0;i<refArray.length;i++){
    const val = refArray[i];
    const isCur = (i === pos);
    const isPast = i < pos;
    
    // Animate current position
    let scale = 1;
    let glow = 0;
    if (isCur) {
      scale = 1 + Math.sin(time * 6) * 0.1;
      glow = 15;
      ctx.shadowBlur = glow;
      ctx.shadowColor = "#facc15";
    } else if (isPast) {
      ctx.shadowBlur = 0;
    }
    
    ctx.fillStyle = isCur ? "#facc15" : (isPast ? "#4ade80" : "#94a3b8");
    const scaledW = boxW * scale;
    const scaledH = boxH * scale;
    const scaledX = tx - (scaledW - boxW) / 2;
    const scaledY = timelineY - (scaledH - boxH) / 2;
    roundRect(ctx, scaledX, scaledY, scaledW, scaledH, 10, true, false);
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = isDark ? "#0a0f1e" : "#081224";
    ctx.font = "bold 16px Poppins, sans-serif";
    ctx.fillText(val, tx + boxW/2 - 6, timelineY + 30);
    tx += boxW + gap2;
  }

  // Stats / algorithm label with gradient
  const gradient = ctx.createLinearGradient(leftX + frameW + 40, canvas.height - 80, leftX + frameW + 240, canvas.height - 40);
  gradient.addColorStop(0, "#667eea");
  gradient.addColorStop(1, "#764ba2");
  ctx.fillStyle = gradient;
  ctx.font = "bold 16px Poppins, sans-serif";
  ctx.fillText("Algorithm: " + algoSel.value.toUpperCase(), leftX + frameW + 40, canvas.height - 60);

  updateStats();
}

function roundRect(ctx, x, y, w, h, r, fill, stroke){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}

function doStep(){
  if(!initialized) initFromInputs(true);
  if(pos >= refArray.length){ narrate("All references processed."); stopPlay(); return; }
  const cur = refArray[pos];
  curRefEl.textContent = cur;

  const hitIndex = frames.findIndex(f => f.page === cur);
  if(hitIndex !== -1){
    hitCount++; frames[hitIndex].lastUsed = pos;
    updateStats(); drawAll({ index: hitIndex, type: 'hit' });
    narrate(`Hit: Page ${cur} found in Frame ${hitIndex+1}`);
    pos++; return;
  }

  // Miss / page fault
  faultCount++; updateStats();
  const emptyIndex = frames.findIndex(f => f.page === null);

  if(algo === 'fifo'){
    if(emptyIndex !== -1){
      frames[emptyIndex].page = cur; frames[emptyIndex].insertedAt = pos; frames[emptyIndex].lastUsed = pos;
      drawAll({ index: emptyIndex, type: 'fault' });
      narrate(`Miss: Page ${cur} placed in empty Frame ${emptyIndex+1}`);
    } else {
      let victimIdx = 0; let minIns = frames[0].insertedAt;
      for(let i=1;i<frames.length;i++) if(frames[i].insertedAt < minIns){ minIns = frames[i].insertedAt; victimIdx = i; }
      const replaced = frames[victimIdx].page;
      frames[victimIdx].page = cur; frames[victimIdx].insertedAt = pos; frames[victimIdx].lastUsed = pos;
      drawAll({ index: victimIdx, type: 'fault' });
      narrate(`Miss: Page ${cur} replaced ${replaced} (FIFO) in Frame ${victimIdx+1}`);
    }
  } else if(algo === 'lru'){
    if(emptyIndex !== -1){
      frames[emptyIndex].page = cur; frames[emptyIndex].lastUsed = pos;
      drawAll({ index: emptyIndex, type: 'fault' });
      narrate(`Miss: Page ${cur} placed in empty Frame ${emptyIndex+1}`);
    } else {
      let victimIdx = 0; let minLU = frames[0].lastUsed;
      for(let i=1;i<frames.length;i++) if(frames[i].lastUsed < minLU){ minLU = frames[i].lastUsed; victimIdx = i; }
      const replaced = frames[victimIdx].page;
      frames[victimIdx].page = cur; frames[victimIdx].lastUsed = pos;
      drawAll({ index: victimIdx, type: 'fault' });
      narrate(`Miss: Page ${cur} replaced ${replaced} (LRU) in Frame ${victimIdx+1}`);
    }
  } else if(algo === 'opt'){
    if(emptyIndex !== -1){
      frames[emptyIndex].page = cur; frames[emptyIndex].lastUsed = pos;
      drawAll({ index: emptyIndex, type: 'fault' });
      narrate(`Miss: Page ${cur} placed in empty Frame ${emptyIndex+1}`);
    } else {
      let victimIdx = -1; let farthest = -1;
      for(let i=0;i<frames.length;i++){
        const page = frames[i].page;
        let nextIdx = refArray.slice(pos+1).indexOf(page);
        if(nextIdx === -1){ victimIdx = i; break; }
        if(nextIdx > farthest){ farthest = nextIdx; victimIdx = i; }
      }
      const replaced = frames[victimIdx].page;
      frames[victimIdx].page = cur; frames[victimIdx].lastUsed = pos;
      drawAll({ index: victimIdx, type: 'fault' });
      narrate(`Miss: Page ${cur} replaced ${replaced} (Optimal) in Frame ${victimIdx+1}`);
    }
  }

  pos++;
}

function animate() {
  if (!playing) return;
  drawAll();
  animationFrame = requestAnimationFrame(animate);
}

function play(){
  if(!initialized) initFromInputs(true);
  if(playing) return;
  if(refArray.length === 0){ narrate('Enter reference string first.'); return; }
  playing = true;
  speed = Number(speedEl.value);
  playBtn.classList.add('playing');
  if (playBtn.querySelector('.btn-icon')) {
    playBtn.querySelector('.btn-icon').textContent = '▶';
  }
  
  // Start animation loop
  animate();
  
  interval = setInterval(()=>{
    if(pos >= refArray.length){ narrate('Done.'); stopPlay(); return; }
    doStep();
  }, 900 / speed);
}

function stopPlay(){ 
  playing = false; 
  if(interval){ clearInterval(interval); interval = null; }
  if(animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = null; }
  playBtn.classList.remove('playing');
  drawAll();
}

function exportPNG(){ 
  const url = canvas.toDataURL('image/png'); 
  const a = document.createElement('a'); 
  a.href = url; 
  a.download = 'page-replacement-vertical.png'; 
  a.click(); 
}

// Theme Toggle Functionality
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  
  if (shouldBeDark) {
    document.body.classList.add('dark');
    updateThemeButton(true);
  } else {
    document.body.classList.remove('dark');
    updateThemeButton(false);
  }
}

function updateThemeButton(isDark) {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector('.theme-icon');
  const text = themeToggle.querySelector('.theme-text');
  if (icon && text) {
    icon.textContent = isDark ? '☀️' : '🌙';
    text.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeButton(isDark);
  drawAll(); // Redraw with new theme
}

// UI events
sampleA.addEventListener('click', ()=>loadSampleA());
sampleB.addEventListener('click', ()=>loadSampleB());
playBtn.addEventListener('click', ()=>{ initFromInputs(true); play(); narrate('Playing...'); });
pauseBtn.addEventListener('click', ()=>{ stopPlay(); narrate('Paused.'); });
stepBtn.addEventListener('click', ()=>{ stopPlay(); doStep(); });
resetBtn.addEventListener('click', ()=>{ initialized=false; initFromInputs(true); stopPlay(); narrate('Reset.'); });
if (exportBtn) {
  exportBtn.addEventListener('click', exportPNG);
}
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}
speedEl.addEventListener('input', ()=>{ if(playing){ stopPlay(); play(); }});
algoSel.addEventListener('change', ()=>{ algo = algoSel.value; narrate('Algorithm: ' + algo.toUpperCase()); drawAll(); });

// initialize
initTheme();
initFromInputs(true);
