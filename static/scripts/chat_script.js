document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var message = document.getElementById('message').value;

    fetch(sendMessageUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'message': message
        })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            document.getElementById('message').value = '';
            loadMessages();
        }
    });
});

function updateChatMessages(messages) {
    var chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    messages.forEach(function(msg) {
        var messageDiv = document.createElement('div');
        messageDiv.textContent = msg;
        chatMessages.appendChild(messageDiv);
    });
}

function loadMessages() {
    fetch(getMessagesUrl).then(response => response.json()).then(data => {
        updateChatMessages(data.messages);
    });
}

// Cargar mensajes al cargar la página
loadMessages();
