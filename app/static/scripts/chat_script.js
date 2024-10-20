const loadingSpinnerChat = document.getElementById('loading-spinner-conversation');
const loadingSpinnerSidebar = document.getElementById('loading-spinner-sidebar');

function showButtonSpinner(){
    let button = document.getElementById('metric-send');
    button.innerHTML = '<div class="spinner"></div>';
    button.disabled = true;
}

function hideButtonSpinner(){
    let button = document.getElementById('metric-send');
    button.innerHTML = "Enviar";
    button.disabled = false;
}

async function sendMessage(message){
    await loadOneMessage(message);
    var submitButton = document.getElementById('submit-chat-button');
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

    document.getElementById('form').addEventListener('submit', function(event) {
        event.preventDefault();

        var submitButton = document.getElementById('submit-chat-button');
        var messageInput = document.getElementById('message');

        // Deshabilitar el botón y el campo de entrada
        submitButton.disabled = true;
        messageInput.disabled = true;

        var message = messageInput.value;
        sendMessage(message);
        
});

async function updateChatMessages(messages) {
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
                var submitButton = document.getElementById('submit-chat-button');
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
            fetch(checkFileUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'file_id': msg.content.file_id
                })
            }).then(response => response.json()).then(data => {
                if(data.result){
                    link.title = "";
                    link.addEventListener('click', function() {
                        link.innerHTML = 'Archivo se está descargando...';
                        link.classList.add('disabled');
                        downloadFile(msg.content.file_id, msg.content.file_type, link);
                    });
                }else{
                    link.classList.add('disabled');
                    link.textContent = "Archivo no disponible";
                    link.title = "Archivo ya no está disponible";
                }
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
    loadingSpinnerChat.style.display = 'none';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


async function loadMessages() {
    loadingSpinnerChat.style.display = 'block';
    fetch(getMessagesUrl).then(response => response.json()).then(data => {
        updateChatMessages(data.messages);
    });
}

async function loadOneMessage(message) {
    var msg = {"role": "user", "content": message};
    fetch(getMessagesUrl).then(response => response.json()).then(data => {
        loadingSpinnerChat.style.display = 'block';
        if(data.messages){
            data.messages.push(msg);
            updateChatMessages(data.messages);
        }else{
            updateChatMessages([msg]);
        }
        loadingSpinnerChat.style.display = 'none';
        
    });
}

function loadConversations() {
    loadingSpinnerSidebar.style.display = 'block';
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
            loadingSpinnerChat.style.display = 'block';
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
    link.className = 'button sidebar-link';
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
        link.className = 'button sidebar-link';
        link.textContent = link_name;
        link.addEventListener('click', function() {
            setConversationId(conversation.id);
            close_sidebar();
        });
        container.appendChild(link);
        var button = document.createElement('a');
        button.className = 'button sidebar-link';
        button.textContent = '🖉';
        button.title = "Cambiar nombre a conversacion";
        button.style.textAlign = "center";
        button.style.width = '50px'
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            changeConversationName(conversation.id, button, link);
        });
        var button_calificar = document.createElement('a');
        button_calificar.id = "calification-button";
        button_calificar.className = 'button sidebar-link';
        button_calificar.textContent = conversation.qualified? '★':'☆';
        button_calificar.title = "Calificar conversación";
        button_calificar.style.textAlign = "center";
        button_calificar.style.width = '50px'
        button_calificar.addEventListener('click', function(event) {
            if (conversation.qualified) {
                if (confirm("Ya ha calificado esta conversación. ¿Desea calificarla nuevamente?")){
                    startModalCreateRole(conversation.id);
                }
            } else {
                event.stopPropagation();
                startModalCreateRole(conversation.id);
            }
        });
        container.appendChild(button);
        container.appendChild(button_calificar);
        conversationsBar.appendChild(container);
    });
    loadingSpinnerSidebar.style.display = 'none';
}


function changeConversationName(conversation_id, button, link) {
    button.disabled = true;
    var input = document.createElement('input');
    input.type = 'text';
    input.value = link.textContent;
    input.className = 'input-conversation-name';
    link.innerHTML = '';
    link.appendChild(input);
    input.focus();
    input.addEventListener('blur', function() {
        link.textContent = input.value;
    });
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if(input.value == ''){
                link.textContent = "Conversación " + conversation_id;
            }else{
                link.textContent = input.value;
            }
            fetch(changeNameUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'conversation_id': conversation_id,
                    'name' : input.value
                })
            }).then(
                button.disabled = false
            );
        }
    });
}

function downloadFile(file_id, file_type, link){
    fetch(downloadFileUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'file_id': file_id,
            'file_type': file_type
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    }).then(blob => {
        // Crear un enlace temporal para descargar el archivo
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = file_id + '.' + file_type; // Usa el nombre de archivo deseado
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); // Liberar memoria
        document.body.removeChild(a);
        link.classList.remove('disabled');
        link.innerHTML = 'Descargar';
    }).catch(error => {
        console.error('Error al descargar el archivo:', error);
        link.classList.remove('disabled');
        link.innerHTML = 'Descargar';
    });
}


// Cargar mensajes al cargar la página
loadMessages();
loadConversations();


function startModalCreateRole(conversation_id) {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    
    let selectedStar = null;
    
    const button = document.getElementById('metric-send');
    
    document.querySelectorAll('.star').forEach(star => {
        star.removeEventListener('click', handleStarClick);
        star.addEventListener('click', handleStarClick);
    });
    
    function handleStarClick() {
        selectedStar = this.value;
    }
    
    button.removeEventListener('click', handleSendMetrics);
    button.addEventListener('click', handleSendMetrics);
    
    function handleSendMetrics() {
        showButtonSpinner();
        const respuestas = {};
        let preguntasCompletas = false;

        document.querySelectorAll('.modal-input').forEach(input => {
            const preguntaId = input.id;
            const preguntaTexto = document.getElementById(`label${preguntaId}`).innerText;
            const respuesta = input.value;
            
            if (respuesta) preguntasCompletas = true;
            
            respuestas[`${preguntaTexto}`] = respuesta ;
        });

        if (!selectedStar) {
            alert("Por favor, califique la conversación.");
            hideButtonSpinner();
        } else if (!preguntasCompletas) {
            alert("Por favor, rellene al menos una respuesta.");
            hideButtonSpinner();
        } else {
            fetch(sendMetricUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'conversation_id': conversation_id,
                    "questions": respuestas,
                    "calification": selectedStar
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    modal.style.display = 'none';
                    resetModalInputs();
                    hideButtonSpinner();
                    document.getElementById("calification-button").innerText = '★';
                } else {
                    alert('Error al enviar los datos.');
                }
                
            });
        }
    }

    const modalCloseButton = document.getElementById("x");
    modalCloseButton.removeEventListener('click', handleCloseModal);
    modalCloseButton.addEventListener('click', handleCloseModal);
    
    function handleCloseModal() {
        modal.style.display = 'none';
        resetModalInputs();
    }

    function resetModalInputs() {
        document.querySelectorAll('.modal-input').forEach(input => {
            input.value = "";
        });
        selectedStar = null;
    }
}

