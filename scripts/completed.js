
document.addEventListener('DOMContentLoaded', () => {
    const completedList = document.getElementById('completed-list');
    const deleteAllButton = document.getElementById('delete-all-completed');

    function loadCompletedTasks() {
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
        completedList.innerHTML = '';
        completedTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'completed-task';
            li.textContent = task;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => {
                completedTasks.splice(index, 1);
                localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
                loadCompletedTasks();
            });
            li.appendChild(deleteBtn);
            completedList.appendChild(li);
        });
    }

    deleteAllButton.addEventListener('click', () => {
        localStorage.setItem('completedTasks', JSON.stringify([]));
        loadCompletedTasks();
    });

    loadCompletedTasks();
});
