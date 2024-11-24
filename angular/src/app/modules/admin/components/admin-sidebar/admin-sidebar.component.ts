import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';
import { environment } from 'src/environments/environment';
import { resourcesUrl } from '../../../../utils/resources'
import { AdminService } from '../../services/admin.service';
import { AdminStateService } from '../../services/admin-state-service/admin-state.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  loadingMenu: boolean = true;
  resources = resourcesUrl;
  public rutaImagen: any = environment.images;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private adminService: AdminService,
    private adminStateService: AdminStateService
  ) { }
  
  
  async loadMenu() {
    this.loadingMenu = await this.adminStateService.loadMenu()

  }

  ngOnInit(): void {
    this.loadMenu()
  }
}
