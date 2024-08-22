document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var submitButton = document.querySelector('#chat-form button[type="submit"]');
    var messageInput = document.getElementById('message');

    // Deshabilitar el botón y el campo de entrada
    submitButton.disabled = true;
    messageInput.disabled = true;

    var message = messageInput.value;

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
            messageInput.value = '';
            loadMessages();
        }
        // Volver a habilitar el botón y el campo de entrada
        submitButton.disabled = false;
        messageInput.disabled = false;
    }).catch(error => {
        console.error('Error:', error);
        // Volver a habilitar el botón y el campo de entrada si ocurre un error
        submitButton.disabled = false;
        messageInput.disabled = false;
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
    // Desplazarse al final del contenedor de mensajes
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function loadMessages() {
    fetch(getMessagesUrl).then(response => response.json()).then(data => {
        updateChatMessages(data.messages);
    });
}

// Cargar mensajes al cargar la página
loadMessages();
