const loadingSpinner = document.getElementById('loading-spinner');

function showSpinner(){
    loadingSpinner.style.display = "block";
}

function hideSpinner(){
    loadingSpinner.style.display = "none";
}

function adminPermissions(){
    close_sidebar();
    loadPermissions();
}

function loadPermissions() {
    showSpinner();
    const permissions_list = document.getElementById('list-permissions');
    permissions_list.innerHTML = '';

    fetch(getPermissionsUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(perm => {
                const item = createPermissionItem(perm);
                permissions_list.appendChild(item);
            });
            hideSpinner();
        })
        .catch(error => {
            console.error('Error loading permissions:', error);
            hideSpinner();
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
    
    // Añadir detalles y acciones al elemento principal 'li'
    item.appendChild(item_detail);
    return item;
}

adminPermissions();