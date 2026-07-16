const KEY = "promptLibrary";
const titleEl = document.getElementById("title");
const contentEl = document.getElementById("content");
const listEl = document.getElementById("list");
const countEl = document.getElementById("count");
const ratingEl = document.getElementById("rating");

const RATING_LABELS = { useful: "Very useful", mid: "Mid", bad: "Bad" };

function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch{ return []; } }
function persist(items){ localStorage.setItem(KEY, JSON.stringify(items)); }

function render(){
  const items = load();
  countEl.textContent = items.length ? items.length + (items.length===1?" prompt":" prompts") : "";
  if(!items.length){
    listEl.innerHTML = '<div class="empty">No prompts yet. Add one above to get started.</div>';
    return;
  }
  listEl.innerHTML = "";
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "prompt";

    const top = document.createElement("div");
    top.className = "prompt-top";

    const t = document.createElement("div");
    t.className = "prompt-title";
    t.textContent = item.title;

    const right = document.createElement("div");
    right.className = "prompt-actions";

    const del = document.createElement("button");
    del.className = "del-btn";
    del.textContent = "Delete";
    del.onclick = () => removePrompt(item.id);
    right.appendChild(del);

    if(item.rating){
      const badge = document.createElement("span");
      badge.className = "badge " + item.rating;
      badge.textContent = RATING_LABELS[item.rating];
      right.appendChild(badge);
    }

    top.appendChild(t);
    top.appendChild(right);

    const c = document.createElement("div");
    c.className = "prompt-content";
    c.textContent = item.content;

    card.appendChild(top);
    card.appendChild(c);
    listEl.appendChild(card);
  });
}

function savePrompt(){
  const title = titleEl.value.trim();
  const content = contentEl.value.trim();
  if(!title || !content){
    alert("Please enter both a title and a prompt.");
    return;
  }
  const items = load();
  items.unshift({ id: Date.now().toString(36)+Math.random().toString(36).slice(2,6), title, content, rating: ratingEl.value });
  persist(items);
  titleEl.value = "";
  contentEl.value = "";
  titleEl.focus();
  render();
}

function removePrompt(id){
  persist(load().filter(p => p.id !== id));
  render();
}

document.getElementById("saveBtn").addEventListener("click", savePrompt);
render();

/* ---- Flying bats background ---- */
const BAT_SVG = `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
  <path d="M60 44 Q53 44 51 32 Q51 22 60 20 Q69 22 69 32 Q67 44 60 44 Z
    M54 22 L55 6 L60 20 L65 6 L66 22 Z"/>
  <path class="wing wing-l" d="M52 27 Q40 22 30 27 Q35 21 24 23 Q31 17 15 19
    Q23 15 5 17 Q21 23 15 32 Q27 27 31 36 Q41 31 45 40 Q51 35 52 30 Z"/>
  <path class="wing wing-r" d="M68 27 Q80 22 90 27 Q85 21 96 23 Q89 17 105 19
    Q97 15 115 17 Q99 23 105 32 Q93 27 89 36 Q79 31 75 40 Q69 35 68 30 Z"/>
</svg>`;

function spawnBats(count){
  const layer = document.createElement("div");
  layer.id = "bats";
  for(let i=0; i<count; i++){
    const bat = document.createElement("div");
    bat.className = "bat";
    const size = 22 + Math.random()*40;            // random size
    bat.style.width = size + "px";
    bat.style.top = (Math.random()*90) + "vh";      // random vertical start
    const dur = 13 + Math.random()*16;              // random speed
    const dir = Math.random() < 0.5 ? "fly" : "flyR";
    bat.style.animation = `${dir} ${dur}s linear ${-Math.random()*dur}s infinite`;
    bat.style.setProperty("--flap", (0.28 + Math.random()*0.22).toFixed(2) + "s"); // wingbeat speed

    const inner = document.createElement("div");
    inner.className = "bat-inner";
    inner.innerHTML = BAT_SVG;

    bat.appendChild(inner);
    layer.appendChild(bat);
  }
  document.body.appendChild(layer);
}

spawnBats(28);
