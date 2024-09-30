function getConversationTable(offset, limitValue, order_by, order_way) {
    fetch(getConversationsTableUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'limit': limitValue,
            'offset': offset,
            'order_by': order_by,
            'order_way': order_way
        })
    }).then(response => response.json()).then(data => {
        updateConversationsTable(data.data);
        updatePaginator(data.total, offset, limitValue, order_by, order_way);
    });
}

function updateConversationsTable(data) {
    var table_body = document.getElementById('body');
    table_body.innerHTML = '';
    data.forEach(element => {
        var row = document.createElement('tr');
        keys.forEach(key => {
            var value = element[key];
            var column = document.createElement('td');
            if(value != null){
                value = value.toString();
                if(value.includes("<br>")){
                    column.innerHTML = value;
                    column.style.textAlign = 'left';
                }else{
                    column.textContent = value
                    column.style.textAlign = 'center';
                }
            }
            row.appendChild(column)
        });
        table_body.appendChild(row);
    });
}

function updatePaginator(total, offset, limit, sort_by, sort_way) {
    var paginator = document.getElementById('paginator');
    paginator.innerHTML = '';  // Limpiar el contenido anterior

    var currentPage = Math.floor(offset / limit) + 1;
    var totalPages = Math.ceil(total / limit);
    var maxVisiblePages = 5; // Número máximo de páginas visibles en el rango central

    // Botón "Previous"
    var beforeButton = document.createElement('button');
    beforeButton.innerHTML = "&larr; Previous";
    beforeButton.disabled = currentPage === 1;
    if (currentPage > 1) {
        beforeButton.addEventListener('click', function(event) {
            event.stopPropagation();
            var prevOffset = offset - limit;
            getConversationTable(prevOffset >= 0 ? prevOffset : 0, limit, sort_by, sort_way);
        });
    }
    paginator.appendChild(beforeButton);

    function addPageButton(pageNum) {
        var button = document.createElement('button');
        button.innerHTML = pageNum;
        if (pageNum === currentPage) {
            button.className = 'active';
        }
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            var pageOffset = (pageNum - 1) * limit;
            getConversationTable(pageOffset, limit, sort_by, sort_way);
        });
        paginator.appendChild(button);
    }

    if (totalPages <= maxVisiblePages) {
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            addPageButton(pageNum);
        }
    } else {
        if (currentPage <= Math.floor(maxVisiblePages / 2)) {
            for (let pageNum = 1; pageNum <= maxVisiblePages; pageNum++) {
                addPageButton(pageNum);
            }
            paginator.appendChild(createEllipsis());
            addPageButton(totalPages);
        } 
        else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
            addPageButton(1);
            paginator.appendChild(createEllipsis());
            for (let pageNum = totalPages - maxVisiblePages + 1; pageNum <= totalPages; pageNum++) {
                addPageButton(pageNum);
            }
        }
        else {
            addPageButton(1);
            paginator.appendChild(createEllipsis());
            var startPage = currentPage - Math.floor(maxVisiblePages / 2);
            var endPage = currentPage + Math.floor(maxVisiblePages / 2);
            for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                addPageButton(pageNum);
            }
            paginator.appendChild(createEllipsis());
            addPageButton(totalPages);
        }
    }

    var afterButton = document.createElement('button');
    afterButton.innerHTML = "Next &rarr;";
    afterButton.disabled = currentPage === totalPages;
    if (currentPage < totalPages) {
        afterButton.addEventListener('click', function(event) {
            event.stopPropagation();
            var nextOffset = offset + limit;
            getConversationTable(nextOffset < total ? nextOffset : offset, limit, sort_by, sort_way);
        });
    }
    paginator.appendChild(afterButton);
}

function createEllipsis() {
    var ellipsis = document.createElement('span');
    ellipsis.innerHTML = '...';
    ellipsis.className = 'ellipsis';
    return ellipsis;
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

function filter(){
    var sort = document.getElementById("sort");
    var sortWay = document.getElementById("sort_way");
    var limit = document.getElementById("limit");

    sortValue = sort.value;
    sortWayValue = sortWay.value;
    limitValue = limit.value;
    getConversationTable(0, limitValue, sortValue, sortWayValue);

}

createConversationTableHeader();
filter();