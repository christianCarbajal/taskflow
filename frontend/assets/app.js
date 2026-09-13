const API_BASE = "http://localhost:8001/api";

async function fetchTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error("Errore nel caricamento dei task");
  return res.json();
}

function renderDashboardTable(tasks) {
  const body = document.getElementById("task-table-body");
  if (!body) return;
  body.innerHTML = "";
  for (const task of tasks) {
    const card = document.createElement("div");
    card.className = `task-card status-${task.status}`;
    card.innerHTML = `
      <div class="task-title">${task.title}</div>
      <div class="task-owner">${task.owner || "non assegnato"} · ${task.status}</div>
    `;
    body.appendChild(card);
  }
}

function renderBoardColumns(tasks) {
  const columns = {
    todo: document.getElementById("col-todo"),
    in_progress: document.getElementById("col-in_progress"),
    done: document.getElementById("col-done"),
  };
  if (!columns.todo) return;

  for (const key in columns) {
    columns[key].innerHTML = "";
  }

  for (const task of tasks) {
    const col = columns[task.status] || columns.todo;
    const card = document.createElement("div");
    card.className = `task-card status-${task.status}`;
    card.innerHTML = `
      <div class="task-title">${task.title}</div>
      <div class="task-owner">${task.owner || "non assegnato"}</div>
    `;
    col.appendChild(card);
  }
}

async function initPage() {
  try {
    const tasks = await fetchTasks();
    renderDashboardTable(tasks);
    renderBoardColumns(tasks);
  } catch (err) {
    console.error(err);
    const main = document.querySelector("main");
    if (main) {
      const p = document.createElement("p");
      p.textContent = "Impossibile caricare i task. Il backend è avviato?";
      main.prepend(p);
    }
  }
}

document.addEventListener("DOMContentLoaded", initPage);
