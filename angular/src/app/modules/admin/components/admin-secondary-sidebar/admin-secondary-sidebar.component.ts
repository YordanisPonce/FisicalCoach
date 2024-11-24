import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminStateService } from '../../services/admin-state-service/admin-state.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-secondary-sidebar',
  templateUrl: './admin-secondary-sidebar.component.html',
  styleUrls: ['./admin-secondary-sidebar.component.scss']
})
export class AdminSecondarySidebarComponent implements OnInit {
  loadingMenu: boolean = true;
  pathSelected: string = '';
  // item: any;


  secondarySidebarMenu: any[] = [
    {
      // image: 'house.png',
      route: '/admin/dashboard/users/',
      code: 'users',
    },
    {
      // image: 'group.svg',
      route: '/admin/dashboard/plans/',
      code: 'plans',
    },
    {
      // image: 'group.svg',
      route: '/admin/dashboard/bills/',
      code: 'bills',
    },
  ];

  constructor(
    private router: Router,
    private adminService: AdminService,
    private adminStateService: AdminStateService
  ) { }

  async loadMenu() {
    this.loadingMenu = await this.adminStateService.loadMenu()

  }

  ngOnInit(): void {
    this.loadMenu()
  }


  navegar(item: any): void {
    // this.showClubTeams = false;
    // this.closeSidebar.emit(false);
    this.router.navigate([item.route]);
  }

}
