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
    item.appendChild(item_detail);

    // Crear el contenedor de acciones
    if (id != 1 && id != 2){
        // No agregar botones de modificación de permisos a los roles por defecto
        const actions = createElement('div', 'item-actions');
        const button_1_span = createElement('span', 'role', 'A');
        const button_2_span = createElement('span', 'icon-role', '⇅');
        
        actions.appendChild(button_1_span);
        actions.appendChild(button_2_span);
        item.appendChild(actions);
    }

    return item;
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
    var createRoleButton = createElement("a", "orange-button", "Crear rol")
    const item = createElement('li', 'item');
    item.appendChild(createRoleButton);
    roles_list.appendChild(item);
}



function adminRole(){
    close_sidebar();
    loadRoles();
}

adminRole();