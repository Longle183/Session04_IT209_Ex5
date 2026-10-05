// TaskFlow - Initial Base App Logic
let tasks = [
  { id: 1, title: 'Thiết kế giao diện ứng dụng TaskFlow', priority: 'high', completed: true },
  { id: 2, title: 'Tìm hiểu cơ chế Git Reset (--soft, --mixed, --hard)', priority: 'medium', completed: false },
  { id: 3, title: 'Tìm hiểu cơ chế Git Revert và cách làm việc nhóm', priority: 'high', completed: false }
];

const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addBtn = document.getElementById('addBtn');
const totalTasksEl = document.getElementById('totalTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const completedTasksEl = document.getElementById('completedTasks');

function renderTasks(items = tasks) {
  taskList.innerHTML = '';
  items.forEach(task => {
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

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Khởi chạy ban đầu
renderTasks();
