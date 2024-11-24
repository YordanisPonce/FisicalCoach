import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AlumnsService } from '../_services/alumns.service';
import { AppStateService } from '../stateManagement/appState.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnDataResolverResolver  {
  constructor(
    private alumnsService: AlumnsService,
    private appStateService: AppStateService
  ){

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):any {
    // return of(true);
    console.log(route)
    console.log('activo el resolve')
    this.alumnos(route)
  }

  async alumnos(route:ActivatedRouteSnapshot){
    return this.alumnsService.getAlumnDetails(route.paramMap.get('alumnId')!,this.appStateService.getClassroomAcademicYear()).subscribe((res:any) => {
      console.log(res)
      this.appStateService.setAlumn(res.data)
    })
  }
}
