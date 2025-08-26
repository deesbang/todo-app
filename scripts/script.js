
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Tasks saved to localStorage:', tasks);
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    tasks.push({ text: taskText, completed: false });
    console.log('Task added:', taskText);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

function deleteTask(index) {
    console.log('Deleting task at index:', index);
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function completeTask(index) {
    console.log('Completing task at index:', index);
    tasks[index].completed = true;
    saveTasks();
    playCompleteSound();
    renderTasks();
}

function playCompleteSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        if (!task.completed) {
            const li = document.createElement('li');
            li.innerHTML = `
                ${task.text}
                <div>
                    <button class="complete-btn" onclick="completeTask(${index})">Complete</button>
                    <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        }
    });
    console.log('Tasks rendered on index.html:', tasks.filter(task => !task.completed));
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initial tasks loaded:', tasks);
    renderTasks();
});
