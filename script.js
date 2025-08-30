document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const scanBarcodeBtn = document.getElementById('scanBarcodeBtn');
    const taskList = document.getElementById('task-list');
    const barcodePrompt = document.getElementById('barcodePrompt');
    const closePromptBtn = document.getElementById('closePromptBtn');
    const scanLink = document.getElementById('scanLink');
    const browserScanBtn = document.getElementById('browserScanBtn');

    if (!taskInput || !addTaskBtn || !scanBarcodeBtn || !taskList || !barcodePrompt || !closePromptBtn || !scanLink || !browserScanBtn) {
        console.error('One or more elements not found');
        return;
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
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
                loadTasks();
                new Audio('https://www.soundjay.com/buttons/button-3.mp3').play();
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => {
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                loadTasks();
            });

            li.appendChild(completeBtn);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    function addTask(task) {
        if (task) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
            loadTasks();
        }
    }

    addTaskBtn.addEventListener('click', () => {
        const task = taskInput.value.trim();
        addTask(task);
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    scanBarcodeBtn.addEventListener('click', () => {
        barcodePrompt.style.display = 'flex';
        taskInput.focus();
    });

    closePromptBtn.addEventListener('click', () => {
        barcodePrompt.style.display = 'none';
        taskInput.focus();
    });

    scanLink.addEventListener('click', () => {
        setTimeout(() => {
            barcodePrompt.style.display = 'none';
            taskInput.focus();
        }, 1500);
    });

    browserScanBtn.addEventListener('click', async () => {
        barcodePrompt.style.display = 'none';
        taskInput.focus();
        if ('BarcodeDetector' in window) {
            try {
                const barcodeDetector = new BarcodeDetector({ formats: ['qr_code', 'ean_13', 'upc_a', 'code_39'] });
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                const video = document.createElement('video');
                video.style.display = 'none';
                document.body.appendChild(video);
                video.srcObject = stream;
                await video.play();

                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');

                async function scan() {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    try {
                        const barcodes = await barcodeDetector.detect(canvas);
                        if (barcodes.length > 0) {
                            addTask(barcodes[0].rawValue);
                            video.srcObject.getTracks().forEach(track => track.stop());
                            document.body.removeChild(video);
                            return;
                        }
                    } catch (err) {
                        console.error('Barcode detection error:', err);
                    }
                    requestAnimationFrame(scan);
                }

                scan();
            } catch (err) {
                console.error('Camera access error:', err);
                alert('Failed to access camera. Please use a scanner app and paste the result.');
            }
        } else {
            alert('Barcode scanning not supported in this browser. Please use a scanner app.');
        }
    });

    // Nickname setup
    const nicknameModal = document.getElementById('nickname-modal');
    const nicknameInput = document.getElementById('nickname-input');
    const submitNicknameBtn = document.getElementById('submit-nickname-btn');
    const closeNicknameBtn = document.getElementById('close-nickname-btn');

    if (!nicknameModal || !nicknameInput || !submitNicknameBtn || !closeNicknameBtn) {
        console.error('Nickname elements not found');
        return;
    }

    if (!localStorage.getItem('nickname')) {
        nicknameModal.style.display = 'flex';
    }

    submitNicknameBtn.addEventListener('click', () => {
        const nickname = nicknameInput.value.trim();
        if (nickname) {
            localStorage.setItem('nickname', nickname);
            nicknameModal.style.display = 'none';
        }
    });

    closeNicknameBtn.addEventListener('click', () => {
        nicknameModal.style.display = 'none';
    });

    loadTasks();
});