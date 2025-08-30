document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const backToTodoBtn = document.getElementById('back-to-todo-btn');

    if (!chatMessages || !messageInput || !sendMessageBtn || !clearChatBtn || !backToTodoBtn) {
        console.error('One or more elements not found');
        return;
    }

    if (!localStorage.getItem('nickname')) {
        window.location.href = 'index.html';
        return;
    }

    const currentNickname = localStorage.getItem('nickname');

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        chatMessages.innerHTML = '';
        messages.forEach(message => {
            const container = document.createElement('div');
            container.className = 'message-container'; // New container for better control
            const timestamp = document.createElement('span');
            const bubble = document.createElement('div');
            const username = document.createElement('span');
            username.className = 'username';
            username.textContent = message.nickname;
            username.style.fontSize = '10px'; // Inline style for font size
            console.log('Setting username fontSize to 10px for:', message.nickname);
            const date = new Date(message.timestamp);
            const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            timestamp.className = 'timestamp';
            timestamp.textContent = timeString;
            bubble.className = 'message-bubble';
            bubble.textContent = message.text; // Only the message text
            container.appendChild(timestamp);
            container.appendChild(username);
            container.appendChild(bubble);
            if (message.nickname === currentNickname) {
                container.classList.add('right');
            } else {
                container.classList.add('left');
            }
            chatMessages.appendChild(container);
        });
        // Ensure scroll to bottom after rendering
        chatMessages.scrollTop = chatMessages.scrollHeight; // Immediate scroll
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight; // Fallback
        }, 0);
    }

    sendMessageBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        const nickname = localStorage.getItem('nickname');
        if (message && nickname) {
            const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
            const timestamp = new Date().toISOString();
            messages.push({ nickname, text: message, timestamp });
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            messageInput.value = '';
            loadMessages();
        }
    });

    clearChatBtn.addEventListener('click', () => {
        localStorage.removeItem('chatMessages');
        loadMessages(); // Reload to reflect cleared state
    });

    backToTodoBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });

    loadMessages();
});