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

    const del = document.createElement("button");
    del.className = "del-btn";
    del.textContent = "Delete";
    del.onclick = () => removePrompt(item.id);

    top.appendChild(t);
    top.appendChild(del);

    const c = document.createElement("div");
    c.className = "prompt-content";
    c.textContent = item.content;

    card.appendChild(top);
    card.appendChild(c);

    if(item.rating){
      const badge = document.createElement("span");
      badge.className = "badge " + item.rating;
      badge.textContent = RATING_LABELS[item.rating];
      card.appendChild(badge);
    }

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
