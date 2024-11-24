import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AdminService } from './services/admin.service'

@Component({
  selector: 'app-superadmin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly adminService: AdminService
  ) {}
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.isAdmin = this.authenticationService.isLogin() && this.adminService.isAdmin();
  }
}
