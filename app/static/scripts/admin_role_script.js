// Función principal para manejar roles de administrador
function adminRole() {
    close_sidebar();
    loadRoles();
}

// Cargar y mostrar los roles
function loadRoles() {
    const roles_list = document.getElementById('list-roles');
    roles_list.innerHTML = ''; // Limpiar la lista de roles

    fetch(getRolesUrl)
        .then(response => response.json())
        .then(data => {
            // Crear un elemento para cada rol
            data.forEach(role => {
                const item = createRoleItem(role);
                roles_list.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error loading roles:', error);
        });

    // Crear botón de "Crear rol"
    const createRoleButton = createElement("button", "orange-button", "Crear rol");
    createRoleButton.addEventListener('click', startModalCreateRole);

    // Añadir botón de creación al DOM
    const item = createElement('li', 'item');
    item.appendChild(createRoleButton);
    roles_list.appendChild(item);
}

// Crear un elemento de rol
function createRoleItem(role) {
    const { id, role_name, permissions } = role;

    // Crear el contenedor principal del rol
    const item = createElement('li', 'item');

    // Detalles del rol
    const item_detail = createElement('div', 'item-details');
    const star = createElement('span', 'icon', '★');
    const text = createElement('div', 'text');
    const role_text = createElement('span', '', `Rol ${id} - ${role_name}`);
    const permisos = createElement('small', '', Array.isArray(permissions) ? permissions.join(', ') : permissions);

    // Añadir elementos al contenedor de texto y luego al detalle del rol
    text.appendChild(role_text);
    text.appendChild(permisos);
    item_detail.appendChild(star);
    item_detail.appendChild(text);
    item.appendChild(item_detail);

    // Si el rol no es un rol por defecto (ID 1 o 2), añadir acciones
    if (id !== 1 && id !== 2) {
        const actions = createElement('div', 'item-actions');
        const button_1_span = createElement('span', 'role', 'A');
        const button_2_span = createElement('span', 'icon-role', '⇅');
        
        actions.appendChild(button_1_span);
        actions.appendChild(button_2_span);
        item.appendChild(actions);
    }

    return item;
}

// Abrir el modal para crear un rol
function startModalCreateRole() {
    const modal = document.getElementById('modal');
    const modalContainer = document.getElementById('container-small');

    modal.style.display = 'block';
    modalContainer.innerHTML = ''; // Limpiar contenido anterior

    // Crear y añadir el botón de cerrar y título del modal
    const modalCloseButton = createElement("span", "modal-button", "x");
    modalCloseButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    const modalTitle = createElement("h2", "", "Crear rol");
    const form = createRoleForm();

    modalContainer.append(modalCloseButton, modalTitle, createElement("br"), form);
}

// Crear el formulario para la creación de roles
function createRoleForm() {
    const form = createElement("form", "form-group", "");
    form.method = "post";

    // Input para el nombre del rol
    const form_name_label = createElement("label", "", "Nombre del nuevo rol:");
    form_name_label.setAttribute('for', "new_role_name");
    const form_item_input = createFormInput("new_role_name", "");
    
    form.append(form_name_label, createElement("br"), form_item_input, createElement("br"), createElement("br"));

    // Input para buscar permisos
    const search_input = createFormInput("permission_search", "Buscar permiso...");
    search_input.placeholder = "Buscar permiso...";
    search_input.addEventListener('keyup', searchPermission);
    form.append(search_input, createElement("br"));

    // Campo oculto para permisos seleccionados
    const selectedPermissions = createElement("input", "hidden");
    selectedPermissions.id = "selected_permissions";
    selectedPermissions.name = "permisos";
    selectedPermissions.type = "hidden";
    form.appendChild(selectedPermissions);

    // Lista de permisos seleccionados
    const ul = createElement("ul", "", "");
    ul.id = "selectedPermissionsList";

    // Tabla de permisos
    const table = createTablePermissions();
    form.append(ul, table);

    return form;
}

// Crear un input de formulario
function createFormInput(input_id, placeholder) {
    const form_item_input = createElement("input", "modal-input");
    form_item_input.placeholder = placeholder;
    form_item_input.type = "text";
    form_item_input.id = input_id;
    form_item_input.required = true;
    return form_item_input;
}

// Crear la tabla de permisos
function createTablePermissions() {
    const tableDiv = createElement("div", "table-container", "");
    const table = createElement("table", "table");
    table.id = "permission-table";

    // Encabezado de la tabla
    const thead = createElement("thead", "", "");
    const tr = createElement("tr", "");
    tr.appendChild(createElement("th", "", "Nombre del permiso"));
    tr.appendChild(createElement("th", "", "Descripción"));
    tr.appendChild(createElement("th", "", "Agregar/Quitar"));
    thead.appendChild(tr);

    const tbody = createElement("tbody", "", "");
    addPermissionToTableBody(tbody);
    table.append(thead, tbody);

    tableDiv.appendChild(table);
    return tableDiv;
}

// Añadir permisos a la tabla de permisos
function addPermissionToTableBody(tbody) {
    fetch(getPermissionsUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(perm => {
                const { id, name, description } = perm;
                const item = createElement("tr", "");

                // Crear columnas de nombre, descripción y botón
                item.appendChild(createElement("td", "", name));
                item.appendChild(createElement("td", "", description));

                // Botón para agregar o quitar permiso
                const button = createElement("button", "", "Agregar");
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    togglePermiso(id, name);
                    button.textContent = button.textContent === 'Agregar' ? 'Quitar' : 'Agregar';
                });
                item.appendChild(button);

                tbody.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error loading permissions:', error);
        });
}

// Manejador de permisos seleccionados
let permisosSeleccionados = [];
function togglePermiso(id, nombre) {
    const index = permisosSeleccionados.indexOf(id);
    const selectedPermissionsInput = document.getElementById('selected_permissions');
    const selectedPermissionsList = document.getElementById('selectedPermissionsList');
    
    if (index > -1) {
        // Eliminar permiso
        permisosSeleccionados.splice(index, 1);
        document.getElementById(`selected-permiso-${id}`).remove();
    } else {
        // Añadir permiso
        permisosSeleccionados.push(id);
        const listItem = createElement('li', '', nombre);
        listItem.id = `selected-permiso-${id}`;
        selectedPermissionsList.appendChild(listItem);
    }

    // Actualizar el input oculto con los IDs seleccionados
    selectedPermissionsInput.value = permisosSeleccionados.join(',');
}

// Buscar y filtrar permisos en la tabla
function searchPermission() {
    const input = document.getElementById("permission_search");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("permission-table");
    const tr = table.getElementsByTagName("tr");

    // Recorrer filas y ocultar las que no coincidan con el filtro
    for (let i = 1; i < tr.length; i++) { // Iniciar en 1 para evitar el encabezado
        const td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            const txtValue = td.textContent || td.innerText;
            tr[i].style.display = (txtValue.toUpperCase().indexOf(filter) > -1) ? "" : "none";
        }
    }
}

// Inicializar la carga de roles
adminRole();
