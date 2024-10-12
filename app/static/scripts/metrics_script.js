function getMetricTable(offset, limitValue, order_by, order_way) {
    fetch(getMetricTableUrl, {
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
        updateTable(data.data);
        updatePaginator(data.total, offset, limitValue, order_by, order_way, getMetricTable);
    });
}

function updateTable(data) {
    var table_body = document.getElementById('body');
    table_body.innerHTML = '';
    data.forEach(element => {
        var row = document.createElement('tr');
        keys.forEach(key => {
            var value = element[key];
            if (key == "Preguntas"){
                var boton_preguntas = document.createElement('button');
                boton_preguntas.className = "orange-button";
                boton_preguntas.innerText = "Ver respuestas";
                boton_preguntas.addEventListener('click', function(){
                    loadModalRespuestas(value);
                });
                row.appendChild(boton_preguntas);
            } else {
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
            }
            
        });
        table_body.appendChild(row);
    });
}

function loadModalRespuestas(values) {
    const modal = document.getElementById('modal');
    const modalContainer = document.getElementById('container-small');
    
    modal.style.display = 'block';

    modalContainer.innerHTML = '';

    const modalCloseButton = createElement("span", "modal-button", "x");
    modalCloseButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    const modalTitle = createElement("h2", "", `Preguntas y respuestas de métricas`);

    const table = createQuestionTable(values);
    
    modalContainer.append(modalCloseButton, modalTitle, document.createElement("br"), table);
}

function createElement(tag, className = "", innerHTML = "") {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
}

function createQuestionTable(values) {
    const tableDiv = createElement("div", "table-container");
    const table = createElement("table", "table");
    table.id = "tablapreguntas";
    
    // Encabezado de la tabla
    const header = createElement("thead");
    const headerRow = createElement("tr");
    const col1 = createElement("th", "", "Pregunta");
    const col2 = createElement("th", "", "Respuesta");
    
    headerRow.append(col1, col2, createElement("th")); // Columna vacía adicional
    header.appendChild(headerRow);
    table.appendChild(header);
    
    const tableBody = createElement("tbody");

    // Iterar sobre las claves del diccionario
    Object.keys(values).forEach(key => {
        const question = values[key]; // Obtener cada diccionario de pregunta y respuesta
        const row = createElement("tr");
        const pregunta = createElement("td", "", question.question);
        pregunta.textAlign = "center";
        const respuesta = createElement("td", "", question.answer);
        respuesta.textAlign = "center";

        row.append(pregunta, respuesta);
        tableBody.appendChild(row); // Añadir la fila al cuerpo de la tabla
    });
    
    table.appendChild(tableBody); // Añadir el cuerpo de la tabla fuera del bucle
    tableDiv.appendChild(table);  // Añadir la tabla al contenedor

    return tableDiv; // Retorna la tabla completa
}



function createTableHeader(){
    var table_index = document.getElementById('index');
    
    keys = ["Id métrica", "Id conversación", "Id usuario", "Calificación (valor máximo 5)", "Preguntas"];
    
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
    getMetricTable(0, limitValue, sortValue, sortWayValue);

}

function updatePaginator(total, offset, limit, sort_by, sort_way) {
    var paginator = document.getElementById('paginator');
    paginator.innerHTML = '';  // Limpiar el contenido anterior

    var currentPage = Math.floor(offset / limit) + 1;
    var totalPages = Math.ceil(total / limit);
    var maxVisiblePages = 5; // Número máximo de páginas visibles en el rango central

    // Botón "Anterior"
    var beforeButton = document.createElement('button');
    beforeButton.innerHTML = "&larr; Anterior";
    beforeButton.disabled = currentPage === 1;
    if (currentPage > 1) {
        beforeButton.addEventListener('click', function(event) {
            event.stopPropagation();
            var prevOffset = offset - limit;
            getMetricTable(prevOffset >= 0 ? prevOffset : 0, limit, sort_by, sort_way);
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
            getMetricTable(pageOffset, limit, sort_by, sort_way);
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
    afterButton.innerHTML = "Siguiente &rarr;";
    afterButton.disabled = currentPage === totalPages;
    if (currentPage < totalPages) {
        afterButton.addEventListener('click', function(event) {
            event.stopPropagation();
            var nextOffset = offset + limit;
            getMetricTable(nextOffset < total ? nextOffset : offset, limit, sort_by, sort_way);
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

createTableHeader();
filter();