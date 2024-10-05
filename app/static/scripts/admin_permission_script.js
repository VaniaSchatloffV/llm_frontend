
function adminPermissions(){
    close_sidebar();
    loadPermissions();
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

adminPermissions();