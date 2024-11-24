import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Package } from 'src/app/_models/package';
import { ProfieService } from 'src/app/modules/profile/profile-services/profie.service';
@Component({
  selector: 'app-admin-teacher-pack',
  templateUrl: './admin-teacher-pack.component.html',
  styleUrls: ['./admin-teacher-pack.component.scss']
})
export class AdminTeacherPackComponent implements OnInit, OnDestroy{
  
  public packages: Package[] = [];
  public subscription$: Subscription;
  p: number = 1;
  itemsPerPage = 10; // Valor inicial
  defaultSubpackage: string;
  icons: any = {
    teacher_bronze: '/assets/img/icons/teacher_bronze.svg',
    teacher_silver: '/assets/img/icons/teacher_silver.svg',
    teacher_gold: '/assets/img/icons/teacher_gold.svg',
  };
  
  dialogVisible: boolean = false;
  subpackageData: any = {};
  currentLanguage: 'es' | 'en' = 'es'; // Idioma actual
  constructor(private http: ProfieService, private dialog: MatDialog) {}


  ngOnInit(): void {

    this.getSubscriptionPackages();
    this.defaultSubpackage = 'codigo-de-subpaquete-por-defecto';

  }


  showDialog(subpackage: any) {
    
    this.dialogVisible = true;
    this.subpackageData = subpackage
    console.log('dialogVisible >>>>>', this.dialogVisible);

    
  }

  hideDialog(event: any) {
    this.dialogVisible = false;
    /* if (event) {
      this.cargarJugadores();
    } */
  }

  private getSubscriptionPackages(): void {
    this.subscription$ = this.http.getPackeges().subscribe((res: any) => {
      this.packages = res.data;
      console.log(this.packages);//aqui obtengo todos los paquetes y arriba los paso al modal
    });
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
