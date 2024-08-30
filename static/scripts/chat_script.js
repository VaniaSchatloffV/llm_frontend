function sendMessage(message){
    loadOneMessage(message);
    var submitButton = document.querySelector('#chat-form button[type="submit"]');
    var messageInput = document.getElementById('message');
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
}

document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var submitButton = document.querySelector('#chat-form button[type="submit"]');
    var messageInput = document.getElementById('message');

    // Deshabilitar el botón y el campo de entrada
    submitButton.disabled = true;
    messageInput.disabled = true;

    var message = messageInput.value;
    sendMessage(message)
    
});

function updateChatMessages(messages) {
    if(!messages){
        messages = []
    }
    var chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    messages.forEach(function(msg, index) {
        var messageDiv = document.createElement('div');
        if(msg.content.options){
            messageDiv.textContent = msg.content.text;
            if(index === messages.length - 1){
                msg.content.options.forEach(function(butt) {
                    var link = document.createElement('a');
                    link.className = 'chat-messages button a';
                    link.textContent = butt;
                    link.addEventListener('click', function() {
                        sendMessage(butt);
                    });
                    messageDiv.appendChild(link);
                })
                var submitButton = document.querySelector('#chat-form button[type="submit"]');
                var messageInput = document.getElementById('message');
                submitButton.disabled = true;
                messageInput.disabled = true;
            }
        }
        else if(msg.content.file_id){
            messageDiv.textContent = msg.content.text;
            var link = document.createElement('a');
            link.className = 'chat-messages button a';
            link.textContent = "Descargar";
            link.addEventListener('click', function() {
                downloadFile(msg.content.file_id, msg.content.file_type);
            });
            messageDiv.appendChild(link);
        }
        else{
            messageDiv.textContent = msg.content;
        }
        if(msg.role == "user"){
            messageDiv.style.textAlign = "right";
        }
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

function loadOneMessage(message) {
    var msg = {"role": "user", "content": message};
    fetch(getMessagesUrl).then(response => response.json()).then(data => {
        if(data.messages){
            data.messages.push(msg);
            updateChatMessages(data.messages);
        }else{
            updateChatMessages([msg]);
        }
        
    });
}

function open_sidebar() {
    document.getElementById("main").style.marginLeft = "25%";
    document.getElementById("mySidebar").style.width = "25%";
    document.getElementById("mySidebar").style.display = "block";
    //document.getElementById("openNav").style.display = 'none';
    document.getElementById("openNav").style.visibility = 'hidden';
    document.getElementById("openNav").style.pointerEvents = 'none';
    loadConversations();
}
  
function close_sidebar() {
    document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("mySidebar").style.display = "none";
    //document.getElementById("openNav").style.display = "inline-block";
    document.getElementById("openNav").style.visibility = 'visible';
    document.getElementById("openNav").style.pointerEvents = 'auto';

}

function loadConversations() {
    fetch(getConversationsUrl).then(response => response.json()).then(data => {
        updateConversations(data);
    });
}

function setConversationId(conversationId) {
    fetch(setConversationsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'conversation_id': conversationId
        })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            loadMessages();
        }
    });
}

function updateConversations(conversations) {
    var conversationsBar = document.getElementById('conversations');
    conversationsBar.innerHTML = '';

    // Nueva conversación
    var link_name = '+ Nueva conversación';
    var link = document.createElement('a');
    link.className = 'button conversation-link';
    link.textContent = link_name;
    link.addEventListener('click', function() {
        setConversationId(0);
        close_sidebar();
    });
    conversationsBar.appendChild(link);

    conversations.forEach(function(conversation) {
        var link_name = conversation.name ? conversation.name : 'Conversación ' + conversation.id;
        var container = document.createElement('div');
        container.className = 'conversation-container';
        var link = document.createElement('a');
        link.id = 'link-conversation-' + conversation.id;
        link.className = 'button conversation-link';
        link.textContent = link_name;
        link.addEventListener('click', function() {
            setConversationId(conversation.id);
            close_sidebar();
        });
        container.appendChild(link);
        var button = document.createElement('a');
        button.className = 'button conversation-link';
        button.textContent = '🖉';
        button.style.textAlign = "center";
        button.style.width = '50px'
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            changeConversationName(conversation.id);
        });
        container.appendChild(button);
        conversationsBar.appendChild(container);
    });
}


function changeConversationName(conversation_id){
    console.log(conversation_id);
}

function downloadFile(file_id, file_type) {
    console.log("Descargando archivo ")
    console.log(file_id);
    console.log(file_type);
}

// Cargar mensajes al cargar la página
loadMessages();
loadConversations();
