document.addEventListener('DOMContentLoaded', () => {
    const completedList = document.getElementById('completed-list');
    const deleteAllButton = document.getElementById('delete-all-completed');

    function loadCompletedTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        completedList.innerHTML = '';
        tasks.forEach((task, index) => {
            if (task.completed) {
                const li = document.createElement('li');
                li.className = 'completed-task';
                li.textContent = task.text;
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'delete-btn';
                deleteBtn.addEventListener('click', () => {
                    tasks.splice(index, 1);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    loadCompletedTasks();
                });
                li.appendChild(deleteBtn);
                completedList.appendChild(li);
            }
        });
    }

    deleteAllButton.addEventListener('click', () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => !task.completed);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        loadCompletedTasks();
    });

    loadCompletedTasks();
});