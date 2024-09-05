var limit = 3;

function getConversationTable(offset) {
    fetch(getConversationsTableUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'limit': limit,
            'offset': offset
        })
    }).then(response => response.json()).then(data => {
        updateConversationsTable(data.data);
        updatePaginator(data.total, offset, limit, data.next_offset);
    });
}

function updateConversationsTable(data) {
    var table_body = document.getElementById('body');
    table_body.innerHTML = '';
    data.forEach(element => {
        var row = document.createElement('tr');
        keys.forEach(key => {
            var column = document.createElement('td');
            column.textContent = element[key];
            column.style.textAlign = 'center';
            row.appendChild(column)
        });
        table_body.appendChild(row);
    });
}

function updatePaginator(total, offset, limit) {
    var paginator = document.getElementById('paginator');
    paginator.innerHTML = '';  // Limpiar el contenido anterior

    var currentPage = Math.floor(offset / limit) + 1;
    var totalPages = Math.ceil(total / limit);

    // Botón "Previous"
    var beforeButton = document.createElement('button');
    beforeButton.innerHTML = "&larr; Previous";
    beforeButton.disabled = true;
    if (offset > 0) {
        beforeButton.disabled = false;
        beforeButton.addEventListener('click', function(event) {
            event.stopPropagation();
            var prevOffset = offset - limit;
            getConversationTable(prevOffset >= 0 ? prevOffset : 0);
        });
    }
    paginator.appendChild(beforeButton);

    // Botones de páginas numeradas
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        var button = document.createElement('button');
        button.innerHTML = pageNum;
        if (pageNum === currentPage) {
            button.className = 'active';
        }
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            var pageOffset = (pageNum - 1) * limit;
            getConversationTable(pageOffset);
        });
        paginator.appendChild(button);
    }

    // Botón "Next"
    var afterButton = document.createElement('button');
    afterButton.innerHTML = "Next &rarr;";
    afterButton.disabled = true;
    if (offset + limit < total) {
        afterButton.disabled = false;
        afterButton.addEventListener('click', function(event) {
            event.stopPropagation();
            var nextOffset = offset + limit;
            getConversationTable(nextOffset < total ? nextOffset : offset);
        });
    }
    paginator.appendChild(afterButton);
}


function createConversationTableHeader(){
    var table_index = document.getElementById('index');
    
    keys = ["Id conversación", "Id usuario", "Mensaje inicial", "Consulta generada"];
    
    keys.forEach(key =>{
        var column = document.createElement('th');
        column.textContent = key;
        column.style.textAlign = 'center';
        table_index.appendChild(column);
    });
}
createConversationTableHeader();
getConversationTable(0);