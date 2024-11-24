import { Component } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';  // Importamos el servicio
import { User } from '../../../../_models/user';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent {
  searchText: string = ''; 
  filteredUsers: any[] = []; 
  selectedUsers: any[] = [];  // Usuarios seleccionados para asignar permisos
  showConfirmationMessage: boolean = false;

  // Estado de si "Todos los permisos" está seleccionado
  allPermissionsSelected: boolean = false;

  // Objeto que almacena el estado de apertura de cada fila
  isOpen: { [key: string]: boolean } = {
    'competition': false,
    'partidos': false,
    'scouting': false,
    'diseño': false,
    'jugadores': false,
    'test': false,
    'fichas': false,
    'riesgo': false,
    'rdf': false,

  };

  constructor(private userService: UserService) { }  // Inyectamos el servicio

// Método para manejar la selección de un usuario
toggleUserSelection(user: any): void {
  const index = this.selectedUsers.findIndex(u => u.id === user.id);
  if (index === -1) {
    // Si el usuario no está seleccionado, lo añadimos
    this.selectedUsers.push(user);
  } else {
    // Si el usuario ya está seleccionado, lo eliminamos
    this.selectedUsers.splice(index, 1);
  }
}

  // Objeto para almacenar el estado de los permisos
  permissions: { [key: string]: any } = {
    'club': { create: false },
    'team': { create: false },
    'competition': { create: false, read: false, delete: false },
    'matches': { create: false, read: false, delete: false },
    'scouting': { create: false, read: false, delete: false },
    'design': { create: false, read: false, delete: false },
    'sessions': { create: false, read: false, delete: false },
    'players': { create: false, read: false, delete: false },
    'test': { create: false, read: false, delete: false },
    'files': { create: false, read: false, delete: false },
    'risk': { create: false, read: false, delete: false },
    'rfd': { create: false, read: false, delete: false }

  };


  // Método para alternar el estado de visibilidad de las filas
  toggleRow(row: string): void {
    this.isOpen[row] = !this.isOpen[row];  // Cambia el estado de la fila
  }

  // Método para evitar la propagación del evento en los checkboxes
  preventClickPropagation(event: Event): void {
    event.stopPropagation();
  }

  // Método para seleccionar o deseleccionar todas las casillas de verificación
  toggleAllPermissions(): void {
    this.allPermissionsSelected = !this.allPermissionsSelected;

    // Actualiza el estado de cada permiso
    for (let key in this.permissions) {
      for (let perm in this.permissions[key]) {
        this.permissions[key][perm] = this.allPermissionsSelected;
      }
    }
  }

  // Método para contar las checkboxes dentro de una fila
  getCheckboxCount(row: string): number {
    const checkboxCounts: { [key: string]: number } = {
      'club': 1,
      'team': 1,
      'competition': 3,
      'matches': 3,
      'scouting': 3,
      'design': 3,
      'sessions': 3,
      'players': 3,
      'test': 3,
      'files': 3,
      'risk': 3,
      'rfd': 3,
    };

    return checkboxCounts[row] || 0;
  }
  
  // Método para conceder permisos a los usuarios seleccionados
  grantPermissions(): void {
    if (this.selectedUsers.length > 0) {
      const userIds: number[] = this.selectedUsers.map(user => Number(user.id));  // Convertimos los IDs a números
      const permissions = this.getPermissionsForUsers();  // Obtienes los permisos de todos los usuarios
  
      // Llamada al servicio para conceder permisos a todos los usuarios seleccionados
      this.userService.grantPermissions(userIds, permissions).subscribe(
        (response) => {
          this.showConfirmationMessage = true;  // Muestra el mensaje de éxito
          setTimeout(() => {
            this.showConfirmationMessage = false;  // Oculta el mensaje después de 3 segundos
          }, 3000);
        },
        (error) => {
          console.error('Error al conceder permisos:', error);
        }
      );
    } else {
      alert('No se han seleccionado usuarios');
    }
  }
  getPermissionsForUsers(): string[] {
    const userPermissions: string[] = [];
  
    // Itera sobre todas las entidades de permisos
    for (const key in this.permissions) {
      // Si el permiso "create" está activado, lo añadimos a la lista
      if (this.permissions[key].create) {
        userPermissions.push(`${key}:create`);
      }
  
      // Si el permiso "read" está activado, lo añadimos a la lista
      if (this.permissions[key].read) {
        userPermissions.push(`${key}:read`);
      }
  
      // Si el permiso "delete" está activado, lo añadimos a la lista
      if (this.permissions[key].delete) {
        userPermissions.push(`${key}:delete`);
      }
    }
  
    return userPermissions;  // Devuelve el array de permisos
  }
  


  // Método para buscar usuarios
  searchUsers(): void {
    this.userService.searchUsers(this.searchText).subscribe(
      (response) => {
        this.filteredUsers = response.users;  // Asignamos la lista de usuarios filtrados
      },
      (error) => {
        console.error('Error al buscar usuarios:', error);
      }
    );
  }
}
