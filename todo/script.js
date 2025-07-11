const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const prioritySelect = document.getElementById("priority-select");
const list = document.getElementById("todo-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  list.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = todo.text;
    if (todo.completed) li.classList.add("completed");

    // Double click to edit
    span.addEventListener("dblclick", () => {
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.className = "edit-input";
      inputEdit.value = todo.text;

      inputEdit.addEventListener("blur", () => {
        todo.text = inputEdit.value.trim() || todo.text;
        saveTodos();
        renderTodos();
      });

      span.replaceWith(inputEdit);
      inputEdit.focus();
    });

    // Click to toggle completed
    span.addEventListener("click", () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    const priority = document.createElement("span");
    priority.textContent = todo.priority;
    priority.className = `priority-badge ${todo.priority}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(span);
    li.appendChild(priority);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const priority = prioritySelect.value;
  if (text) {
    todos.push({ text, completed: false, priority });
    input.value = "";
    prioritySelect.value = "medium";
    saveTodos();
    renderTodos();
  }
});

renderTodos();

let currentFilter = "all"; // New state

function renderTodos() {
  list.innerHTML = "";

  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  filteredTodos.forEach((todo, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = todo.text;
    if (todo.completed) li.classList.add("completed");

    span.addEventListener("dblclick", () => {
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.className = "edit-input";
      inputEdit.value = todo.text;

      inputEdit.addEventListener("blur", () => {
        todo.text = inputEdit.value.trim() || todo.text;
        saveTodos();
        renderTodos();
      });

      span.replaceWith(inputEdit);
      inputEdit.focus();
    });

    span.addEventListener("click", () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    const priority = document.createElement("span");
    priority.textContent = todo.priority;
    priority.className = `priority-badge ${todo.priority}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(span);
    li.appendChild(priority);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// Filter buttons logic
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    renderTodos();
  });
});

// Dark mode toggle
const themeToggle = document.getElementById("theme-switch");
const isDarkMode = localStorage.getItem("theme") === "dark";

if (isDarkMode) {
  document.body.classList.add("dark");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  const newTheme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
});
