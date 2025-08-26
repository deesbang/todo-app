
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Tasks saved to localStorage from pending.js:', tasks);
}

function deleteTask(index) {
    console.log('Deleting task at index from pending.js:', index);
    tasks.splice(index, 1);
    saveTasks();
    renderPendingTasks();
}

function completeTask(index) {
    console.log('Completing task at index from pending.js:', index);
    tasks[index].completed = true;
    saveTasks();
    playCompleteSound();
    renderPendingTasks();
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

function renderPendingTasks() {
    const pendingTaskList = document.getElementById('pendingTaskList');
    pendingTaskList.innerHTML = '';
    
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
            pendingTaskList.appendChild(li);
        }
    });
    console.log('Tasks rendered on pending.html:', tasks.filter(task => !task.completed));
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initial tasks loaded in pending.js:', tasks);
    renderPendingTasks();
});
