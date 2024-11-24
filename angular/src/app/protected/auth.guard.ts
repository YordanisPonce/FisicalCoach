import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {


  constructor(public router: Router,
    private authenticationService: AuthenticationService) {

  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.isLogin()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }


}
