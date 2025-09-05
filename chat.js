import { db } from './firebase-config.js';
import { ref, onValue, push, remove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

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
    const messagesRef = ref(db, 'messages'); // Line 21

    function loadMessages() {
        onValue(messagesRef, (snapshot) => {
            chatMessages.innerHTML = '';
            const messages = snapshot.val() || {};
            Object.values(messages).forEach(message => {
                const container = document.createElement('div');
                const timestamp = document.createElement('span');
                const bubble = document.createElement('div');
                const username = document.createElement('span');
                username.className = 'username';
                username.textContent = message.nickname;
                username.style.fontSize = '10px';
                const date = new Date(message.timestamp);
                const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                timestamp.className = 'timestamp';
                timestamp.textContent = timeString;
                bubble.className = 'message-bubble';
                bubble.textContent = message.text;
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
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }

    sendMessageBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message && currentNickname) {
            const timestamp = new Date().toISOString();
            push(messagesRef, { nickname: currentNickname, text: message, timestamp });
            messageInput.value = '';
        }
    });

    clearChatBtn.addEventListener('click', () => {
        remove(messagesRef); // Clears all messages from the database
    });

    backToTodoBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessageBtn.click();
    });

    loadMessages();
});