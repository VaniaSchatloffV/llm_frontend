const loadingSpinner = document.getElementById('loading-spinner');

function showSpinner(){
    loadingSpinner.style.display = "block";
}

function hideSpinner(){
    loadingSpinner.style.display = "none";
}

async function adminRole() {
    close_sidebar();
    loadRoles();
}

function loadRoles() {
    showSpinner();
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
            hideSpinner();

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
        const button_update = createElement('span', 'role', '✏️');
        button_update.addEventListener('click', function(){
            updateRole(id, role_name, permissions);
        });
        const button_delete = createElement('span', 'icon-role', '🗑');
        button_delete.addEventListener('click', function(){
            if (confirm("¿Desea eliminar el rol " + role_name + "?")){
                fetch(deleteRoleUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'role_id': id
                    })
                }).then(response => response.json()) // Procesar la respuesta como JSON
                .then(data => {
                        loadRoles();
                        document.getElementById('modal').style.display = "none";
                });
            }
        });
        actions.appendChild(button_update);
        actions.appendChild(button_delete);
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
        permisosSeleccionados = []
    });

    const modalTitle = createElement("h2", "", "Crear rol");
    modalContainer.append(modalCloseButton, modalTitle);
    createRoleForm(modalContainer);

}

// Crear el formulario para la creación de roles
function createRoleForm(modalContainer) {

    // Input para el nombre del rol
    const form_name_label = createElement("label", "", "Nombre del nuevo rol:");
    form_name_label.setAttribute('for', "new_role_name");
    const form_item_input = createFormInput("new_role_name", "");
    
    modalContainer.append(form_name_label, form_item_input, createElement("br"));

    // Input para buscar permisos
    const search_input = createFormInput("permission_search", "Buscar permiso...", false);
    search_input.placeholder = "Buscar permiso...";
    search_input.addEventListener('keyup', searchPermission);
    modalContainer.append(search_input);

    // Campo oculto para permisos seleccionados
    const selectedPermissions = createElement("input", "hidden");
    selectedPermissions.id = "selected_permissions";
    selectedPermissions.name = "permisos";
    selectedPermissions.type = "hidden";
    modalContainer.appendChild(selectedPermissions);

    // Lista de permisos seleccionados
    const ul = createElement("ul", "", "");
    ul.id = "selectedPermissionsList";

    // Tabla de permisos
    const table = createTablePermissions();
    modalContainer.append(ul, table);

    var buttonSubmit = createElement("button", "orange-button", "Crear rol");
    buttonSubmit.type = "submit";
    buttonSubmit.addEventListener('click', function(){
        createRole();
    });
    modalContainer.appendChild(buttonSubmit);
}


function createRoleFormUpdate(modalContainer, role_id, role_name, permissions) {

    const form_name_label = createElement("label", "", "Nombre del rol:");
    form_name_label.setAttribute('for', "new_role_name");
    const form_item_input = createFormInput("new_role_name", "", false);
    form_item_input.value = role_name;
    
    modalContainer.append(form_name_label, form_item_input, createElement("br"));

    const search_input = createFormInput("permission_search", "Buscar permiso...", false);
    search_input.placeholder = "Buscar permiso...";
    search_input.addEventListener('keyup', searchPermission);
    modalContainer.append(search_input);

    const selectedPermissions = createElement("input", "hidden");
    selectedPermissions.id = "selected_permissions";
    selectedPermissions.name = "permisos";
    selectedPermissions.type = "hidden";
    modalContainer.appendChild(selectedPermissions);

    const ul = createElement("ul", "", "");
    ul.id = "selectedPermissionsList";

    const table = createTablePermissions(permissions);
    modalContainer.append(ul, table);

    var buttonSubmit = createElement("button", "orange-button", "Actualizar rol");
    buttonSubmit.type = "submit";
    buttonSubmit.addEventListener('click', function(){
        updateRoleCall(role_id, role_name, permissions);
    });
    modalContainer.appendChild(buttonSubmit);
}

function getSelectedPermissionsArray(selectedPermissionsList) {
    const permissionsArray = [];
    const listItems = selectedPermissionsList.getElementsByTagName('li');
    
    for (let i = 0; i < listItems.length; i++) {
        const permissionText = listItems[i].textContent || listItems[i].innerText;
        permissionsArray.push(permissionText);
    }

    return permissionsArray;
}

function splitStringByCommaSpace(str) {
    return str.split(', ').map(s => s.trim());
}

function compareArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
            return false;
        }
    }
    return true;
}


function updateRoleCall(role_id, role_name, permissions){
    const roleNameInput = document.getElementById("new_role_name").value;
    const selectedPermissionsInput = document.getElementById("selected_permissions").value;
    const selectedPermissionsList = document.getElementById('selectedPermissionsList');
    const selectedPermissionsListArray = getSelectedPermissionsArray(selectedPermissionsList);
    const permisos = splitStringByCommaSpace(permissions); 
    if (!selectedPermissionsInput) {
        alert("Debe agregar permisos al rol.");
        return;
    }
    if (roleNameInput == role_name && compareArrays(permisos, selectedPermissionsListArray)) {
        alert("No ha hecho ningún cambio en el rol.");
        return;
    }
    fetch(updateRoleUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'role_id': role_id,
            'new_role_name': roleNameInput,
            'permissions': selectedPermissionsInput
        })
    })
    .then(response => {
        response.json()
    }).then(data => {
            loadRoles();
            document.getElementById('modal').style.display = "none";
    });
}

function updateRole(role_id, role_name, permissions) {
    const modal = document.getElementById('modal');
    const modalContainer = document.getElementById('container-small');

    modal.style.display = 'block';
    modalContainer.innerHTML = '';

    const modalCloseButton = createElement("span", "modal-button", "x");
    modalCloseButton.addEventListener('click', () => {
        modal.style.display = 'none';
        permisosSeleccionados = [];
    });

    const modalTitle = createElement("h2", "", "Actualizar rol " + role_id + " - " + role_name);
    const modalDescription = createElement("p", "", "En esta sección puede cambiar los atributos que desee del rol");
    modalContainer.append(modalCloseButton, modalTitle, modalDescription);
    createRoleFormUpdate(modalContainer, role_id, role_name, permissions);
}

// Crear un input de formulario
function createFormInput(input_id, placeholder, required = true) {
    const form_item_input = createElement("input", "modal-input");
    form_item_input.placeholder = placeholder;
    form_item_input.type = "text";
    form_item_input.id = input_id;
    form_item_input.required = required;
    return form_item_input;
}

// Crear la tabla de permisos
function createTablePermissions(permissions=[]) {
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
    addPermissionToTableBody(tbody, permissions);
    table.append(thead, tbody);

    tableDiv.appendChild(table);
    return tableDiv;
}

// Añadir permisos a la tabla de permisos
function addPermissionToTableBody(tbody, permissions=[]) {
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
                if (permissions.includes(name)){
                    togglePermiso(id, name);
                    button.textContent = "Quitar";
                }
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    togglePermiso(id, name);
                    button.textContent = button.textContent === 'Agregar' ? 'Quitar' : 'Agregar';
                });
                item.appendChild(button);

                tbody.appendChild(item);
            });
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

function createRole() {
    const roleNameInput = document.getElementById("new_role_name").value;
    const selectedPermissionsInput = document.getElementById("selected_permissions").value;

    // Validar que se haya ingresado un nombre de rol y al menos un permiso
    if (!roleNameInput || !selectedPermissionsInput) {
        alert("Por favor, ingresa un nombre para el rol y selecciona al menos un permiso.");
        return;
    }

    // Hacer la solicitud POST al servidor
    fetch(addRoleUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'new_role_name': roleNameInput,
            'permissions': selectedPermissionsInput
        })
    })
    .then(response => response.json()) // Procesar la respuesta como JSON
    .then(data => {
            loadRoles();
            document.getElementById('modal').style.display = "none";
    });
}

adminRole();
