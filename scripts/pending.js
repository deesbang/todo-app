document.addEventListener('DOMContentLoaded', () => {
    const pendingList = document.getElementById('pending-list');

    function loadPendingTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        pendingList.innerHTML = '';
        tasks.forEach((task, index) => {
            if (!task.completed) {
                const li = document.createElement('li');
                li.textContent = task.text;
                const completeBtn = document.createElement('button');
                completeBtn.textContent = 'Complete';
                completeBtn.className = 'complete-btn';
                completeBtn.addEventListener('click', () => {
                    task.completed = true;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    loadPendingTasks();
                    new Audio('https://www.soundjay.com/buttons/button-3.mp3').play();
                });
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'delete-btn';
                deleteBtn.addEventListener('click', () => {
                    tasks.splice(index, 1);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    loadPendingTasks();
                });
                li.appendChild(completeBtn);
                li.appendChild(deleteBtn);
                pendingList.appendChild(li);
            }
        });
    }

    loadPendingTasks();
});