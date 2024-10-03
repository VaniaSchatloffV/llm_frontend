from .permissions import initialize_data as initialize_permissions
from .users import initialize_data as initialize_users
from .roles import initialize_data as initialize_roles
from .role_permission_assoc import initialize_data as initialize_role_perm_assoc


def initialize_models():
    initialize_roles()
    initialize_permissions()
    initialize_users()
    initialize_role_perm_assoc()