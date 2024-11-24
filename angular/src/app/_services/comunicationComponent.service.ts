import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComunicationComponentService {
  private menu = new Subject<any>();
  menu$ = this.menu.asObservable();
  private space = new Subject<any>();
  space$ = this.space.asObservable();
  private isLogin = new Subject<any>();
  isLogin$ = this.isLogin.asObservable();
  private notifications = new Subject<any>();
  notifications$ = this.notifications.asObservable();
  private idClub = new Subject<any>();
  club$ = this.idClub.asObservable();
  private miniSidebar = new Subject<any>();
  miniSidebar$ = this.miniSidebar.asObservable();
  private recargaMenu = new Subject<any>();
  recargaMenu$ = this.recargaMenu.asObservable();

  /** */
  private refreshTeamOrClass = new Subject<any>();
  refreshTeamOrClass$ = this.refreshTeamOrClass.asObservable();

  private refreshClassInactive = new Subject<any>();
  refreshClassInactive$ = this.refreshClassInactive.asObservable();

  private alumn = new Subject<any>();
  alumn$ = this.alumn.asObservable();

  cambioMenu(event: any): any {
    this.menu.next(event);
  }

  login(event: any): void {
    this.isLogin.next(event);
  }

  newSpace(event: any): void {
    this.space.next(event);
  }

  openNotifications(event: any): void {
    this.notifications.next(event);
  }

  sidebarEvent(event: any): void {
    this.miniSidebar.next(event);
  }

  sendClub(event: any): void {
    this.idClub.next(event);
  }

  recargarMenuListaClubs(event: any): void {
    this.recargaMenu.next(event);
  }

  refresalumn(event: any) {
    this.alumn.next(event);
  }

  /**
   * refresh teams or classes list
   */
  refreshTeamOrClassList(event: any): void {
    this.refreshTeamOrClass.next(event);
  }

  /**
   * refresh classes after update academic yeart
   */
  refreshClassList(event: any): void {
    this.refreshClassInactive.next(event);
  }
}
