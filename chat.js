import { db } from './firebase-config.js';
import { ref, onValue, push, remove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const backToTodoBtn = document.getElementById('back-to-todo-btn');
    const passwordModal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('password-input');
    const submitPasswordBtn = document.getElementById('submit-password-btn');
    const closePasswordBtn = document.getElementById('close-password-btn');
    const changeNicknameBtn = document.getElementById('change-nickname-btn');

    if (!chatMessages || !messageInput || !sendMessageBtn || !clearChatBtn || !backToTodoBtn || !passwordModal || !passwordInput || !submitPasswordBtn || !closePasswordBtn || !changeNicknameBtn) {
        console.error('One or more elements not found');
        return;
    }

    const correctPassword = 'paroll'; // Change this to your desired password

    if (!localStorage.getItem('passwordValidated')) {
        passwordModal.style.display = 'flex';
    }

    submitPasswordBtn.addEventListener('click', () => {
        const enteredPassword = passwordInput.value.trim();
        if (enteredPassword === correctPassword) {
            localStorage.setItem('passwordValidated', 'true');
            passwordModal.style.display = 'none';
            loadChat();
        } else {
            alert('Incorrect password. Please try again.');
            passwordInput.value = '';
        }
    });

    closePasswordBtn.addEventListener('click', () => {
        passwordModal.style.display = 'none';
        window.location.href = 'index.html';
    });

    function loadChat() {
        let currentNickname = localStorage.getItem('nickname'); // Make it a let to allow updates
        if (!currentNickname) {
            window.location.href = 'index.html';
            return;
        }

        const messagesRef = ref(db, 'messages');

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
            remove(messagesRef);
        });

        backToTodoBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessageBtn.click();
        });

        loadMessages();

        changeNicknameBtn.addEventListener('click', () => {
            const newNickname = prompt('Enter your new nickname:');
            if (newNickname && newNickname.trim().length > 0) {
                localStorage.setItem('nickname', newNickname.trim());
                currentNickname = newNickname.trim(); // Update the variable
                alert('Nickname updated! Future messages will use the new nickname.');
                loadMessages(); // Refresh to reflect the new nickname
            } else {
                alert('Nickname cannot be empty.');
            }
        });
    }

    if (localStorage.getItem('passwordValidated')) {
        loadChat();
    }
});