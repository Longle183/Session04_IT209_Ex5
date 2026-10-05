// TaskFlow - App Logic with Filter, Search & Fixed Sort
let tasks = [
  { id: 1, title: 'Thiết kế giao diện ứng dụng TaskFlow', priority: 'high', completed: true },
  { id: 2, title: 'Tìm hiểu cơ chế Git Reset (--soft, --mixed, --hard)', priority: 'medium', completed: false },
  { id: 3, title: 'Tìm hiểu cơ chế Git Revert và cách làm việc nhóm', priority: 'high', completed: false }
];

let sortDirection = 'desc'; // desc = Mới nhất, asc = Cũ nhất

const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addBtn = document.getElementById('addBtn');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const sortBtn = document.getElementById('sortBtn');
const totalTasksEl = document.getElementById('totalTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const completedTasksEl = document.getElementById('completedTasks');

function getFilteredTasks() {
  const keyword = searchInput.value.toLowerCase().trim();
  const status = filterStatus.value;

  return tasks.filter(task => {
    const matchesKeyword = task.title.toLowerCase().includes(keyword);
    const matchesStatus = status === 'all' ||
      (status === 'completed' && task.completed) ||
      (status === 'pending' && !task.completed);
    return matchesKeyword && matchesStatus;
  });
}

function renderTasks(items = null) {
  const displayItems = items !== null ? items : getFilteredTasks();
  taskList.innerHTML = '';
  displayItems.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'task-completed' : ''}`;
    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
        <span class="task-title">${task.title}</span>
        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
      </div>
      <button class="btn-delete" onclick="deleteTask(${task.id})">Xóa</button>
    `;
    taskList.appendChild(li);
  });
  updateStats();
}

function updateStats() {
  totalTasksEl.textContent = tasks.length;
  pendingTasksEl.textContent = tasks.filter(t => !t.completed).length;
  completedTasksEl.textContent = tasks.filter(t => t.completed).length;
}

function addTask() {
  const title = taskInput.value.trim();
  if (!title) return;

  const newTask = {
    id: Date.now(),
    title,
    priority: prioritySelect.value,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = '';
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

// Fixed: sắp xếp theo ID (đại diện thời gian tạo) đúng cú pháp
function sortTasks() {
  sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
  const label = sortDirection === 'desc' ? 'Mới nhất' : 'Cũ nhất';
  sortBtn.textContent = `Sắp xếp: ${label}`;

  tasks.sort((a, b) => sortDirection === 'desc' ? b.id - a.id : a.id - b.id);
  renderTasks();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

searchInput.addEventListener('input', () => renderTasks());
filterStatus.addEventListener('change', () => renderTasks());
sortBtn.addEventListener('click', sortTasks);

// Khởi chạy ban đầu
renderTasks();
