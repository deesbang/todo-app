document.addEventListener('DOMContentLoaded', () => {
    const pendingList = document.getElementById('pending-list');

    function loadPendingTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        pendingList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.textContent = task;
            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Complete';
            completeBtn.className = 'complete-btn';
            completeBtn.addEventListener('click', () => {
                const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
                completedTasks.push(task);
                localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                window.location.href = 'completed.html';
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
        });
    }

    loadPendingTasks();
});