
function renderCompletedTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTaskList = document.getElementById('completedTaskList');
    completedTaskList.innerHTML = '';
    
    tasks.forEach(task => {
        if (task.completed) {
            const li = document.createElement('li');
            li.className = 'completed-task';
            li.textContent = task.text;
            completedTaskList.appendChild(li);
        }
    });
}

document.addEventListener('DOMContentLoaded', renderCompletedTasks);
