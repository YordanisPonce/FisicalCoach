import { Component } from '@angular/core';
import { User } from '../../../../../../_models/user';
import { UserService } from '../../../../services/user-service/user.service';  // Importamos el servicio

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent {

  searchText: string = ''; 
  filteredUsers: any[] = []; 
  selectedUsers: any[] = [];  // Usuarios seleccionados para asignar permisos
  constructor(private userService: UserService) { }  // Inyectamos el servicio
  ngOnInit(): void {
    this.loadUsers();  // Cargamos los usuarios al inicio
  }

  // Método para cargar los usuarios desde el backend
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => {
        this.filteredUsers = response.users;  // Asignamos la lista de usuarios del backend
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
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


  selectUser(user: any) {
    if (!this.selectedUsers.includes(user)) { 
      this.selectedUsers.push(user);          
    }
    this.searchText = ''; 
    this.filteredUsers = [];
  }

  // Deseleccionar un usuario
  deselectUser(user: any) {
    this.selectedUsers = this.selectedUsers.filter(u => u !== user); // Eliminar de la lista de seleccionados
  }

  isSelected(user: any): boolean {
    return this.selectedUsers.includes(user);
  }
}
