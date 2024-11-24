import { Injectable } from '@angular/core';
import { AppStateService } from '../stateManagement/appState.service';
import { Permission } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AlertsApiService {
  userPermissions: Permission;

  constructor(private appStateService: AppStateService) {}

  getUserPermissions(): Permission[] {
    return this.appStateService.getUserData()?.entity_permissions || [];
  }

  checkPermission = (name: string, entity_code: string, entity_id: number) => {
    const permissions = this.getUserPermissions();

    const findPermission = permissions.find(
      (permission) =>
        permission.name === name &&
        permission.entity_code === entity_code &&
        permission.pivot.entity_id === entity_id
    );

    if (!!findPermission) {
      return true;
    } else {
      return false;
    }
  };
}
