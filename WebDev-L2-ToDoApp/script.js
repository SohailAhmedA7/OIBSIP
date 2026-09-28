const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const inputError = document.getElementById("input-error");

const pendingTasksContainer = document.getElementById("pending-tasks");
const completedTasksContainer = document.getElementById("completed-tasks");

const pendingEmpty = document.getElementById("pending-empty");
const completedEmpty = document.getElementById("completed-empty");

const totalCount = document.getElementById("total-count");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");

const pendingBadge = document.getElementById("pending-badge");
const completedBadge = document.getElementById("completed-badge");

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

function generateId() {
    return Date.now() + Math.random();
}

function formatDate(date) {
    return new Date(date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function updateCounters() {
    const pending = tasks.filter(task => !task.completed).length;
    const completed = tasks.filter(task => task.completed).length;

    totalCount.textContent = tasks.length;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;

    pendingBadge.textContent = pending;
    completedBadge.textContent = completed;
}

function createTaskElement(task) {
    const taskItem = document.createElement("div");

    taskItem.className = `task-item ${
        task.completed ? "completed" : ""
    }`;

    taskItem.dataset.id = task.id;

    taskItem.innerHTML = `
        <input
            type="checkbox"
            class="task-checkbox"
            ${task.completed ? "checked" : ""}
            aria-label="Mark task as completed"
        >

        <div class="task-content">
            <div class="task-title">${escapeHTML(task.title)}</div>
            <div class="task-time">
                ${formatDate(task.createdAt)}
            </div>
        </div>

        <div class="task-actions">
            <button
                class="edit-button"
                type="button"
                title="Edit task"
            >
                ✏️
            </button>

            <button
                class="delete-button"
                type="button"
                title="Delete task"
            >
                🗑️
            </button>
        </div>
    `;

    const checkbox = taskItem.querySelector(".task-checkbox");
    const editButton = taskItem.querySelector(".edit-button");
    const deleteButton = taskItem.querySelector(".delete-button");

    checkbox.addEventListener("change", () => {
        toggleTask(task.id);
    });

    editButton.addEventListener("click", () => {
        editTask(task.id);
    });

    deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
    });

    return taskItem;
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function renderTasks() {
    pendingTasksContainer.innerHTML = "";
    completedTasksContainer.innerHTML = "";

    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    pendingTasks.forEach(task => {
        pendingTasksContainer.appendChild(
            createTaskElement(task)
        );
    });

    completedTasks.forEach(task => {
        completedTasksContainer.appendChild(
            createTaskElement(task)
        );
    });

    pendingEmpty.style.display =
        pendingTasks.length === 0 ? "block" : "none";

    completedEmpty.style.display =
        completedTasks.length === 0 ? "block" : "none";

    updateCounters();
}

function addTask(title) {
    const newTask = {
        id: generateId(),
        title: title,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);

    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const updatedTitle = prompt(
        "Edit your task:",
        task.title
    );

    if (updatedTitle === null) {
        return;
    }

    const cleanTitle = updatedTitle.trim();

    if (cleanTitle === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.title = cleanTitle;

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    const shouldDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!shouldDelete) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    inputError.textContent = "";

    if (title === "") {
        inputError.textContent = "Please enter a task.";
        return;
    }

    addTask(title);

    taskInput.value = "";
    taskInput.focus();
});

renderTasks();