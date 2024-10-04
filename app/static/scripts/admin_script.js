function adminUser(){
    var user_view = document.getElementById('user_div');
    var role_view = document.getElementById('role_div');
    var permissions_view = document.getElementById('permissions_div');
    user_view.style.display = "block";
    role_view.style.display = "none";
    permissions_view.style.display = "none";
    close_sidebar();
    loadUsers();
}

function adminRole(){
    var user_view = document.getElementById('user_div');
    var role_view = document.getElementById('role_div');
    var permissions_view = document.getElementById('permissions_div');
    user_view.style.display = "none";
    role_view.style.display = "block";
    permissions_view.style.display = "none";
    close_sidebar();
    loadRoles();
}

function adminPermissions(){
    var user_view = document.getElementById('user_div');
    var role_view = document.getElementById('role_div');
    var permissions_view = document.getElementById('permissions_div');
    user_view.style.display = "none";
    role_view.style.display = "none";
    permissions_view.style.display = "block";
    close_sidebar();
    loadPermissions();
}

function loadUsers() {
    const users_list = document.getElementById('list');
    users_list.innerHTML = '';

    fetch(getUsersUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                const item = createUserItem(user);
                users_list.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error loading users:', error);
        });
}

function loadRoles() {
    const roles_list = document.getElementById('list-roles');
    roles_list.innerHTML = '';

    fetch(getRolesUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(role => {
                const item = createRoleItem(role);
                roles_list.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error loading roles:', error);
        });
}

function loadPermissions() {
    const permissions_list = document.getElementById('list-permissions');
    permissions_list.innerHTML = '';

    fetch(getPermissionsUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(perm => {
                const item = createPermissionItem(perm);
                permissions_list.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error loading permissions:', error);
        });
}

function createUserItem(user) {
    const { id, name, lastname, role_name } = user;
    
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
        createUserRoleModal(id, name + " " + lastname);
    });
    
    actions.appendChild(button_1_span);

    // Añadir detalles y acciones al elemento principal 'li'
    item.appendChild(item_detail);
    item.appendChild(actions);

    return item;
}

function createRoleItem(role) {
    const { id, role_name, permissions} = role;
    
    // Crear el contenedor principal 'li'
    const item = createElement('li', 'item');
    
    // Crear el contenedor de detalles
    const item_detail = createElement('div', 'item-details');
    
    // Crear el ícono de estrella
    const star = createElement('span', 'icon', '★');
    item_detail.appendChild(star);
    
    // Crear el contenedor de texto
    const text = createElement('div', 'text');
    const role_text = createElement('span', '', `Rol ${id} - ${role_name}`);
    const permisos = createElement('small', '', permissions);
    
    text.appendChild(role_text);
    text.appendChild(permisos);
    item_detail.appendChild(text);

    // Crear el contenedor de acciones
    const actions = createElement('div', 'item-actions');
    const button_1_span = createElement('span', 'role', 'A');
    const button_2_span = createElement('span', 'icon-role', '⇅');
    
    actions.appendChild(button_1_span);
    actions.appendChild(button_2_span);

    // Añadir detalles y acciones al elemento principal 'li'
    item.appendChild(item_detail);
    item.appendChild(actions);

    return item;
}

function createPermissionItem(perm) {
    const { id, name, description} = perm;
    
    // Crear el contenedor principal 'li'
    const item = createElement('li', 'item');
    
    // Crear el contenedor de detalles
    const item_detail = createElement('div', 'item-details');
    
    // Crear el ícono de estrella
    const star = createElement('span', 'icon', '★');
    item_detail.appendChild(star);
    
    // Crear el contenedor de texto
    const text = createElement('div', 'text');
    const permission_text = createElement('span', '', `Permiso ${id} - ${name}`);
    const descripcion = createElement('small', '', description);
    
    text.appendChild(permission_text);
    text.appendChild(descripcion);
    item_detail.appendChild(text);

    // Crear el contenedor de acciones
    const actions = createElement('div', 'item-actions');
    const button_1_span = createElement('span', 'role', 'A');
    const button_2_span = createElement('span', 'icon-role', '⇅');
    
    actions.appendChild(button_1_span);
    actions.appendChild(button_2_span);

    // Añadir detalles y acciones al elemento principal 'li'
    item.appendChild(item_detail);
    item.appendChild(actions);

    return item;
}


function createUserRoleModal(user_id, user_full_name){
    var modal = document.getElementById('modal');
    modal.style.display='block';
    var modalContainer = document.getElementById('container-small');
    var modalCloseButton = createElement("span", "modal-button", "x");
    modalCloseButton.addEventListener('click', function(){
        modal.style.display='none';
    })
    modalContainer.innerHTML = '';
    var modalTitle = createElement("h2", "", "Actualizar rol de usuario " + user_full_name);
    var modalDescription = createElement("p", "", "Seleccione un nuevo rol para el usuario");

    var input = createElement("input", "modal-input")
    input.type = "text";
    input.placeholder = "Buscar rol...";
    input.id = "roleInput";
    var table = createElement("table", "table");
    table.id = "tablaRoles";
    var header_blue = document.createElement("thead");
    var header = document.createElement("tr");
    var col1 = createElement("th", "", "Nombre rol");
    header.appendChild(col1);
    var col2 = createElement("th", "", "Permisos rol");
    header.appendChild(col2);
    header.appendChild(createElement("th"));
    header_blue.append(header);
    table.appendChild(header_blue);
    var tableBody = createElement("tbody");
    fetch(getRolesUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(role => {
                var fila = document.createElement("tr");
                var nombre = createElement("td", "", role.role_name);
                var permisos = createElement("td", "", role.permissions);
                var botonAgregarRol = createElement("button", "logout", "Agregar");
                botonAgregarRol.addEventListener('click', function(){
                    console.log("AGREGANDO ROL "+role.id + " a usuario " + user_id);
                });
                fila.appendChild(nombre);
                fila.appendChild(permisos);
                fila.appendChild(botonAgregarRol);
                tableBody.appendChild(fila);
            });
            table.appendChild(tableBody);
        })
        .catch(error => {
            console.error('Error loading roles:', error);
        });

    input.onkeyup = function() {
        searchRole();
    };
    modalContainer.appendChild(modalCloseButton);
    modalContainer.appendChild(modalTitle);
    modalContainer.appendChild(modalDescription);
    modalContainer.appendChild(input);
    modalContainer.appendChild(document.createElement("br"));
    modalContainer.appendChild(table);
}

function createElement(tag, className = '', textContent = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
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

adminUser();