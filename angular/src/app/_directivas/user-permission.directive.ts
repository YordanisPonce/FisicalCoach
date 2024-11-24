import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppStateService } from '../stateManagement/appState.service';
import { User, UserPermission } from '../_models/user';
import { ITeam } from '../_models/ITeam.interface';

export interface PermissionMethods {
  store: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}
@Directive({
  selector: '[appUserPermission]',
})
export class UserPermissionDirective implements OnInit {
  @Input() method: string[];
  @Output() showItem = new EventEmitter<PermissionMethods>();

  constructor(private appStateService: AppStateService) {}

  user: User;
  permissions: UserPermission[];
  team: ITeam;

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.user = this.appStateService.getUserData();
    this.permissions = this.user.permissions;

    if (this.permissions.length === 0) {
      this.showItem.emit({
        store: true,
        delete: true,
        read: true,
        update: true,
      });

      return;
    }

    if (this.team?.id) this.checkTeamPermission();
  }

  /**
   * check team permission on every module
   */
  checkTeamPermission(): void {
    const findTeam = this.permissions.find(
      (permission) => permission.entity_id === this.team.id
    );

    if (!!findTeam) {
      const existingMethods = findTeam.lists.filter((item) =>
        this.method.includes(item)
      );

      const allowedMethods = existingMethods.map((item) =>
        item.split('_').pop()
      );

      if (allowedMethods.length === 0) {
        this.showItem.emit({
          read: false,
          store: false,
          update: false,
          delete: false,
        });

        return;
      }

      this.showItem.emit({
        read: allowedMethods.includes('read'),
        store: allowedMethods.includes('store'),
        update: allowedMethods.includes('update'),
        delete: allowedMethods.includes('delete'),
      });
    } else {
      this.showItem.emit({
        store: true,
        delete: true,
        read: true,
        update: true,
      });
    }

    return;
  }
}
