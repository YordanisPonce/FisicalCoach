import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppStateService } from '../stateManagement/appState.service';
import { ITeam } from '../_models/ITeam.interface';
import { User, UserPermission } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard  {
  user: User;
  permissions: UserPermission[];
  team: ITeam;

  constructor(
    private appStateService: AppStateService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.team = this.appStateService.getTeam();

    this.team = this.appStateService.getTeam();
    this.user = this.appStateService.getUserData();
    this.permissions = this.user.permissions;

    const routePermission = route.data?.permissions;

    this.checkTeamPermission(routePermission);

    return true;
  }

  /**
   * check team permission on every module
   */
  checkTeamPermission(permission: string): boolean {
    const findTeam = this.permissions.find(
      (permission) => permission.entity_id === this.team?.id
    );

    if (!!findTeam) {
      const methosExist = findTeam.lists.find((item) => permission === item);

      if (methosExist) return true;
      this.appStateService.resetClub();
      this.appStateService.resetSchool();
      this.appStateService.resetTeamOrClass();
      this.router.navigate(['/inicio']);
      return false;
    }

    return true;
  }
}
