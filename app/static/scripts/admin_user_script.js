const loadingSpinner = document.getElementById('loading-spinner');

function showSpinner(){
    loadingSpinner.style.display = "block";
}

function hideSpinner(){
    loadingSpinner.style.display = "none";
}

function addRoleToUser(role_id, user_id){
    fetch(addRoleUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'role_id': role_id,
            'user_id': user_id
        })
    }).then(response =>{
        loadUsers();
        document.getElementById('modal').style.display = "none";
    });
}

function searchRole() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("roleInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("tablaRoles");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
}


function createTableRole(userId, userFullName, userActualRoleId) {
    const tableDiv = createElement("div", "table-container", "");
    const table = createElement("table", "table");
    table.id = "tablaRoles";
    
    // Encabezado de la tabla
    const header = createElement("thead");
    const headerRow = createElement("tr");
    const col1 = createElement("th", "", "Nombre rol");
    const col2 = createElement("th", "", "Permisos rol");
    
    headerRow.append(col1, col2, createElement("th"));
    header.appendChild(headerRow);
    table.appendChild(header);
    
    const tableBody = createElement("tbody");
    
    // Obtiene los roles desde el servidor
    fetch(getRolesUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(role => {
                const row = createElement("tr");
                const nombre = createElement("td", "", role.role_name);
                const permisos = createElement("td", "", role.permissions);
                
                const buttonAddRole = createElement("button", "logout", "Agregar");
                buttonAddRole.addEventListener('click', () => {
                    if (userActualRoleId == role.id) {
                        confirm("El usuario " + userFullName + " ya es " + role.role_name);
                    }
                    else if (confirm("¿Está seguro(a) de cambiar el rol de " + userFullName + " a " + role.role_name + "?") == true){
                        addRoleToUser(role.id, userId);
                    }
                });

                row.append(nombre, permisos, buttonAddRole);
                tableBody.appendChild(row);
            });
            table.appendChild(tableBody);
        })
        .catch(error => {
            console.error('Error loading roles:', error);
        });
    tableDiv.appendChild(table);
    return tableDiv; // Retorna la tabla completa
}

function createUserRoleModal(userId, userFullName, role_id) {
    const modal = document.getElementById('modal');
    const modalContainer = document.getElementById('container-small');
    
    modal.style.display = 'block';

    modalContainer.innerHTML = '';

    const modalCloseButton = createElement("span", "modal-button", "x");
    modalCloseButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    const modalTitle = createElement("h2", "", `Actualizar rol de usuario ${userFullName}`);
    const modalDescription = createElement("p", "", "Seleccione un nuevo rol para el usuario");

    const input = createElement("input", "modal-input");
    input.type = "text";
    input.placeholder = "Buscar rol...";
    input.id = "roleInput";

    const table = createTableRole(userId, userFullName, role_id);

    input.addEventListener('keyup', searchRole);
    
    modalContainer.append(modalCloseButton, modalTitle, modalDescription, input, document.createElement("br"), table);
}

function createUserItem(user) {
    const { id, name, lastname, role_id, role_name } = user;
    
    // Crear el contenedor principal 'li'
    const item = createElement('li', 'item');
    
    // Crear el contenedor de detalles
    const item_detail = createElement('div', 'item-details');
    
    // Crear el ícono de estrella
    const star = createElement('span', 'icon', '★');
    item_detail.appendChild(star);
    
    // Crear el contenedor de texto
    const text = createElement('div', 'text');
    const user_text = createElement('span', '', `Usuario ${id} - ${name} ${lastname}`);
    const user_role = createElement('small', '', role_name);
    
    text.appendChild(user_text);
    text.appendChild(user_role);
    item_detail.appendChild(text);

    // Crear el contenedor de acciones
    const actions = createElement('div', 'item-actions');
    const button_1_span = createElement('span', 'role', '⇅');
    button_1_span.title = "Cambiar rol";
    button_1_span.addEventListener('click', function() {
        createUserRoleModal(id, name + " " + lastname, role_id);
    });
    
    actions.appendChild(button_1_span);

    // Añadir detalles y acciones al elemento principal 'li'
    item.appendChild(item_detail);
    item.appendChild(actions);

    return item;
}

function loadUsers() {
    showSpinner();
    const users_list = document.getElementById('list');
    users_list.innerHTML = '';

    fetch(getUsersUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                const item = createUserItem(user);
                users_list.appendChild(item);
                hideSpinner();
            });
        })
        .catch(error => {
            console.error('Error loading users:', error);
            hideSpinner();
        });
}

function adminUser(){
    close_sidebar();
    loadUsers();
}

adminUser()